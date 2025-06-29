'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidenav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.style.setProperty('--sidenav-width', isCollapsed ? '4rem' : '16rem')
  }, [isCollapsed])

  const navItems = [
    {
      name: 'Goals',
      href: '/dashboard/goals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Chat',
      href: '/dashboard/chat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      name: 'Daily To Do',
      href: '/dashboard/tasks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      name: 'Progress',
      href: '/dashboard/progress',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      name: 'Memory',
      href: '/dashboard/memory',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ]

  return (
    <div className={`fixed left-0 top-0 h-full bg-black border-r border-purple-500/30 transition-all duration-300 ease-in-out z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30 h-16">
        <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 scale-95 w-0 overflow-hidden' : 'opacity-100 scale-100 w-auto'}`}>
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            Grindset.club
          </h2>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-purple-600/20 transition-all duration-200 text-purple-400 hover:text-purple-300 flex-shrink-0 hover:scale-110 ${
            isCollapsed ? 'ml-0' : 'ml-2'
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2 overflow-visible">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center px-3 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                isActive 
                  ? 'text-white bg-purple-600/40 border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-purple-600/30 hover:border-purple-500 border-transparent'
              }`}
              style={{
                transitionDelay: isCollapsed ? `${index * 50}ms` : '0ms'
              }}
            >
              <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-200 ${
                isActive ? 'text-purple-300' : 'text-purple-500 group-hover:text-purple-400'
              }`}>
                {item.icon}
              </div>
              <span className={`ml-3 font-medium transition-all duration-300 ease-in-out whitespace-nowrap ${
                isCollapsed ? 'opacity-0 scale-95 w-0 overflow-hidden translate-x-2' : 'opacity-100 scale-100 w-auto translate-x-0'
              }`}>
                {item.name}
              </span>
              
              {/* Enhanced Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-purple-500/30 shadow-lg shadow-purple-500/10 transform scale-95 group-hover:scale-100">
                  {item.name}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-purple-500/30 rotate-45"></div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className={`flex items-center p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 transition-all duration-300 hover:bg-purple-600/30 ${
          isCollapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-purple-500">
            <span className="text-white text-sm font-semibold">U</span>
          </div>
          <div className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'opacity-0 scale-95 w-0 overflow-hidden translate-x-2' : 'opacity-100 scale-100 w-auto translate-x-0'
          }`}>
            <p className="text-sm font-medium text-white truncate">User</p>
            <p className="text-xs text-purple-400 truncate">Elite Member</p>
          </div>
        </div>
      </div>
    </div>
  )
}
