"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  Target,
  CheckCircle,
  Circle,
  TrendingUp,
  Flag,
  Zap,
  Award,
  ArrowRight,
  Timer,
  Activity,
  Loader2,
  Trash2,
  X,
} from "lucide-react"
import Sidenav from "@/app/components/Sidenav"

export default function GoalDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [goal, setGoal] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [deleteError, setDeleteError] = useState("")

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
        setTasks(
          [...data].sort((a, b) => {
            if (a.step && b.step) return b.step - a.step
            return new Date(b.created_at) - new Date(a.created_at)
          }),
        )
      }
    }

    if (id) {
      setLoading(true)
      Promise.all([fetchGoal(), fetchTasks()]).finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex">
        <Sidenav />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: "var(--sidenav-width, 16rem)" }}>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            <div className="text-lg text-zinc-400">Loading goal...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex">
        <Sidenav />
        <div
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{ marginLeft: "var(--sidenav-width, 16rem)", padding: "2rem" }}
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Target className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Goal Not Found</h2>
              <p className="text-zinc-400 mb-6">The goal you're looking for doesn't exist or has been removed.</p>
              <button
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                onClick={() => router.push("/dashboard/goals")}
              >
                Back to Goals
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Calculate days left
  const createdDate = new Date(goal.created_at)
  const targetDate = new Date(createdDate.getTime() + goal.duration * 24 * 60 * 60 * 1000)
  const today = new Date()
  const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))

  // Separate current and completed tasks
  const currentTask = tasks.find((task) => task.status !== "completed") || tasks[0]
  const completedTasks = tasks.filter((task) => task.status === "completed")
  const totalTasks = tasks.length
  const completedCount = completedTasks.length
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0

  const handleDeleteGoal = async () => {
    if (deleteInput.trim() !== goal.title) {
      setDeleteError("Goal name does not match.")
      return
    }

    setDeleteError("")
    setLoading(true)

    try {
      const res = await fetch(`/api/delete-goal?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        setDeleteError(data.error || "Failed to delete goal. Please try again.")
        setLoading(false)
        return
      }
      // Only delete tasks if goal deletion succeeded
      await fetch(`/api/delete-tasks?goal_id=${id}`, { method: "DELETE" })
      router.push("/dashboard/goals")
    } catch (error) {
      setDeleteError("Failed to delete goal. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidenav />
      <div
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: "var(--sidenav-width, 16rem)", padding: "2rem" }}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center text-2xl border border-zinc-700">
                  {goal.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{goal.title}</h1>
                  <p className="text-zinc-400 text-lg max-w-2xl">{goal.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-500 mb-1">Created</div>
                <div className="text-zinc-300 font-medium mb-4">
                  {new Date(goal.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  onClick={() => setDeleting(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Goal
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-purple-400" />
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    daysLeft > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {daysLeft > 0 ? "ACTIVE" : "OVERDUE"}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{Math.abs(daysLeft)}</div>
              <div className="text-sm text-zinc-400">{daysLeft > 0 ? "days remaining" : "days overdue"}</div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xs text-blue-400 font-medium px-2 py-1 bg-blue-500/20 rounded-full">PROGRESS</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-zinc-400">
                {completedCount} of {totalTasks} completed
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xs text-emerald-400 font-medium px-2 py-1 bg-emerald-500/20 rounded-full">
                  DONE
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{completedCount}</div>
              <div className="text-sm text-zinc-400">tasks completed</div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-xs text-orange-400 font-medium px-2 py-1 bg-orange-500/20 rounded-full">
                  TARGET
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{goal.duration}</div>
              <div className="text-sm text-zinc-400">day timeline</div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Goal Progress</h3>
                  <p className="text-zinc-400 text-sm">Track your journey to success</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-zinc-400">Complete</div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-xs text-zinc-500">
                <span>Started</span>
                <span>
                  {completedCount}/{totalTasks} Tasks
                </span>
                <span>Complete</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Task Spotlight */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Current Focus</h2>
                  <p className="text-zinc-400 text-sm">Your active task spotlight</p>
                </div>
              </div>

              {currentTask ? (
                <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                      <div className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                        <span className="text-sm font-medium text-purple-300">Step {currentTask.step}</span>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        currentTask.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {currentTask.status === "completed" ? "✓ Completed" : "⚡ In Progress"}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{currentTask.task_text}</h3>
                  <p className="text-zinc-300 text-lg mb-6">{currentTask.description}</p>

                  {currentTask.reason && (
                    <div className="bg-zinc-800 rounded-lg p-6 mb-6 border border-zinc-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Flag className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-sm font-semibold text-blue-300">Why This Matters</span>
                      </div>
                      <p className="text-zinc-400">{currentTask.reason}</p>
                    </div>
                  )}

                  {currentTask.deadline && (
                    <div className="flex items-center gap-3 text-zinc-400">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <div className="text-sm text-zinc-500">Due Date</div>
                        <div className="font-medium text-white">
                          {new Date(currentTask.deadline).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-zinc-900 rounded-xl p-12 border border-emerald-500/30 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Award className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Mission Accomplished! 🎉</h3>
                  <p className="text-zinc-400 text-lg">You've successfully completed all tasks for this goal.</p>
                </div>
              )}
            </div>

            {/* Goal Details Sidebar */}
            <div className="space-y-6">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Goal Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-medium text-purple-400 mb-2">Target Outcome</div>
                    <p className="text-zinc-300">{goal.target_outcome}</p>
                  </div>

                  {goal.existing_capabilities && (
                    <div>
                      <div className="text-sm font-medium text-blue-400 mb-2">Existing Capabilities</div>
                      <p className="text-zinc-300">{goal.existing_capabilities}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-emerald-400 mb-2">Start Date</div>
                      <div className="text-zinc-300 font-medium">
                        {new Date(goal.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-orange-400 mb-2">Target Date</div>
                      <div className="text-zinc-300 font-medium">
                        {targetDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Total Tasks</span>
                    <span className="text-white font-bold">{totalTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Completion Rate</span>
                    <span className="text-emerald-400 font-bold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Days Active</span>
                    <span className="text-blue-400 font-bold">
                      {Math.ceil((today - createdDate) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task History */}
          {(completedTasks.length > 0 || tasks.length > 1) && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Task History</h2>
                  <p className="text-zinc-400 text-sm">Your completed milestones</p>
                </div>
              </div>

              <div className="grid gap-4">
                {(completedTasks.length > 0 ? completedTasks : tasks.slice(1)).map((task) => (
                  <div
                    key={task._id}
                    className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          task.status === "completed"
                            ? "bg-emerald-500/20 border border-emerald-500/30"
                            : "bg-zinc-800 border border-zinc-700"
                        }`}
                      >
                        {task.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-purple-300">Step {task.step}</span>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {task.status === "completed" ? "Completed" : "Pending"}
                          </div>
                        </div>

                        <h4 className="text-lg font-semibold text-white mb-2">{task.task_text}</h4>
                        <p className="text-zinc-400 text-sm">{task.description}</p>

                        {task.deadline && (
                          <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setDeleting(false)
              setDeleteInput("")
              setDeleteError("")
            }}
          />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-8 w-full max-w-md mx-4 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
              onClick={() => {
                setDeleting(false)
                setDeleteInput("")
                setDeleteError("")
              }}
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Goal</h2>
              <p className="text-zinc-400 text-sm">
                This action <span className="text-red-400 font-semibold">cannot be undone</span>.
                <br />
                All tasks will also be deleted.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Type <span className="text-red-400 font-mono">{goal.title}</span> to confirm:
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:border-red-500 focus:outline-none"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="Type goal name..."
                disabled={loading}
                autoFocus
              />
              {deleteError && <div className="text-red-400 text-sm mt-2">{deleteError}</div>}
            </div>

            <div className="flex gap-3">
              <button
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  deleteInput.trim() === goal.title && !loading
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-900 text-red-400 cursor-not-allowed"
                }`}
                disabled={deleteInput.trim() !== goal.title || loading}
                onClick={handleDeleteGoal}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : "Delete Goal"}
              </button>
              <button
                className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition-colors"
                onClick={() => {
                  setDeleting(false)
                  setDeleteInput("")
                  setDeleteError("")
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
