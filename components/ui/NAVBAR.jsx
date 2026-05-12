'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: 'rgba(6, 10, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(34, 211, 238, 0.08)'
      }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Creov</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Templates', 'Generate', 'Editor'].map(item => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm transition-colors"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => e.target.style.color = '#22d3ee'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}>
              {item}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm px-4 py-2 rounded-lg transition-all"
            style={{ color: '#94a3b8' }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}>
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
            }}>
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`block w-5 h-0.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: '#94a3b8' }} />
          <span className={`block w-5 h-0.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#94a3b8' }} />
          <span className={`block w-5 h-0.5 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: '#94a3b8' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
          style={{ background: 'rgba(6, 10, 26, 0.97)', borderColor: 'rgba(34,211,238,0.08)' }}>
          {['Templates', 'Generate', 'Editor'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm py-1" style={{ color: '#94a3b8' }}>
              {item}
            </Link>
          ))}
          <div className="border-t pt-4 flex flex-col gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <Link href="/auth/login" className="text-sm py-1" style={{ color: '#94a3b8' }}>Login</Link>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold text-white text-center px-4 py-2.5 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}