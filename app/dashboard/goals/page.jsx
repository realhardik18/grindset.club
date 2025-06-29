'use client'

import { useEffect, useState } from 'react'
import Sidenav from '@/app/components/Sidenav'
import Link from 'next/link'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      const res = await fetch('/api/get-goals')
      if (res.ok) {
        const data = await res.json()
        setGoals(data)
      }
      setLoading(false)
    }
    fetchGoals()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidenav />
        <div className="flex-1 ml-64 p-8">
          <p className="text-gray-500 animate-pulse text-lg">Loading goals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidenav />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Goals</h1>
          <Link
            href="/dashboard/goals/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            + Create Goal
          </Link>
        </div>

        {goals.length === 0 ? (
          <p className="text-gray-400">No goals yet. Time to grind 🧠</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Link
                key={goal._id}
                href={`/dashboard/goals/${goal._id}`}
                className="block bg-zinc-900 p-4 rounded-lg border border-zinc-800 hover:border-purple-500 hover:shadow-lg transition group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold group-hover:text-purple-400 transition">
                    {goal.icon} {goal.title}
                  </p>
                  <span className="text-xs text-gray-500">
                    {goal.created_at
                      ? new Date(goal.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
