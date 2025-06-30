"use client"

import { useEffect, useState } from "react"
import Sidenav from "@/app/components/Sidenav"
import Link from "next/link"
import { Plus, Target, Calendar, TrendingUp, Clock, CheckCircle, Loader2, Zap } from "lucide-react"
import { useUser, RedirectToSignIn } from "@clerk/nextjs"

export default function GoalsPage() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) return <RedirectToSignIn />;
  const userEmail = user?.emailAddresses?.[0]?.emailAddress

  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userEmail) return;
    const fetchGoals = async () => {
      try {
        const res = await fetch(`/api/get-goals?user=${encodeURIComponent(userEmail)}`)
        if (res.ok) {
          const data = await res.json()
          setGoals(data)
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGoals()
  }, [userEmail])

  const calculateGoalStats = (goal) => {
    const createdDate = new Date(goal.created_at)
    const targetDate = new Date(createdDate.getTime() + goal.duration * 24 * 60 * 60 * 1000)
    const today = new Date()
    const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
    const totalDays = goal.duration
    const daysPassed = totalDays - daysLeft
    const timeProgress = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100))

    return {
      daysLeft: Math.max(0, daysLeft),
      isOverdue: daysLeft < 0,
      timeProgress,
      targetDate,
    }
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
            <p className="text-lg text-zinc-400">Loading your goals...</p>
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
              <h1 className="text-4xl font-bold text-white mb-2">Your Goals</h1>
              <p className="text-zinc-400">
                {goals.length === 0
                  ? "Start your journey by creating your first goal"
                  : `${goals.length} goal${goals.length !== 1 ? "s" : ""} in progress`}
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          {goals.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{goals.length}</div>
                    <div className="text-sm text-zinc-400">Total Goals</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {
                        goals.filter((goal) => {
                          const stats = calculateGoalStats(goal)
                          return stats.timeProgress >= 100
                        }).length
                      }
                    </div>
                    <div className="text-sm text-zinc-400">Completed</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {
                        goals.filter((goal) => {
                          const stats = calculateGoalStats(goal)
                          return stats.isOverdue
                        }).length
                      }
                    </div>
                    <div className="text-sm text-zinc-400">Overdue</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {
                        goals.filter((goal) => {
                          const stats = calculateGoalStats(goal)
                          return !stats.isOverdue && stats.timeProgress < 100
                        }).length
                      }
                    </div>
                    <div className="text-sm text-zinc-400">Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Grid */}
          {goals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Target className="w-12 h-12 text-zinc-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No goals yet</h3>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Ready to level up? Create your first goal and start your journey to success.
              </p>
              <Link
                href="/dashboard/goals/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Goal
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const stats = calculateGoalStats(goal)

                return (
                  <Link
                    key={goal._id}
                    href={`/dashboard/goals/${goal._id}`}
                    className="group block bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-xl border border-zinc-700 group-hover:border-zinc-600 transition-colors">
                          {goal.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                            {goal.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(goal.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stats.isOverdue
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : stats.timeProgress >= 100
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}
                      >
                        {stats.isOverdue ? "Overdue" : stats.timeProgress >= 100 ? "Complete" : "Active"}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{goal.description}</p>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      {/* Time Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-zinc-500">Timeline Progress</span>
                          <span className="text-zinc-400">{Math.round(stats.timeProgress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              stats.isOverdue
                                ? "bg-red-500"
                                : stats.timeProgress >= 100
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(100, stats.timeProgress)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {stats.isOverdue
                              ? `${Math.abs(stats.daysLeft)} days overdue`
                              : stats.daysLeft === 0
                                ? "Due today"
                                : `${stats.daysLeft} days left`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-500">
                          <TrendingUp className="w-3 h-3" />
                          <span>{goal.duration} day goal</span>
                        </div>
                      </div>
                    </div>

                    {/* Target Outcome Preview */}
                    {goal.target_outcome && (
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-1">Target Outcome</div>
                        <p className="text-sm text-zinc-400 line-clamp-2">{goal.target_outcome}</p>
                      </div>
                    )}
                  </Link>
                )
              })}
              
              {/* Add Goal Card */}
              <Link
                href="/dashboard/goals/new"
                className="group flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 border-dashed hover:border-blue-500 hover:bg-zinc-800/30 transition-all duration-200 min-h-[280px]"
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Plus className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 group-hover:text-blue-300 transition-colors">
                  Add a Goal
                </h3>
                <p className="text-zinc-500 text-sm text-center mt-2 max-w-[200px]">
                  Create a new goal to track your progress
                </p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
