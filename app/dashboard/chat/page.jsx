'use client'
import { useEffect, useRef, useState } from 'react'
import Sidenav from '../../components/Sidenav'

const BOT_WELCOME = "👋 Hi! I'm your productivity assistant bot here at grindset.club. Ask me about your tasks, goals, or anything else. If you need info from the web, just ask!"

function formatDateTime(dt) {
    const date = new Date(dt)
    return date.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric'
    })
}

export default function Chat() {
    const [messages, setMessages] = useState([{ role: 'assistant', message: BOT_WELCOME, created_at: new Date().toISOString() }])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [olderChats, setOlderChats] = useState([])
    const [showOlder, setShowOlder] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        fetch('/api/chat-history')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const now = Date.now()
                    const thirtyMinAgo = now - 30 * 60 * 1000
                    const recent = data.filter(msg => new Date(msg.created_at).getTime() >= thirtyMinAgo)
                    setMessages([{ role: 'assistant', message: BOT_WELCOME, created_at: new Date().toISOString() }, ...recent])
                }
            })
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, showOlder])

    const fetchOlderChats = async () => {
        const res = await fetch('/api/chat-history')
        const data = await res.json()
        const now = Date.now()
        const thirtyMinAgo = now - 30 * 60 * 1000
        const older = data.filter(msg => new Date(msg.created_at).getTime() < thirtyMinAgo)
        setOlderChats(older)
        setShowOlder(true)
    }

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!input.trim()) return
        const userMsg = { role: 'user', message: input, created_at: new Date().toISOString() }
        setMessages(msgs => [...msgs, userMsg])
        setInput('')
        setLoading(true)
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
        })
        const data = await res.json()
        setMessages(msgs => [...msgs, { role: 'assistant', message: data.message, created_at: new Date().toISOString() }])
        setLoading(false)
    }

    const startNewSession = () => {
        setMessages([{ role: 'assistant', message: BOT_WELCOME, created_at: new Date().toISOString() }])
    }

    return (
        <div className="flex min-h-screen h-screen bg-black text-white">
            <Sidenav />
            <div
                className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
                style={{ marginLeft: 'var(--sidenav-width, 16rem)', padding: 0, minHeight: '100vh', height: '100vh' }}
            >
                <div className="flex flex-col w-full h-full">
                    <div className="flex items-center justify-between px-8 pt-8 pb-2">
                        <h2 className="text-xl font-bold text-purple-400">grindset.club Chat</h2>
                        {!showOlder && (
                            <button
                                className="text-sm text-purple-300 hover:underline"
                                onClick={fetchOlderChats}
                            >
                                Show chats older than 30 minutes
                            </button>
                        )}
                    </div>
                    {showOlder && olderChats.length > 0 && (
                        <div className="px-8 pb-2">
                            <div className="text-xs text-zinc-400 mb-2">Older chats</div>
                            <div className="space-y-2 mb-4">
                                {olderChats.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-xl px-3 py-1 max-w-[60%] text-xs
                                            ${msg.role === 'user'
                                                ? 'bg-purple-900 text-white'
                                                : 'bg-zinc-800 text-purple-200 border border-purple-900'
                                            }`}>
                                            <span className="block text-[10px] text-zinc-400 mb-1">{formatDateTime(msg.created_at)}</span>
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr className="border-zinc-800 mb-2" />
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-xl px-4 py-2 max-w-[70%] shadow
                                    ${msg.role === 'user'
                                        ? 'bg-purple-700 text-white'
                                        : 'bg-zinc-900 text-purple-200 border border-purple-900'
                                    }`}>
                                    <span className="block text-xs text-zinc-400 mb-1">{formatDateTime(msg.created_at)}</span>
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="flex border-t border-purple-900 bg-black p-6 gap-2">
                        <input
                            className="flex-1 bg-zinc-900 border border-purple-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700 text-white placeholder-purple-400"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <button
                            className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-lg font-semibold shadow disabled:opacity-50 transition"
                            disabled={loading || !input.trim()}
                        >
                            {loading ? '...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}