import clientPromise from '@/lib/mongodb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { ObjectId } from 'mongodb'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function PUT(req) {
  const userId = 'hardik' // Replace with session logic as needed
  const body = await req.json()
  const { goalId, title, description, icon, duration, target_outcome, existing_capabilities } = body

  if (!goalId) {
    return new Response(JSON.stringify({ error: 'Missing goalId' }), { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    // Fetch task history for this goal
    const tasks = await db.collection('tasks').find({ goal_id: new ObjectId(goalId), user_id: userId }).toArray()
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const totalTasks = tasks.length

    // LLM prompt for feasibility with reasoning and progress
    const feasibilityPrompt = `
The user has set a goal: "${title}"
Description: "${description}"
Target Outcome: "${target_outcome}"
They can already: "${existing_capabilities}"
Timeline: ${duration} days

Progress so far: ${completedTasks} of ${totalTasks} tasks completed.

Is this goal realistically possible for the user to achieve in the given timeline, considering their progress so far? 
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

    const updateDoc = {
      ...(title && { title }),
      ...(description && { description }),
      ...(icon && { icon }),
      ...(duration && { duration }),
      ...(target_outcome && { target_outcome }),
      ...(existing_capabilities && { existing_capabilities }),
      feasible,
      feasibility_reason,
    }

    await db.collection('goals').updateOne(
      { _id: new ObjectId(goalId), user_id: userId },
      { $set: updateDoc }
    )

    return new Response(JSON.stringify({ success: true, feasible, feasibility_reason }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), { status: 500 })
  }
}
