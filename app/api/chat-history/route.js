import clientPromise from '@/lib/mongodb'

export async function GET() {
  const userId = 'hardik'
  try {
    const client = await clientPromise
    const db = client.db()
    const history = await db
      .collection('chat_history')
      .find({ user_id: userId })
      .sort({ created_at: 1 })
      .toArray()
    // Only return role and message for frontend
    return new Response(JSON.stringify(history.map(({ role, message }) => ({ role, message }))), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch chat history', details: err.message }), { status: 500 })
  }
}
