import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req) {
  const goalId = req.nextUrl.searchParams.get('goal_id')
  const userId = req.nextUrl.searchParams.get('user')
  if (!goalId || !userId) {
    return new Response(JSON.stringify({ error: 'Missing goal_id or user' }), { status: 400 })
  }
  try {
    const client = await clientPromise
    const db = client.db()
    const tasks = await db
      .collection('tasks')
      .find({ goal_id: new ObjectId(goalId), user_id: userId })
      .sort({ step: 1 })
      .toArray()
    return new Response(JSON.stringify(tasks), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks', details: err.message }), { status: 500 })
  }
}
