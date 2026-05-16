'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'

const suggestions = [
  "A portfolio website for a graphic designer with dark theme",
  "A restaurant website with menu and reservation section",
  "A business landing page for a software agency",
  "A personal blog with minimal white design",
]

const CARD_BG = 'rgba(255,255,255,0.02)'
const CARD_BORDER = 'rgba(255,255,255,0.06)'
const CYAN = '#06b6d4'
const TEXT_SECONDARY = '#94a3b8'
const TEXT_MUTED = '#64748b'

export default function Generate() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)

    try {
      console.log("🚀 Sending generation request...")
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          userId: 'temp-user'
        })
      })

      const data = await res.json()
      console.log("📦 API Response:", {
        hasHtml: !!data.html,
        htmlLength: data.html?.length,
        error: data.error
      })

      if (data.html && data.html.length > 100) {
        // Store in sessionStorage (better than localStorage for this use case)
        sessionStorage.setItem('generatedHTML', data.html)
        sessionStorage.setItem('generatedPrompt', prompt)
        
        // Verify it was stored
        const verify = sessionStorage.getItem('generatedHTML')
        console.log("💾 Stored in sessionStorage? Length:", verify?.length)
        
        if (verify && verify.length > 0) {
          // Redirect to editor
          window.location.href = '/editor'
        } else {
          throw new Error("Failed to save generated website")
        }
      } else {
        setError(data.error || 'Generation failed. No HTML received')
        setLoading(false)
      }

    } catch (err) {
      console.error("❌ Generation error:", err)
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.07), transparent 70%)' }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">

        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full mb-6 border"
            style={{
              background: 'rgba(6,182,212,0.08)',
              borderColor: 'rgba(6,182,212,0.2)',
              color: CYAN
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            AI Website Generator
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Describe your website
          </h1>
          <p style={{ color: TEXT_SECONDARY }}>
            Type what you want and AI will generate a complete website for you
          </p>
        </div>

        <div
          className="rounded-2xl border p-5 mb-3 transition-all"
          style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A portfolio website for a UI/UX designer with dark theme, hero section, projects grid and contact form..."
            rows={6}
            className="w-full text-sm resize-none focus:outline-none bg-transparent placeholder-slate-600"
            style={{ color: 'white', caretColor: CYAN }}
          />

          <div
            className="flex justify-between items-center mt-4 pt-4 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="text-xs" style={{ color: TEXT_MUTED }}>
              {prompt.length} characters
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="inline-flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                boxShadow: prompt.trim() ? '0 0 20px rgba(6,182,212,0.3)' : 'none'
              }}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Generate Website
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl border px-4 py-3 mb-4 text-sm"
            style={{
              background: 'rgba(239,68,68,0.08)',
              borderColor: 'rgba(239,68,68,0.2)',
              color: '#f87171'
            }}>
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div
            className="rounded-xl border px-4 py-3 mb-4 text-sm text-center"
            style={{
              background: 'rgba(6,182,212,0.05)',
              borderColor: 'rgba(6,182,212,0.15)',
              color: CYAN
            }}>
            ✨ AI is generating your website... this takes 20-40 seconds
          </div>
        )}

        <p className="text-xs mb-10 px-1" style={{ color: TEXT_MUTED }}>
          💡 Tip: Be specific about your industry, style, and sections for better results
        </p>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: TEXT_MUTED }}>
            Try these examples
          </p>
          <div className="space-y-2.5">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setPrompt(s)}
                disabled={loading}
                className="w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: CARD_BG, borderColor: CARD_BORDER, color: TEXT_SECONDARY }}
                onMouseEnter={e => {
                  if (loading) return
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.background = 'rgba(6,182,212,0.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = CARD_BORDER
                  e.currentTarget.style.color = TEXT_SECONDARY
                  e.currentTarget.style.background = CARD_BG
                }}>
                <span className="mr-2" style={{ color: CYAN }}>→</span>
                {s}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}