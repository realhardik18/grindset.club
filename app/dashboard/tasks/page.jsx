'use client'
import { useEffect, useState } from 'react'
import Sidenav from '../../components/Sidenav'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/get-tasks-all')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
      setLoading(false)
    }
    fetchTasks()
  }, [])

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    // Optimistically update UI
    setTasks(tasks =>
      tasks.map(t =>
        t._id === task._id ? { ...t, status: newStatus } : t
      )
    )
    await fetch('/api/update-task-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: task._id, status: newStatus }),
    })

    // If marking as completed, prompt for feedback and generate next task
    if (newStatus === 'completed') {
      const feedback = window.prompt('Great job! Please provide feedback on this task (what went well, what was hard, etc.):')
      if (feedback) {
        // Fetch goal context
        const goalRes = await fetch(`/api/get-goals?id=${task.goal_id}`)
        const goal = goalRes.ok ? (await goalRes.json())[0] : null

        // Send to API to generate next task
        await fetch('/api/generate-next-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal,
            lastTask: task,
            feedback,
          }),
        })
      }
    }
  }

  const filteredTasks = tasks.filter(task =>
    filter === 'all' ? true : task.status === filter
  )

  return (
    <div className="flex min-h-screen">
      <Sidenav />
      <div className="flex-1 transition-all duration-300 ease-in-out" style={{ marginLeft: 'var(--sidenav-width, 16rem)', padding: '2rem' }}>
        <h1 className="text-3xl font-bold mb-6">All Tasks</h1>
        <div className="mb-4 flex gap-2">
          <button
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-300'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-300'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-300'}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredTasks.map(task => (
              <li
                key={task._id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleToggleComplete(task)}
                    className="w-5 h-5 accent-purple-600"
                  />
                  <span className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.task_text}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Status: <span className={task.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>{task.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}