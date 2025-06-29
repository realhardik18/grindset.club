'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Sidenav from '../components/Sidenav'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
      } else {
        window.location.href = '/auth'
      }
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        {/* Skeleton Sidenav */}
        <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-purple-500/30">
          {/* Header skeleton */}
          <div className="flex items-center justify-between p-4 border-b border-purple-500/30 h-16">
            <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-32"></div>
            <div className="w-9 h-9 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Nav items skeleton */}
          <div className="p-4 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center px-3 py-3 rounded-xl">
                <div className="w-6 h-6 bg-gray-800 rounded animate-pulse"></div>
                <div className="ml-3 h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-20"></div>
              </div>
            ))}
          </div>
          
          {/* Bottom section skeleton */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 space-x-3">
              <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-800 rounded animate-pulse w-16"></div>
                <div className="h-2 bg-gray-800 rounded animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content skeleton */}
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Title skeleton */}
              <div className="mb-6">
                <div className="h-10 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-96 mb-2"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
              
              {/* Additional skeleton cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
                    <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded animate-pulse w-24 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="fixed top-4 right-4 flex items-center space-x-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-purple-400 text-sm">Loading...</span>
        </div>
      </div>
    )
  }    
    return(
        <div className="min-h-screen bg-black text-white flex">
            <Sidenav />
            <div className="flex-1 transition-all duration-300 ease-in-out" style={{ marginLeft: '16rem' }}>
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                            Welcome to the Dashboard
                        </h1>
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                            <p className="text-gray-300 text-lg">
                                Your command center for peak performance. Use the sidebar to navigate between different sections.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}