'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'

// Helper to fill template preview content
const DEFAULT_CONTENT = {
  name: 'Sarah Johnson',
  role: 'Creative Developer & Designer',
  bio: 'I create beautiful, responsive websites that bring ideas to life. With 5+ years of experience, I help brands stand out online.',
  email: 'sarah@creativestudio.com',
  phone: '+1 (555) 123-4567'
}

function forceFillContent(html) {
  if (!html || html.trim() === '') return ''
  let filled = html
  filled = filled.replace(/\{\{\s*name\s*\}\}/gi, DEFAULT_CONTENT.name)
  filled = filled.replace(/\{\{\s*role\s*\}\}/gi, DEFAULT_CONTENT.role)
  filled = filled.replace(/\{\{\s*bio\s*\}\}/gi, DEFAULT_CONTENT.bio)
  filled = filled.replace(/\{\{\s*email\s*\}\}/gi, DEFAULT_CONTENT.email)
  filled = filled.replace(/\{\{\s*phone\s*\}\}/gi, DEFAULT_CONTENT.phone)
  filled = filled.replace(/\{\{\s*title\s*\}\}/gi, 'Portfolio')
  filled = filled.replace(/\{\{\s*description\s*\}\}/gi, DEFAULT_CONTENT.bio)
  return filled
}

const ANIMATION_OVERRIDE = `
  [class*="fade"],[class*="reveal"],[class*="animate"],
  [class*="scroll"],[class*="aos"],[class*="hidden"],[class*="visible"] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    visibility: visible !important;
  }
`

const createThumbnailHtml = (template) => {
  const filledContent = forceFillContent(template.html)
  const css = template.css || ''
  const js = template.js || ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    *, html, body { margin: 0; padding: 0; box-sizing: border-box; overflow: hidden !important; scrollbar-width: none !important; }
    html, body { -ms-overflow-style: none; }
    body { transform: scale(0.35); transform-origin: top left; width: 286%; min-height: 286%; }
    ${css}
    ${ANIMATION_OVERRIDE}
  </style>
</head>
<body>${filledContent}<script>${js}</script></body>
</html>`
}

export default function Showcase() {
  const router = useRouter()
  const [websites, setWebsites] = useState([])
  const [featuredTemplates, setFeaturedTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [authToast, setAuthToast] = useState(false)

  useEffect(() => {
    // Check auth for gated actions
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      let currentUser = session?.user
      if (!currentUser) {
        try {
          const cached = localStorage.getItem('creov_cached_user')
          if (cached) currentUser = JSON.parse(cached)
        } catch (e) { }
      }
      setUser(currentUser)
    }

    checkAuth()
    fetchData()
  }, [])

  async function fetchData() {
    // Fetch websites
    const { data: siteData, error: siteError } = await supabase
      .from('websites')
      .select(`
        id, title, description, slug, created_at,
        profiles:user_id(full_name, email)
      `)
      .not('slug', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20)

    if (siteError) console.error('Error fetching showcase:', siteError.message)
    else setWebsites(siteData || [])

    // Fetch featured templates
    const { data: templateData, error: templateError } = await supabase
      .from('templates')
      .select('id, title, category, html, css, js, is_user_submitted, profiles:submitted_by(full_name, email)')
      .eq('status', 'approved')
      .limit(6) // Get top 6 templates

    if (templateError) console.error('Error fetching templates:', templateError.message)
    else setFeaturedTemplates(templateData || [])

    setLoading(false)
  }

  const handleUseTemplate = (templateId) => {
    let currentUser = user
    if (!currentUser) {
      try {
        const cached = localStorage.getItem('creov_cached_user')
        if (cached) currentUser = JSON.parse(cached)
      } catch (e) { }
    }
    setUser(currentUser)
    if (!currentUser) {
      setAuthToast(true)
      setTimeout(() => router.push('/auth/login'), 1500)
      return
    }
    router.push(`/editor/new?templateId=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header */}
        <div className="pt-36 pb-12 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Community Showcase
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Built with <span className="text-cyan-400">Creov</span>
          </h1>
          <p className="text-slate-400 text-lg font-light max-w-xl mx-auto mb-8">
            Explore the amazing websites and templates generated and published by our incredible community of creators.
          </p>
        </div>

        {/* Featured Templates Section */}
        {featuredTemplates.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </span>
                Best Templates
              </h2>
              <button onClick={() => router.push('/templates')} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                View all templates &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTemplates.map((template, idx) => (
                <div key={template.id} className={`group rounded-3xl p-[1px] bg-gradient-to-b ${idx % 2 === 0 ? 'from-cyan-500/30 to-white/5' : 'from-violet-500/30 to-white/5'} hover:from-cyan-400 hover:to-violet-400 transition-all duration-500 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]`}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />

                  <div className="bg-[#030712] rounded-[23px] h-full overflow-hidden flex flex-col relative z-20">
                    <div className="relative h-56 border-b border-white/5 bg-[#0a0f23]">
                      <iframe
                        srcDoc={createThumbnailHtml(template)}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                        title={template.title}
                        sandbox={template.is_user_submitted ? "allow-scripts" : "allow-same-origin allow-scripts"}
                      />
                      <div className="absolute top-4 left-4 z-30">
                        <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white">
                          {template.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[#030712] to-[#0a0f1a]">
                      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                      <div className="mb-6">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-2">{template.title}</h3>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          By {template.profiles?.full_name || template.profiles?.email?.split('@')[0] || 'Creov'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-cyan-500 hover:text-[#030712] hover:border-cyan-500 transition-all duration-300"
                      >
                        Use this template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {featuredTemplates.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-24">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        )}

        {/* Community Sites Section */}
        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </span>
              Published Sites
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
              <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">No published sites yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map(site => (
                <a
                  key={site.id}
                  href={`/p/${site.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative h-64 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 flex flex-col justify-between hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">{site.title || 'Untitled Project'}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 font-light">{site.description || 'A beautiful website generated with AI on Creov.'}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 relative z-10">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      By: {site.profiles?.full_name || site.profiles?.email?.split('@')[0] || 'Anonymous'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-[#030712] transition-colors shadow-lg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Floating Auth Toast Notification */}
      {authToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="rounded-2xl border border-cyan-500/30 bg-[#0a0f24]/95 backdrop-blur-xl p-4 pr-6 flex items-center gap-4 shadow-[0_10px_40px_rgba(34,211,238,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white font-[family-name:var(--font-space-grotesk)] tracking-wide">Sign In Required</p>
              <p className="text-xs text-slate-400 font-light mt-0.5">Redirecting to login...</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
