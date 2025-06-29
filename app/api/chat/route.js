import clientPromise from '@/lib/mongodb'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const TAVILY_API_KEY = process.env.TAVILY_API_KEY

async function callGemini(messages, tools = []) {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        tools,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error('Gemini API Error:', data)
    }
    // Extract the text response
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."
  } catch (err) {
    console.error('Gemini API Exception:', err)
    return "Sorry, I couldn't generate a response."
  }
}

async function callTavily(query) {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      search_depth: 'basic',
      include_answer: true,
      include_raw_content: false,
      include_images: false,
    }),
  })
  const data = await res.json()
  return data.answer || data.results?.[0]?.content || "No relevant web results found."
}

export async function POST(req) {
  const userId = 'hardik'
  const { message } = await req.json()
  if (!message) return new Response(JSON.stringify({ error: 'No message' }), { status: 400 })

  // Fetch last 5 user/assistant messages for context
  const client = await clientPromise
  const db = client.db()
  const lastMessages = await db.collection('chat_history')
    .find({ user_id: userId, role: { $in: ['user', 'assistant'] } })
    .sort({ created_at: -1 })
    .limit(5)
    .toArray()
  // Reverse to chronological order
  const contextMessages = lastMessages.reverse().map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.message }]
  }))

  // Step 1: Ask Gemini for intent/tool use, expect JSON with tools_needed
  const now = new Date()
  const nowString = now.toLocaleString('en-US', { timeZone: 'UTC', hour12: false })
  const geminiMessages = [
    {
      role: 'user',
      parts: [{
        text: `You are an AI assistant bot for grindset.club. Today's date and time is: ${nowString} UTC. Always respond in JSON with two keys: "tools_needed" (an array, e.g. ["tasks"], ["goals"], ["search"], or []), and "response" (your friendly message to the user). Only include tools in "tools_needed" if you need to fetch user tasks, goals, or search the web for the user's request. If you don't need any tools, set "tools_needed": []. Format your response as a JSON code block, e.g. {"tools_needed":["tasks"],"response":"Let me check your tasks."} Do not use markdown, do not use emojis, and reply in simple, friendly, plain text.`
      }]
    },
    ...contextMessages,
    {
      role: 'user',
      parts: [{ text: message }]
    }
  ]

  let reply = "Sorry, I couldn't understand your request."
  let usedTool = null
  let toolComponent = null

  try {
    // Step 2: Get Gemini's JSON response as a code block
    let geminiIntentResRaw = await callGemini(geminiMessages)
    // Extract JSON from code block if present
    let jsonMatch = geminiIntentResRaw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    let jsonString = jsonMatch ? jsonMatch[1] : geminiIntentResRaw
    let geminiIntentRes
    try {
      geminiIntentRes = JSON.parse(jsonString)
    } catch (e) {
      // fallback: treat as plain text
      geminiIntentRes = { tools_needed: [], response: geminiIntentResRaw }
    }

    let toolsNeeded = Array.isArray(geminiIntentRes.tools_needed) ? geminiIntentRes.tools_needed : []
    let toolData = {}

    // Step 3: If tools are needed, fetch data and ask Gemini to answer again
    if (toolsNeeded.length > 0) {
      let specialMessage = null
      if (toolsNeeded.includes('tasks')) {
        usedTool = 'tasks'
        specialMessage = 'Using Tasks Tool'
        const client = await clientPromise
        const db = client.db()
        const tasks = await db.collection('tasks').find({ user_id: userId }).sort({ created_at: -1 }).toArray()
        toolData.tasks = tasks
        toolComponent = { type: 'tasks', label: 'Using Tasks Tool' }
      }
      if (toolsNeeded.includes('goals')) {
        usedTool = 'goals'
        specialMessage = 'Using Goals Tool'
        const client = await clientPromise
        const db = client.db()
        const goals = await db.collection('goals').find({ user_id: userId }).sort({ created_at: -1 }).toArray()
        toolData.goals = goals
        toolComponent = { type: 'goals', label: 'Using Goals Tool' }
      }
      if (toolsNeeded.includes('search')) {
        usedTool = 'search'
        specialMessage = 'Using Web Search Tool'
        const tavilyResult = await callTavily(message)
        toolData.search = tavilyResult
        toolComponent = { type: 'search', label: 'Using Web Search Tool' }
      }

      // Add special message to chat history before the tool result
      if (specialMessage) {
        const client = await clientPromise
        const db = client.db()
        await db.collection('chat_history').insertOne({
          user_id: userId,
          role: 'system',
          message: specialMessage,
          created_at: new Date(),
          used_tool: usedTool,
          tool_component: toolComponent
        })
      }

      // Step 4: Ask Gemini to answer using the tool data
      const toolContext = Object.entries(toolData).map(([key, val]) =>
        ({
          role: 'model',
          parts: [{ text: `Tool result for "${key}": ${typeof val === 'string' ? val : JSON.stringify(val)}` }]
        })
      )
      const geminiWithTools = [
        ...geminiMessages,
        ...toolContext,
        {
          role: 'user',
          parts: [{ text: `Using the above tool results, answer the user's original question as helpfully as possible.` }]
        }
      ]
      let finalGeminiResRaw = await callGemini(geminiWithTools)
      // Try to extract JSON from code block again
      let finalJsonMatch = finalGeminiResRaw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
      let finalJsonString = finalJsonMatch ? finalJsonMatch[1] : finalGeminiResRaw
      let finalGeminiRes
      try {
        finalGeminiRes = JSON.parse(finalJsonString)
      } catch (e) {
        finalGeminiRes = { response: finalGeminiResRaw }
      }
      reply = finalGeminiRes.response || finalGeminiResRaw
    } else {
      reply = geminiIntentRes.response || geminiIntentResRaw
    }

    // Save user and assistant messages to chat history
    const client = await clientPromise
    const db = client.db()
    await db.collection('chat_history').insertMany([
      { user_id: userId, role: 'user', message, created_at: new Date() },
      {
        user_id: userId,
        role: 'assistant',
        message: reply,
        created_at: new Date(),
        used_tool: usedTool,
        tool_component: toolComponent
      }
    ])

    return new Response(JSON.stringify({ message: reply, tool_component: toolComponent }), { status: 200 })
  } catch (err) {
    console.error('Chat API Error:', err, err.stack)
    return new Response(JSON.stringify({ error: 'Chat failed', details: err.message, stack: err.stack }), { status: 500 })
  }
}
