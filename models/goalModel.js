// models/goalModel.js
import clientPromise from '@/lib/mongodb'

export async function createGoal(goalData, userId) {
  const client = await clientPromise
  const db = client.db('grindset')
  const goalsCollection = db.collection('goals')

  const newGoal = {
    userId,
    ...goalData,
    createdAt: new Date(),
    updatedAt: new Date(),
    step: 1,
    status: 'active', // 'active', 'completed'
    history: [], // to log task generation history
  }

  const result = await goalsCollection.insertOne(newGoal)
  return result.insertedId
}

export async function getGoals(userId) {
  const client = await clientPromise
  const db = client.db('grindset')
  return await db.collection('goals').find({ userId }).sort({ createdAt: -1 }).toArray()
}
