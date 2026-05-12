'use client'
import { useState } from 'react'
import Link from 'next/link'

const CYAN = '#06b6d4'
const TEXT_MUTED = '#64748b'
const TEXT_SECONDARY = '#94a3b8'
const CARD_BORDER = 'rgba(255,255,255,0.06)'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    console.log('Login:', { email, password })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07), transparent 70%)' }}
        />
      </div>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Creov</span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: CARD_BORDER }}>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              Login to your Creov account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="text-sm rounded-xl p-3 mb-6 border"
              style={{
                background: 'rgba(239,68,68,0.08)',
                borderColor: 'rgba(239,68,68,0.2)',
                color: '#f87171'
              }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: TEXT_SECONDARY }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-slate-600"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  caretColor: CYAN
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium" style={{ color: TEXT_SECONDARY }}>
                  Password
                </label>
                <a href="#" className="text-xs transition-colors" style={{ color: TEXT_MUTED }}
                  onMouseEnter={e => e.target.style.color = CYAN}
                  onMouseLeave={e => e.target.style.color = TEXT_MUTED}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all placeholder-slate-600"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  caretColor: CYAN
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                boxShadow: '0 0 25px rgba(6,182,212,0.25)'
              }}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-xs" style={{ color: TEXT_MUTED }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Signup link */}
          <p className="text-center text-sm" style={{ color: TEXT_MUTED }}>
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-semibold transition-colors"
              style={{ color: CYAN }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = CYAN}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}