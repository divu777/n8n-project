'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
    const router = useRouter()
  return (
    <div className="h-screen w-1/5 bg-gray-100 border-r border-gray-200 flex flex-col justify-between p-8">
      
      {/* Top Section */}
      <div className="flex flex-col items-start gap-8">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight text-red-500">
          N9N
        </h1>

        {/* Menu */}
        <nav className="flex flex-col gap-3 w-full text-gray-700">
          <button className="text-left px-2 py-1 rounded-md hover:bg-white hover:text-red-500 transition-colors" onClick={()=>router.push("/home")}>
            Overview
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-medium text-white">
          D
        </div>
        <span className="text-sm font-medium text-gray-800">Divakar Jaiswal</span>
      </div>
    </div>
  )
}

export default Sidebar
