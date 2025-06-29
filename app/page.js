'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 sm:px-8">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent leading-tight">
            Elevate Your
            <br />
            <span className="text-purple-400">Grind</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered productivity for high-performers. Track goals, build memory, and plan your path to greatness.
          </p>
          <Link href={'/dashboard/goals'}>
            <button className="group relative px-8 py-4 bg-purple-600 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              Built for Excellence
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Three core pillars designed to transform how high-performers achieve their goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Goal Tracking Card */}
            <div className={`group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 hover:bg-gray-900/80 hover:border-purple-500/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                AI Goal Tracking
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Intelligent goal decomposition and progress tracking that adapts to your workflow and provides actionable insights.
              </p>
            </div>

            {/* Memory Enhancement Card */}
            <div className={`group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 hover:bg-gray-900/80 hover:border-purple-500/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '600ms' }}>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                Enhanced Memory
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Build a second brain that captures insights, connections, and knowledge to accelerate your decision-making.
              </p>
            </div>

            {/* Daily Planning Card */}
            <div className={`group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 hover:bg-gray-900/80 hover:border-purple-500/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`} style={{ transitionDelay: '800ms' }}>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                Strategic Planning
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                Daily planning that aligns with your long-term vision, optimized for peak performance and sustainable growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Ready to Join the Elite?
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Transform your potential into performance. Start building your legacy today.
          </p>
          <button className="group relative px-10 py-5 bg-purple-600 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
            <span className="relative z-10">Get Early Access</span>
            <div className="absolute inset-0 bg-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>
      </section>
    </div>
  )
}
