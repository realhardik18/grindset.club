"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Interactive Background */}
      <div className="fixed inset-0 z-0">
        {/* Main blob that follows mouse */}
        <div
          className="absolute w-96 h-96 bg-purple-600/10 rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Secondary blob with delayed movement */}
        <div
          className="absolute w-80 h-80 bg-violet-600/8 rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            left: `${mousePosition.x * 0.7}px`,
            top: `${mousePosition.y * 0.7}px`,
            transform: "translate(-30%, -30%)",
          }}
        />

        {/* Third blob with even more delay */}
        <div
          className="absolute w-64 h-64 bg-purple-400/6 rounded-full blur-3xl transition-all duration-1200 ease-out"
          style={{
            left: `${mousePosition.x * 0.4}px`,
            top: `${mousePosition.y * 0.4}px`,
            transform: "translate(-70%, -70%)",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Elevate Your</span>
            <br />
            <span className="text-purple-400">Grind</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered productivity for high-performers. Track goals, build memory, and plan your path to greatness.
          </p>

          <Link href={"/dashboard/goals"}>
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-lg transition-colors duration-200">
              Start Now
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Built for Excellence</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Three core pillars designed to transform how you achieve your goals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Goal Tracking",
                description: "Intelligent goal decomposition and progress tracking that adapts to your workflow.",
              },
              {
                title: "Enhanced Memory",
                description: "Build a second brain that captures insights and knowledge to accelerate decisions.",
              },
              {
                title: "Strategic Planning",
                description: "Daily planning aligned with your long-term vision for peak performance.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors duration-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center transition-all duration-1000 delay-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {[
              { number: "10x", label: "Productivity" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "AI Support" },
              { number: "∞", label: "Potential" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-purple-400 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 delay-900 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Ready to Transform Your Productivity?</h3>

          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Join thousands of high-performers who&apos;ve already elevated their game.
          </p>

          <Link href="/dashboard/goals">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-lg transition-colors duration-200">
              Get Started
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
