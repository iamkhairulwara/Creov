'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { motion, AnimatePresence } from 'framer-motion'

const AlertTriangleIcon = () => <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>

const suggestions = [
  "A dark portfolio website for a visual artist with high-contrast cards",
  "A restaurant website featuring menu sections and table bookings",
  "A tech agency landing page with floating cards and cyber theme",
  "A minimalist creative agency hub with high-end glassmorphic borders",
  "A luxurious hotel booking site with gold accents and serif typography",
  "An energetic fitness center page with bold typography and neon greens",
  "A sleek e-commerce storefront for minimalist watches",
  "A modern medical clinic with trustworthy blues and clean whitespace",
  "A vibrant event landing page with countdown timers and 3D shapes",
  "A professional law firm website with classic styling and deep navies",
  "An educational platform dashboard with colorful progress indicators",
  "A real estate listing page with large imagery and clean layout"
]

const pipelineSteps = [
  { id: 1, text: "Analyzing prompt intent & style guides..." },
  { id: 2, text: "Architecting responsive single-page hierarchy..." },
  { id: 3, text: "Writing semantic, structure-rich HTML5 elements..." },
  { id: 4, text: "Injecting custom high-fidelity responsive CSS..." },
  { id: 5, text: "Polishing interactive micro-scripts & animations..." }
]

export default function Generate() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authToast, setAuthToast] = useState(false)
  const [suggestionIndex, setSuggestionIndex] = useState(0)

  // Rotate suggestions every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIndex(prev => (prev + 4) % suggestions.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const currentSuggestions = Array.from({ length: 4 }).map((_, i) => suggestions[(suggestionIndex + i) % suggestions.length])

  // Auth checks
  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) console.error('Session error:', sessionError)

      let user = session?.user

      if (!user) {
        try {
          const cached = localStorage.getItem('creov_cached_user')
          if (cached) user = JSON.parse(cached)
        } catch (e) { }
      }

      if (!user) {
        setAuthToast(true)
        setTimeout(() => {
          router.replace('/auth/login')
        }, 1500)
        return
      }
      setUser(user)
      setCheckingAuth(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user)
        setCheckingAuth(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Pipeline simulation timer
  useEffect(() => {
    let interval
    if (loading) {
      setActiveStep(1)
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev < 5) return prev + 1
          return prev
        })
      }, 6000) // Change step every 6s to span ~30s generation time
    } else {
      setActiveStep(0)
    }
    return () => clearInterval(interval)
  }, [loading])

  async function handleGenerate() {
    if (!prompt.trim()) return
    if (!user) {
      router.push('/auth/login')
      return
    }

    setLoading(true)
    setError(null)
    setActiveStep(1)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          userId: user.id
        })
      })

      const data = await res.json()

      if (data.html && data.html.length > 100) {
        // Complete the pipeline visuals instantly
        setActiveStep(5)

        sessionStorage.setItem('generatedHTML', data.html)
        sessionStorage.setItem('generatedPrompt', prompt)
        sessionStorage.setItem('websiteId', data.websiteId || '')

        const verify = sessionStorage.getItem('generatedHTML')
        if (verify && verify.length > 0) {
          window.location.href = `/editor/${data.websiteId}`
        } else {
          throw new Error("Failed to cache generated design local context")
        }
      } else {
        setError(data.error || 'Generation failed. No layout was successfully compiled.')
        setLoading(false)
      }

    } catch (err) {
      console.error("Generation error:", err)
      setError(err.message || 'AI processing encountered an unexpected event.')
      setLoading(false)
    }
  }

  if (checkingAuth && !authToast) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm text-slate-500 font-mono">Securing gateway handshake...</p>
        </div>
      </div>
    )
  }

  if (authToast) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center gap-6 z-10 animate-in fade-in zoom-in duration-500 ease-out">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-white tracking-tight">Sign In Required</h2>
            <p className="text-slate-400 font-light text-sm max-w-[250px] mx-auto">You need an account to generate AI websites. Redirecting...</p>
          </div>
          
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-2 relative">
             <div className="absolute inset-y-0 left-0 bg-cyan-400 rounded-full w-full animate-[progress_1.5s_ease-in-out]" />
             <style jsx>{`
               @keyframes progress {
                 0% { transform: translateX(-100%); }
                 100% { transform: translateX(0); }
               }
             `}</style>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white">
      <Navbar />

      {/* Cyber Mesh Glow Removed */}

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-24 grid grid-cols-12 gap-8">

        {/* Left Side: Prompt Tips & Quick Suggestions (Bento layout sidebar) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

          {/* User Status Profile widget */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl rounded-full pointer-events-none" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Workspace Portal</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-[#030712] font-mono uppercase">
                {user.email?.slice(0, 2)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-slate-500">Authenticated Account</span>
                <span className="text-sm font-semibold text-white truncate">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Suggestions container */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Try Prompt Examples
            </h2>
            <div className="flex flex-col gap-3 h-[380px] overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                {currentSuggestions.map((s, i) => (
                  <motion.button
                    key={`${suggestionIndex}-${i}`}
                    initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    onClick={() => setPrompt(s)}
                    disabled={loading}
                    className="w-full text-left p-4 rounded-xl border border-white/5 bg-transparent text-xs text-slate-400 leading-relaxed font-light hover:border-cyan-500/30 hover:bg-white/[0.02] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    {s}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Side: Terminals & Generation Pipeline */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

          {/* Main Prompt Command Terminal */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full pointer-events-none" />

            <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500/20" />
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">Creov Prompt Terminal v2.0</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">STATUS: ONLINE</span>
            </div>

            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your design in detail, e.g. A gorgeous modern portfolio website for a visual photographer..."
                rows={8}
                disabled={loading}
                className="w-full text-sm resize-none focus:outline-none bg-transparent placeholder-slate-600 text-white caret-cyan-400 font-light leading-relaxed disabled:opacity-50 relative z-10"
              />
              <div className="absolute inset-0 border border-cyan-500/0 group-focus-within:border-cyan-500/20 rounded-xl transition-all duration-500 pointer-events-none -m-4 p-4 shadow-[inset_0_0_20px_rgba(34,211,238,0)] group-focus-within:shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]" />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-6 pt-4 border-t border-white/5">
              <span className="text-xs text-slate-500 font-mono flex items-center">
                &gt; {prompt.length} CHARS PREPARED
              </span>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="group relative inline-flex items-center justify-center gap-2 text-[#030712] bg-cyan-500 hover:bg-cyan-400 font-bold px-8 py-3.5 rounded-xl text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)]"
              >
                <span className="flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <span>Synthesize Website</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Generative Error Banner */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-5 text-sm text-red-400 flex items-start gap-3 shadow-lg">
              <AlertTriangleIcon />
              <div className="flex flex-col gap-1">
                <span className="font-bold">Synthesis Blocked</span>
                <span className="font-light">{error}</span>
              </div>
            </div>
          )}

          {/* Fully Interactive Animated Generation Pipeline */}
          {loading && (
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-xl transition-all duration-500 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
                  Synthesizer Neural Pipeline
                </h3>
              </div>

              <div className="space-y-4">
                {pipelineSteps.map((step) => {
                  const isFinished = activeStep > step.id
                  const isActive = activeStep === step.id
                  const isPending = activeStep < step.id

                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-4 transition-all duration-500 ${isFinished ? "opacity-100" : isActive ? "opacity-100" : "opacity-30"
                        }`}
                    >
                      {/* Visual Indicator Indicator */}
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold">
                        {isFinished ? (
                          <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
                            ✓
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center animate-pulse shadow-[0_0_10px_#06b6d4]">
                            ★
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/5 text-slate-600 flex items-center justify-center border border-white/5">
                            {step.id}
                          </div>
                        )}
                      </div>

                      {/* Step Text */}
                      <div className="flex-1 flex flex-col">
                        <span
                          className={`text-xs font-mono font-medium transition-colors ${isFinished ? "text-slate-400 font-light" : isActive ? "text-cyan-300 font-bold" : "text-slate-600 font-light"
                            }`}
                        >
                          {step.text}
                        </span>

                        {/* Progress Bar inside active step */}
                        {isActive && (
                          <div className="h-[2px] bg-cyan-950 rounded-full w-full mt-2 overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full animate-[grid-flow_2s_linear_infinite]" style={{ width: '100%' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}