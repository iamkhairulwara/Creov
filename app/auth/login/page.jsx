'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CreovLogo from '@/components/ui/CREOVLOGO'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) router.replace('/')
    }
    checkSession()
  }, [router])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.replace('/')
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white overflow-hidden relative">
      
      {/* Left Side: Gorgeous SVG Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-end bg-[#050914] overflow-hidden border-r border-white/5">
        
        {/* Logo at Top Left */}
        <div className="absolute top-8 left-10 z-30">
          <Link href="/">
            <CreovLogo className="w-10 h-10" />
          </Link>
        </div>

        {/* Improved Embedded Abstract SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#0a192f" />
            </linearGradient>
            <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purple-glow" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="url(#bg-grad)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Glowing Orbs */}
          <circle cx="300" cy="300" r="300" fill="url(#cyan-glow)" style={{ filter: 'blur(100px)' }} />
          <circle cx="800" cy="800" r="400" fill="url(#purple-glow)" style={{ filter: 'blur(120px)' }} />
          
          {/* Bold Abstract Geometry */}
          <g transform="translate(500, 450)">
            {/* Outer rings */}
            <circle cx="0" cy="0" r="320" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1" strokeDasharray="10 20" />
            <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="2" />
            
            {/* Hexagon mesh */}
            <path d="M 0 -200 L 173 -100 L 173 100 L 0 200 L -173 100 L -173 -100 Z" fill="none" stroke="#22d3ee" strokeWidth="2" filter="url(#glow)" opacity="0.9"/>
            <path d="M 0 -150 L 130 -75 L 130 75 L 0 150 L -130 75 L -130 -75 Z" fill="rgba(34,211,238,0.1)" stroke="#3b82f6" strokeWidth="1" opacity="0.8"/>
            
            {/* Central core */}
            <circle cx="0" cy="0" r="70" fill="url(#cyan-glow)" filter="url(#glow)" opacity="0.6"/>
            <circle cx="0" cy="0" r="45" fill="#22d3ee" filter="url(#glow)"/>
            
            {/* Floating nodes */}
            <g opacity="1">
              <circle cx="-150" cy="-250" r="8" fill="#8b5cf6" filter="url(#glow)"/>
              <line x1="-150" y1="-250" x2="0" y2="0" stroke="rgba(139,92,246,0.6)" strokeWidth="2" />
              
              <circle cx="250" cy="-100" r="10" fill="#22d3ee" filter="url(#glow)"/>
              <line x1="250" y1="-100" x2="173" y2="-100" stroke="rgba(34,211,238,0.6)" strokeWidth="2" />
              
              <circle cx="-200" cy="150" r="7" fill="#3b82f6" filter="url(#glow)"/>
              <line x1="-200" y1="150" x2="-130" y2="75" stroke="rgba(59,130,246,0.6)" strokeWidth="2" />
              
              <circle cx="100" cy="250" r="9" fill="#22d3ee" filter="url(#glow)"/>
              <line x1="100" y1="250" x2="0" y2="200" stroke="rgba(34,211,238,0.5)" strokeWidth="2" />
            </g>
          </g>
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10 pointer-events-none" />
        
        <div className="relative z-20 w-full p-16 max-w-2xl mt-auto">
          <h2 className="text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space-grotesk)] leading-[1.1] mb-6 text-white drop-shadow-2xl tracking-tight">
            Design at the speed of thought.
          </h2>
          <p className="text-lg text-slate-300 font-light drop-shadow-md max-w-md leading-relaxed">
            Join the next generation of creators building stunning web experiences without limits.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 h-screen overflow-y-auto">
        <div className="bg-white/[0.02] p-8 lg:p-10 rounded-3xl border border-white/5 w-full max-w-md shadow-2xl transition-all duration-300 relative z-30">
        
        <div className="flex flex-col items-center lg:items-start mb-8 text-center lg:text-left">
          <Link href="/" className="lg:hidden">
            <CreovLogo className="w-12 h-12 mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight text-center font-[family-name:var(--font-space-grotesk)]">Welcome Back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your Creov account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <span>❌</span> {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5 mb-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <Link href="/auth/forgot-password" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition duration-300">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center text-[#030712] bg-cyan-500 hover:bg-cyan-400 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)]"
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-3 px-4 rounded-xl hover:bg-gray-100 transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-cyan-400 font-semibold hover:text-cyan-300 transition duration-300">
            Sign up
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}