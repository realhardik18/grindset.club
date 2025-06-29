"use client"

import { useEffect, useState } from "react"
import Sidenav from "../../components/Sidenav"
import Link from "next/link"
import {
  CheckCircle,
  Circle,
  Clock,
  Target,
  Calendar,
  Flag,
  Loader2,
  Filter,
  Search,
  ArrowRight,
  Zap,
  Award,
  AlertCircle,
  Plus,
} from "lucide-react"

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [updatingTask, setUpdatingTask] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, goalsRes] = await Promise.all([fetch("/api/get-tasks-all"), fetch("/api/get-goals")])

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json()
          setTasks(tasksData)
        }

        if (goalsRes.ok) {
          const goalsData = await goalsRes.json()
          setGoals(goalsData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleToggleComplete = async (task) => {
    setUpdatingTask(task._id)
    const newStatus = task.status === "completed" ? "pending" : "completed"

    // Optimistically update UI
    setTasks((tasks) => tasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)))

    try {
      await fetch("/api/update-task-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task._id, status: newStatus }),
      })

      // If marking as completed, prompt for feedback and generate next task
      if (newStatus === "completed") {
        const feedback = window.prompt(
          "Great job! Please provide feedback on this task (what went well, what was hard, etc.):",
        )

        if (feedback) {
          // Fetch goal context
          const goalRes = await fetch(`/api/get-goals?id=${task.goal_id}`)
          const goal = goalRes.ok ? (await goalRes.json())[0] : null

          // Send to API to generate next task
          await fetch("/api/generate-next-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              goal,
              lastTask: task,
              feedback,
            }),
          })
        }
      }
    } catch (error) {
      console.error("Failed to update task:", error)
      // Revert optimistic update on error
      setTasks((tasks) => tasks.map((t) => (t._id === task._id ? { ...t, status: task.status } : t)))
    } finally {
      setUpdatingTask(null)
    }
  }

  const getGoalForTask = (goalId) => {
    return goals.find((goal) => goal._id === goalId)
  }

  const getTaskPriority = (task) => {
    if (task.deadline) {
      const deadline = new Date(task.deadline)
      const today = new Date()
      const daysUntilDeadline = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))

      if (daysUntilDeadline < 0) return "overdue"
      if (daysUntilDeadline <= 2) return "urgent"
      if (daysUntilDeadline <= 7) return "high"
    }
    return "normal"
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true
      if (filter === "overdue") return getTaskPriority(task) === "overdue"
      if (filter === "urgent") return getTaskPriority(task) === "urgent"
      return task.status === filter
    })
    .filter((task) => task.task_text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Sort by priority first, then by step number
      const priorityOrder = { overdue: 0, urgent: 1, high: 2, normal: 3 }
      const aPriority = getTaskPriority(a)
      const bPriority = getTaskPriority(b)

      if (aPriority !== bPriority) {
        return priorityOrder[aPriority] - priorityOrder[bPriority]
      }

      return (b.step || 0) - (a.step || 0)
    })

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => getTaskPriority(t) === "overdue").length,
    urgent: tasks.filter((t) => getTaskPriority(t) === "urgent").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex">
        <Sidenav />
        <div
          className="flex-1 transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{ marginLeft: "var(--sidenav-width, 16rem)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            <p className="text-lg text-zinc-400">Loading your tasks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidenav />
      <div
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: "var(--sidenav-width, 16rem)", padding: "2rem" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">All Tasks</h1>
              <p className="text-zinc-400">
                {taskStats.total === 0
                  ? "No tasks yet. Create a goal to get started"
                  : `${taskStats.total} task${taskStats.total !== 1 ? "s" : ""} across all goals`}
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          {taskStats.total > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-zinc-400">Total</span>
                </div>
                <div className="text-2xl font-bold text-white">{taskStats.total}</div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-zinc-400">Done</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{taskStats.completed}</div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <Circle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-zinc-400">Pending</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">{taskStats.pending}</div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-zinc-400">Overdue</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{taskStats.overdue}</div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-zinc-400">Urgent</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">{taskStats.urgent}</div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          {taskStats.total > 0 && (
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: "all", label: "All", icon: Target },
                    { key: "pending", label: "Pending", icon: Circle },
                    { key: "completed", label: "Done", icon: CheckCircle },
                    { key: "overdue", label: "Overdue", icon: AlertCircle },
                    { key: "urgent", label: "Urgent", icon: Zap },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        filter === key ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                      onClick={() => setFilter(key)}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tasks List */}
          {taskStats.total === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Target className="w-12 h-12 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No tasks yet</h3>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Tasks are automatically generated when you create goals. Start by creating your first goal.
              </p>
              <Link
                href="/dashboard/goals/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Goal
              </Link>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Filter className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No tasks match your filter</h3>
              <p className="text-zinc-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const goal = getGoalForTask(task.goal_id)
                const priority = getTaskPriority(task)
                const isUpdating = updatingTask === task._id

                return (
                  <div
                    key={task._id}
                    className={`bg-zinc-900 rounded-xl p-6 border transition-all duration-200 ${
                      priority === "overdue"
                        ? "border-red-500/50 bg-red-500/5"
                        : priority === "urgent"
                          ? "border-orange-500/50 bg-orange-500/5"
                          : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          disabled={isUpdating}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            task.status === "completed"
                              ? "bg-green-500 border-green-500"
                              : "border-zinc-600 hover:border-zinc-500"
                          } ${isUpdating ? "opacity-50" : ""}`}
                        >
                          {isUpdating ? (
                            <Loader2 className="w-3 h-3 animate-spin text-white" />
                          ) : task.status === "completed" ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : null}
                        </button>
                      </div>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3
                              className={`text-lg font-semibold mb-2 ${
                                task.status === "completed" ? "line-through text-zinc-500" : "text-white"
                              }`}
                            >
                              {task.task_text}
                            </h3>

                            {task.description && (
                              <p
                                className={`text-sm mb-3 ${
                                  task.status === "completed" ? "text-zinc-600" : "text-zinc-400"
                                }`}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Priority Badge */}
                          {priority !== "normal" && (
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                priority === "overdue"
                                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : priority === "urgent"
                                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {priority === "overdue" ? "Overdue" : priority === "urgent" ? "Urgent" : "High"}
                            </div>
                          )}
                        </div>

                        {/* Task Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                          {/* Goal Link */}
                          {goal && (
                            <Link
                              href={`/dashboard/goals/${goal._id}`}
                              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                            >
                              <span className="text-lg">{goal.icon}</span>
                              <span>{goal.title}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}

                          {/* Step Number */}
                          {task.step && (
                            <div className="flex items-center gap-1">
                              <Flag className="w-3 h-3" />
                              <span>Step {task.step}</span>
                            </div>
                          )}

                          {/* Deadline */}
                          {task.deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Due{" "}
                                {new Date(task.deadline).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          )}

                          {/* Status */}
                          <div
                            className={`flex items-center gap-1 ${
                              task.status === "completed" ? "text-green-400" : "text-amber-400"
                            }`}
                          >
                            {task.status === "completed" ? (
                              <Award className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span className="capitalize">{task.status}</span>
                          </div>
                        </div>

                        {/* Reason */}
                        {task.reason && (
                          <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <Flag className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-medium text-blue-300">Why This Matters</span>
                            </div>
                            <p className="text-sm text-zinc-400">{task.reason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
