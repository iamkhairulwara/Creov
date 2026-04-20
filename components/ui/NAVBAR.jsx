'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link href="/" className="text-xl font-bold text-black">
          Creov
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/templates" className="text-sm text-gray-600 hover:text-black">
            Templates
          </Link>
          <Link href="/generate" className="text-sm text-gray-600 hover:text-black">
            Generate
          </Link>
          <Link href="/editor" className="text-sm text-gray-600 hover:text-black">
            Editor
           </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-black">
            Login
          </Link>
          <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
            Sign Up
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 px-6 pb-4">
          <Link href="/templates">Templates</Link>
          <Link href="/generate">Generate</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  )
}