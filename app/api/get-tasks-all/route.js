import clientPromise from '@/lib/mongodb'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user')
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing user email' }), { status: 400 })
  }
  try {
    const client = await clientPromise
    const db = client.db()
    const tasks = await db
      .collection('tasks')
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray()
    return new Response(JSON.stringify(tasks), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks', details: err.message }), { status: 500 })
  }
}
