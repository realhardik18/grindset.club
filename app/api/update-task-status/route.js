import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req) {
  const { id, status, deadline } = await req.json()
  if (!id || !status) {
    return new Response(JSON.stringify({ error: 'Missing id or status' }), { status: 400 })
  }
  try {
    const client = await clientPromise
    const db = client.db()
    const updateFields = { status }
    if (deadline) updateFields.deadline = new Date(deadline)
    await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    )
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to update task', details: err.message }), { status: 500 })
  }
}
