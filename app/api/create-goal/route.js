import clientPromise from '@/lib/mongodb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ObjectId } from 'mongodb'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  const body = await req.json()
  const { user, title, description, icon, duration, target_outcome, existing_capabilities } = body
  const userId = user
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized: No user provided' }), {
      status: 401,
    })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    // LLM prompt for feasibility with reasoning
    const feasibilityPrompt = `
The user has set a goal: "${title}"
Description: "${description}"
Target Outcome: "${target_outcome}"
They can already: "${existing_capabilities}"
Timeline: ${duration} days

Is this goal realistically possible for the user to achieve in the given timeline? 
Respond with a JSON: { "feasible": true/false, "reason": "short explanation why or why not" }
`
    const feasibilityModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const feasibilityResult = await feasibilityModel.generateContent(feasibilityPrompt)
    const feasibilityText = feasibilityResult.response.text()
    let feasible = true
    let feasibility_reason = ""
    try {
      const match = feasibilityText.match(/{[\s\S]*}/)
      const parsed = match ? JSON.parse(match[0]) : { feasible: true, reason: "" }
      feasible = parsed.feasible
      feasibility_reason = parsed.reason || ""
    } catch (err) {
      feasible = true
      feasibility_reason = ""
    }

    // Create goal document
    const goalDoc = {
      title,
      description,
      icon,
      duration,
      target_outcome,
      existing_capabilities,
      user_id: userId,
      created_at: new Date(),
      feasible,
      feasibility_reason,
    }

    const goalInsert = await db.collection('goals').insertOne(goalDoc)
    const goalId = goalInsert.insertedId

const taskPrompt = `
You are a strict coach helping the user achieve their goal. 
Their goal is: "${title}"
Description: "${description}"
Target Outcome: "${target_outcome}"
Current Skills: "${existing_capabilities}"

Generate ONE concrete, actionable task the user must do **today** to begin making measurable progress.

Requirements:
- task_text: Use only **6-8 direct words**, like a clear title or command.
- reason: In **1 sentence**, explain how this specific task moves the user closer to their goal. Be practical and results-driven.
- description: In **10-12 words**, clearly instruct what the user must do today. No fluff. No motivation. Only action.

Return ONLY valid JSON. Do not include commentary or preamble.
`


    const taskModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await taskModel.generateContent(taskPrompt)
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

    const taskDoc = {
      goal_id: goalId,
      user_id: userId,
      step: 1,
      task_text: json.task_text,
      reason: json.reason || '',
      description: json.description || '',
      status: 'pending',
      created_at: new Date(),
    }

    await db.collection('tasks').insertOne(taskDoc)

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
      status: 500,
    })
  }
}