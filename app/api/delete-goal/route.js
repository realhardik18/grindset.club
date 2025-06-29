import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const userId = 'hardik' // Replace with dynamic user id if available

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing goal id' }), { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    // Ensure id is a valid ObjectId string
    let query
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      return new Response(JSON.stringify({ error: 'Invalid goal id' }), { status: 400 })
    }
    const result = await db.collection('goals').deleteOne(query)
    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Goal not found' }), { status: 404 })
    }

    // Delete all tasks for this user and goal id
    await db.collection('tasks').deleteMany({
      user_id: userId,
      goal_id: new ObjectId(id)
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error', details: err.message }), { status: 500 })
  }
}
