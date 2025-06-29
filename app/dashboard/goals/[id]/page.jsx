'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Sidenav from '@/app/components/Sidenav'

export default function GoalDetailPage() {
  const { id } = useParams()
  const [goal, setGoal] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGoal = async () => {
      const res = await fetch(`/api/get-goals?id=${id}`)
      if (res.ok) {
        const data = await res.json()
        setGoal(Array.isArray(data) ? data[0] : data)
      }
    }
    const fetchTasks = async () => {
      const res = await fetch(`/api/get-tasks?goal_id=${id}`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    }
    if (id) {
      fetchGoal()
      fetchTasks()
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidenav />
        <div className="flex-1 ml-64 p-8">
          <p className="text-gray-500 animate-pulse text-lg">Loading goal...</p>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <Sidenav />
        <div className="flex-1 ml-64 p-8">
          <p className="text-red-400">Goal not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidenav />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-2xl mx-auto bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{goal.icon}</span>
            <h1 className="text-3xl font-bold">{goal.title}</h1>
          </div>
          <div className="text-gray-400 text-sm mb-6">
            Created:{' '}
            {goal.created_at
              ? new Date(goal.created_at).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-purple-400 mb-1">Description</h2>
            <p className="text-gray-300">{goal.description}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-purple-400 mb-1">Existing Capabilities</h2>
            <p className="text-gray-300">{goal.existing_capabilities || <span className="text-gray-500">N/A</span>}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-purple-400 mb-1">Target Outcome</h2>
            <p className="text-gray-300">{goal.target_outcome}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-purple-400 mb-1">Duration</h2>
            <p className="text-gray-300">{goal.duration} days</p>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-purple-400 mb-2">Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks for this goal yet.</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task._id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{task.task_text}</span>
                      <span className="text-xs text-gray-400">Step {task.step}</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">{task.description}</div>
                    {task.reason && (
                      <div className="text-xs text-gray-500 italic">Reason: {task.reason}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">Status: {task.status}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
