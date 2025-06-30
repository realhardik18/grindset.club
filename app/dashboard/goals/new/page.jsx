'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, RedirectToSignIn } from "@clerk/nextjs"
import Sidenav from '@/app/components/Sidenav'

// Predefined emoji options
const emojiOptions = [
  "💪", "🧠", "📚", "🏃‍♂️", "🏋️‍♀️", "🎯", "🚀", "🌱", "💡", "📝", "🎨", "🛠️", "🧘‍♂️", "🏆", "💼", "🕒", "🍎", "⚡", "🌟", "🎵", "🧩", "🧑‍💻", "📈", "🗣️", "🧹", "🛌", "🥇", "🧑‍🎓", "🧑‍🏫", "🧑‍🍳", "🧑‍🔬"
]

const steps = [
  {
    label: 'Goal Basics',
    fields: [
      { name: 'title', type: 'text', placeholder: 'Title', required: true },
      { name: 'icon', type: 'text', placeholder: 'Icon (e.g. 🧠)', required: false },
    ],
  },
  {
    label: 'Description',
    fields: [
      { name: 'description', type: 'textarea', placeholder: 'Why this goal?', required: true },
      { name: 'existing_capabilities', type: 'textarea', placeholder: 'What can you already do?', required: false },
    ],
  },
  {
    label: 'Target & Duration',
    fields: [
      { name: 'target_outcome', type: 'textarea', placeholder: 'Target Outcome', required: true },
      { name: 'duration', type: 'number', placeholder: 'Duration (days)', required: true },
    ],
  },
]

export default function NewGoalPage() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) return <RedirectToSignIn />;
  const userEmail = user?.emailAddresses?.[0]?.emailAddress

  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '',
    duration: 10,
    target_outcome: '',
    existing_capabilities: '',
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [showEmojiSheet, setShowEmojiSheet] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
  }

  const validateStep = () => {
    const currentFields = steps[step].fields
    const newErrors = {}
    currentFields.forEach(f => {
      if (f.required && !form[f.name]) {
        newErrors[f.name] = 'Required'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (validateStep()) setStep(step + 1)
  }

  const handleBack = (e) => {
    e.preventDefault()
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep() || !userEmail) return
    setLoading(true)
    const res = await fetch('/api/create-goal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user: userEmail }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/dashboard/goals')
      router.refresh()
    } else {
      alert('Failed to create goal')
    }
  }

  const handleEmojiSelect = (emoji) => {
    setForm({ ...form, icon: emoji })
    setShowEmojiSheet(false)
    setErrors({ ...errors, icon: undefined })
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidenav />
      <div className="flex-1 ml-64 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-10 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold mb-1 text-white">Create a New Goal</h1>
              <h2 className="text-lg text-gray-400">{steps[step].label}</h2>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div
                  key={s.label}
                  className={`h-2 rounded-full transition-all duration-200 ${i === step ? 'w-8 bg-purple-500' : 'w-4 bg-zinc-700'} ${i < step ? 'bg-purple-700' : ''}`}
                />
              ))}
            </div>
          </div>
          <form
            onSubmit={step === steps.length - 1 ? handleSubmit : handleNext}
            className="space-y-6"
          >
            {steps[step].fields.map(f => (
              <div key={f.name} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300 mb-1 capitalize" htmlFor={f.name}>
                  {f.placeholder}
                  {f.required && <span className="text-purple-400 ml-1">*</span>}
                </label>
                {/* Custom emoji picker for icon field */}
                {f.name === 'icon' ? (
                  <div>
                    <div className="flex gap-2 items-center">
                      <input
                        id={f.name}
                        name={f.name}
                        type="text"
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className={`w-32 bg-zinc-800 p-3 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-600 ${errors[f.name] ? 'border-red-500' : 'border-zinc-700'}`}
                        maxLength={2}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-2 rounded-lg font-semibold transition text-sm"
                        onClick={() => setShowEmojiSheet((v) => !v)}
                        tabIndex={-1}
                      >
                        {form.icon ? "Change Emoji" : "Pick Emoji"}
                      </button>
                      {form.icon && (
                        <span className="text-2xl ml-2">{form.icon}</span>
                      )}
                    </div>
                    {showEmojiSheet && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full shadow-2xl relative">
                          <button
                            type="button"
                            className="absolute top-2 right-3 text-zinc-400 hover:text-white text-xl"
                            onClick={() => setShowEmojiSheet(false)}
                            aria-label="Close emoji picker"
                          >
                            ×
                          </button>
                          <div className="mb-4 text-lg font-semibold text-white">Pick an Emoji</div>
                          <div className="grid grid-cols-8 gap-2">
                            {emojiOptions.map((emoji) => (
                              <button
                                type="button"
                                key={emoji}
                                className="text-2xl hover:scale-125 transition-transform"
                                onClick={() => handleEmojiSelect(emoji)}
                                aria-label={`Select ${emoji}`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : f.type === 'textarea' ? (
                  <textarea
                    id={f.name}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className={`w-full bg-zinc-800 p-3 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-600 ${errors[f.name] ? 'border-red-500' : 'border-zinc-700'}`}
                    rows={4}
                    required={f.required}
                  />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className={`w-full bg-zinc-800 p-3 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-600 ${errors[f.name] ? 'border-red-500' : 'border-zinc-700'}`}
                    required={f.required}
                    min={f.type === 'number' ? 1 : undefined}
                  />
                )}
                {errors[f.name] && (
                  <span className="text-xs text-red-400">{errors[f.name]}</span>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Back
                </button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-semibold transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-semibold transition disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create Goal'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}