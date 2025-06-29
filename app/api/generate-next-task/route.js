import clientPromise from '@/lib/mongodb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ObjectId } from 'mongodb'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  const { goal, lastTask, feedback } = await req.json()
  if (!goal || !lastTask || !feedback) {
    return new Response(JSON.stringify({ error: 'Missing context' }), { status: 400 })
  }
  const prompt = `
  You are a no-fluff, results-driven coach helping the user achieve their goal.

  Goal: "${goal.title}"
  Goal Description: "${goal.description}"
  Target Outcome: "${goal.target_outcome}"
  Current Skills: "${goal.existing_capabilities}"

  Last Task Completed: "${lastTask.task_text}"
  Last Task Description: "${lastTask.description}"
  User Feedback: "${feedback}"

  Based on the above, generate ONE clear next task the user must do **today** to continue making progress.

  Guidelines:
  - task_text: Command-style title, max 6–8 words. Be specific and direct.
  - reason: In **1 short sentence**, explain why this task is the logical next step toward the goal. Focus on results.
  - description: In **10–12 words**, give precise instructions for what must be done today. No fluff. No motivational filler.

  Return ONLY valid JSON. Do not include anything else.
  `


  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    let json
    try {
      const match = text.match(/{[\s\S]*}/)
      json = match ? JSON.parse(match[0]) : null
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse Gemini response', details: text }),
        { status: 500 }
      )
    }

    if (!json?.task_text) {
      return new Response(
        JSON.stringify({ error: 'Invalid Gemini output', details: text }),
        { status: 500 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    // Find the max step for this goal
    const lastStep = lastTask.step || 1
    await db.collection('tasks').insertOne({
      goal_id: new ObjectId(goal._id),
      user_id: goal.user_id,
      step: lastStep + 1,
      task_text: json.task_text,
      reason: json.reason || '',
      description: json.description || '',
      status: 'pending',
      created_at: new Date(),
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to generate next task', details: err.message }), { status: 500 })
  }
}
