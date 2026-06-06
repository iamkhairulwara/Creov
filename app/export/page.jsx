'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ExportPage() {
  const [selected, setSelected] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [websiteData, setWebsiteData] = useState(null)
  const [hasNoData, setHasNoData] = useState(false)
  const router = useRouter()

  // Verify session and load context
  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth/login')
        return
      }
      setUser(session.user)
      setCheckingAuth(false)

      const stored = localStorage.getItem('export_website')
      if (!stored) {
        setHasNoData(true)
      } else {
        setWebsiteData(JSON.parse(stored))
      }
    }
    
    checkAuthAndLoad()
  }, [router])

  async function handleExport() {
    if (!websiteData) return
    setExporting(true)

    try {
      if (selected === 'single') {
        // Export as single combined .html file
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${websiteData.title || 'My Website'}</title>
  <style>
${websiteData.css || ''}
  </style>
</head>
<body>
${websiteData.html || ''}
<script>
${websiteData.js || ''}
</script>
</body>
</html>`

        const blob = new Blob([fullHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${websiteData.title || 'my-website'}.html`
        a.click()
        URL.revokeObjectURL(url)

      } else if (selected === 'multiple') {
        // Export as ZIP with separate files
        const { exportAsZip } = await import('@/lib/utils/exportZip')
        await exportAsZip({
          html: websiteData.html,
          css: websiteData.css,
          js: websiteData.js,
          filename: websiteData.title || 'my-website'
        })
      }

      // Show success then go back
      setTimeout(() => {
        setExporting(false)
        router.back()
      }, 1000)

    } catch (err) {
      console.error('Export error:', err)
      setExporting(false)
    }
  }

  const options = [
    {
      id: 'single',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: 'Single HTML File',
      description: 'Everything combined into one .html file. CSS and JS are fully embedded. Great for instant sharing or rapid visual deployment.',
      tag: 'Simplest',
      files: ['index.html'],
    },
    {
      id: 'multiple',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
        </svg>
      ),
      title: 'Multiple Files (ZIP)',
      description: 'Clean separate files packed in an indexed ZIP. Perfect for developers looking to modify structures in local editors.',
      tag: 'Recommended',
      files: ['index.html', 'style.css', 'script.js'],
    },
  ]

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm text-slate-500 font-mono">Verifying authorization handshake...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* Futuristic Glowing Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[80px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      {/* Cyber Grid Pattern */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.05] animate-grid-flow"
        style={{
          backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px'
        }} 
      />

      <div className="max-w-4xl mx-auto px-6 pt-36 pb-24 flex-1 flex items-center justify-center w-full">
        {hasNoData ? (
          <div className="glass-card text-center p-12 rounded-3xl border border-red-500/10 max-w-lg w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">No Website Data Found</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              We couldn't detect any active design data in your local session. Please return to the editor to bundle your assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-300 flex-1 text-center"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/generate"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300 flex-1 text-center font-mono"
              >
                Synthesize Site
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-cyan-500/20 bg-cyan-950/20 text-cyan-300 animate-float">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Deploy Engine v2.0
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Export <span className="neon-text-cyan-blue">Workspace</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-light">
                Securely download standalone production-ready code packages for: <span className="font-semibold text-slate-300">{websiteData?.title || 'my-website'}</span>
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {options.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                  className={`text-left p-6 rounded-3xl border transition-all duration-500 card-3d ${
                    selected === option.id
                      ? 'bg-cyan-950/15 border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] glass-glow-cyan'
                      : 'bg-white/5 border-white/5 hover:border-cyan-500/20'
                  }`}
                >
                  {/* Icon + Tag */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                        selected === option.id
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all duration-300 ${
                        selected === option.id
                          ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
                          : 'bg-white/5 border-white/5 text-slate-500'
                      }`}
                    >
                      {option.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-black text-lg mb-2 tracking-wide transition-colors ${
                      selected === option.id ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed mb-6 text-slate-400 font-light">
                    {option.description}
                  </p>

                  {/* Files list */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {option.files.map(f => (
                      <span
                        key={f}
                        className="text-[10px] px-2.5 py-1 rounded-lg font-mono bg-white/5 border border-white/5 text-slate-500"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Selected indicator */}
                  {selected === option.id && (
                    <div className="flex items-center gap-1.5 mt-4 text-cyan-300 text-xs font-semibold font-mono animate-pulse">
                      <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_8px_#22d3ee]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span>ACTIVE TARGET</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.back()}
                className="flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-white/15"
              >
                Back to Workspace
              </button>

              <button
                onClick={handleExport}
                disabled={!selected || exporting}
                className="flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-3d-cyan"
              >
                {exporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Bundle...</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>{selected ? `Download ${selected === 'single' ? 'HTML' : 'ZIP'}` : 'Select Export Output'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}