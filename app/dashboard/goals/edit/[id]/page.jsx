"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Sidenav from "@/app/components/Sidenav"

export default function EditGoalPage() {
  const { id } = useParams()
  const router = useRouter()
  const [goal, setGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    duration: "",
    target_outcome: "",
    existing_capabilities: "",
  })

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/get-goals?id=${id}`)
        if (res.ok) {
          const data = await res.json()
          const goalData = Array.isArray(data) ? data[0] : data
          setGoal(goalData)
          setFormData({
            title: goalData.title || "",
            description: goalData.description || "",
            icon: goalData.icon || "",
            duration: goalData.duration || "",
            target_outcome: goalData.target_outcome || "",
            existing_capabilities: goalData.existing_capabilities || "",
          })
        }
      } catch (err) {
        setError("Failed to fetch goal details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchGoal()
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const res = await fetch("/api/update-goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, goalId: id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update goal")

      router.push(`/dashboard/goals/${id}`)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex">
        <Sidenav />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <Sidenav />
      <div className="flex-1 p-8" style={{ marginLeft: "var(--sidenav-width, 16rem)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Edit Goal</h1>
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-blue-500 focus:outline-none min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-blue-500 focus:outline-none"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Target Outcome
                </label>
                <textarea
                  value={formData.target_outcome}
                  onChange={(e) => setFormData({ ...formData, target_outcome: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Existing Capabilities
                </label>
                <textarea
                  value={formData.existing_capabilities}
                  onChange={(e) => setFormData({ ...formData, existing_capabilities: e.target.value })}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
