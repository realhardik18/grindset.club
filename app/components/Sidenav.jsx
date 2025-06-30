'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from "@clerk/nextjs";

export default function Sidenav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

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
    }
  ]

  return (
    <div className={`fixed left-0 top-0 h-full bg-black border-r border-purple-500/30 transition-all duration-300 ease-in-out z-50 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b border-purple-500/30 h-16 px-0 ${isCollapsed ? 'pl-0 pr-0' : 'px-4'}`}>
        <div className={`transition-all duration-300 ease-in-out flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          {isCollapsed ? (
            // Show logo image when collapsed
            <img
              src="/logo.png"
              alt="Logo"
              className="w-8 h-8 object-contain"
            />
          ) : (
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              Grindset.club
            </h2>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-purple-600/20 transition-all duration-200 text-purple-400 hover:text-purple-300 flex-shrink-0 hover:scale-110 ${
            isCollapsed ? 'ml-0 mr-0' : 'ml-2'
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ease-in-out ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className={`space-y-1 ${isCollapsed ? 'p-2' : 'p-4'} overflow-visible`}>
        {navItems.map((item, index) => {
          const isActive = pathname === item.href
          return (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className={`flex items-center rounded-xl border transition-all duration-200 hover:scale-[1.04] ${
                  isActive 
                    ? 'text-white bg-purple-600/40 border-purple-500 shadow-lg shadow-purple-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-purple-600/30 hover:border-purple-500 border-transparent'
                } ${isCollapsed ? 'justify-center p-3' : 'px-3 py-3'}`}
                style={{
                  transitionDelay: isCollapsed ? `${index * 50}ms` : '0ms'
                }}
              >
                <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'text-purple-300' : 'text-purple-500 group-hover:text-purple-400'
                }`}>
                  {item.icon}
                </div>
                {/* Hide text when collapsed */}
                {!isCollapsed && (
                  <span className="ml-3 font-medium transition-all duration-300 ease-in-out whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                  {item.name}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-purple-500/30 rotate-45"></div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`absolute bottom-4 ${isCollapsed ? 'left-1 right-1' : 'left-4 right-4'}`}>
        <div className={`flex items-center rounded-xl bg-purple-600/20 border border-purple-500/30 transition-all duration-300 hover:bg-purple-600/30 ${
          isCollapsed ? 'justify-center p-2' : 'space-x-3 p-3'
        }`}>
          {user ? (
            <>
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full flex-shrink-0 transition-all duration-200 object-cover"
              />
              {/* Hide user info when collapsed */}
              {!isCollapsed && (
                <div className="min-w-0 flex-1 transition-all duration-300 ease-in-out">
                  <p className="text-sm font-medium text-white truncate">{user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress}</p>
                  <p className="text-xs text-purple-400 truncate">{user.emailAddresses?.[0]?.emailAddress}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-purple-500">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1 transition-all duration-300 ease-in-out">
                  <p className="text-sm font-medium text-white truncate">User</p>
                  <p className="text-xs text-purple-400 truncate">Elite Member</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
