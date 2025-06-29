// components/GoalModal.jsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

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

export default function GoalModal() {
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
	const router = useRouter()
	const dialogRef = useRef(null)

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
		setErrors({ ...errors, [e.target.name]: undefined })
	}

	const validateStep = () => {
		const currentFields = steps[step].fields
		const newErrors = {}
		currentFields.forEach((f) => {
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

	const handleOpen = () => {
		setStep(0)
		setForm({
			title: '',
			description: '',
			icon: '',
			duration: 10,
			target_outcome: '',
			existing_capabilities: '',
		})
		setErrors({})
		dialogRef.current.showModal()
	}

	const handleClose = () => {
		dialogRef.current.close()
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!validateStep()) return
		setLoading(true)
		const res = await fetch('/api/create-goal', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		})
		setLoading(false)
		if (res.ok) {
			handleClose()
			router.refresh()
		} else {
			alert('Failed to create goal')
		}
	}

	// Expose open method globally for button
	if (typeof window !== 'undefined') {
		window.openGoalModal = handleOpen
	}

	return (
		<dialog id="goalModal" ref={dialogRef} className="modal">
			<div className="modal-box bg-zinc-900 text-white max-w-lg w-full relative">
				<button
					className="absolute right-4 top-4 text-gray-400 hover:text-white text-xl"
					onClick={handleClose}
					type="button"
					aria-label="Close"
				>
					&times;
				</button>
				<div className="mb-4">
					<div className="flex items-center gap-2 mb-2">
						{steps.map((s, i) => (
							<div
								key={s.label}
								className={`w-6 h-2 rounded transition-all duration-200 ${
									i <= step ? 'bg-purple-600' : 'bg-zinc-700'
								}`}
							/>
						))}
					</div>
					<h3 className="font-bold text-xl">{steps[step].label}</h3>
				</div>
				<form onSubmit={step === steps.length - 1 ? handleSubmit : handleNext} className="space-y-4">
					{steps[step].fields.map((f) => (
						<div key={f.name}>
							{f.type === 'textarea' ? (
								<textarea
									name={f.name}
									value={form[f.name]}
									onChange={handleChange}
									placeholder={f.placeholder}
									className={`w-full bg-zinc-800 p-2 rounded resize-none ${
										errors[f.name] ? 'border border-red-500' : ''
									}`}
									rows={3}
									required={f.required}
								/>
							) : (
								<input
									name={f.name}
									type={f.type}
									value={form[f.name]}
									onChange={handleChange}
									placeholder={f.placeholder}
									className={`w-full bg-zinc-800 p-2 rounded ${
										errors[f.name] ? 'border border-red-500' : ''
									}`}
									required={f.required}
									min={f.type === 'number' ? 1 : undefined}
								/>
							)}
							{errors[f.name] && <span className="text-xs text-red-400">{errors[f.name]}</span>}
						</div>
					))}
					<div className="flex justify-between items-center mt-6">
						{step > 0 && (
							<button
								type="button"
								onClick={handleBack}
								className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600"
							>
								Back
							</button>
						)}
						<div className="flex-1" />
						{step < steps.length - 1 ? (
							<button
								type="submit"
								className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
							>
								Next
							</button>
						) : (
							<button
								type="submit"
								disabled={loading}
								className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
							>
								{loading ? 'Creating...' : 'Create Goal'}
							</button>
						)}
					</div>
				</form>
			</div>
			<div className="modal-backdrop bg-black/60" onClick={handleClose}></div>
		</dialog>
	)
}
