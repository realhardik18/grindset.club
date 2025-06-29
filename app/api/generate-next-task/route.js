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
The user is working on the goal: "${goal.title}"
Goal Description: "${goal.description}"
Target Outcome: "${goal.target_outcome}"
Existing Capabilities: "${goal.existing_capabilities}"

The last completed task was: "${lastTask.task_text}"
Task Description: "${lastTask.description}"
User feedback on this task: "${feedback}"

Based on this, generate ONE next actionable task for the user to do next toward their goal.
Include:
- task_text
- reason
- description
Return as JSON.
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
