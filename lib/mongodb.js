// lib/mongodb.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env')
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the client is preserved
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, create a new client every time
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
