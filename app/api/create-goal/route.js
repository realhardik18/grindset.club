import clientPromise from '@/lib/mongodb'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  //const cookieStore = await cookies()
  //const session = cookieStore.get('session')
  const userId = 'hardik' // Adjust this logic to match your actual session management

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized: No session found' }), {
      status: 401,
    })
  }

  const body = await req.json()
  const {
    title,
    description,
    icon,
    duration,
    target_outcome,
    existing_capabilities,
  } = body

  try {
    const client = await clientPromise
    const db = client.db()

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
    }

    const goalInsert = await db.collection('goals').insertOne(goalDoc)
    const goalId = goalInsert.insertedId

    const prompt = `
The user has set a goal: "${title}"
Description: "${description}"
Target Outcome: "${target_outcome}"
They can already: "${existing_capabilities}"

Generate only ONE task they should do today to begin toward their goal. 
Include:
- task_text [max 6-8 words, it acts like a title]
- reason [1-2 sentences on why you picked this how it will help the user reach their goal]
- description [short description of 10-12 words of what the user should do]
Return as JSON.
`

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