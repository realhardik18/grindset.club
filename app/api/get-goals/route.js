import clientPromise from '@/lib/mongodb'

export async function GET() {
  const userId = 'hardik' // Hardcoded user
  try {
    const client = await clientPromise
    const db = client.db()
    const goals = await db.collection('goals').find({ user_id: userId }).sort({ created_at: -1 }).toArray()
    return new Response(JSON.stringify(goals), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch goals', details: err.message }), { status: 500 })
  }
}
