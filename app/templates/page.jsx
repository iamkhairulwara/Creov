'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'

const PaletteIcon = () => <svg className="w-16 h-16 mx-auto mb-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>

const categories = ['All', 'Portfolio', 'Business', 'Restaurant', 'Landing Page', 'E-Commerce']

const DEFAULT_CONTENT = {
  name: 'Sarah Johnson',
  role: 'Creative Developer & Designer',
  bio: 'I create beautiful, responsive websites that bring ideas to life. With 5+ years of experience, I help brands stand out online.',
  email: 'sarah@creativestudio.com',
  phone: '+1 (555) 123-4567'
}

function forceFillContent(html) {
  if (!html || html.trim() === '') {
    return `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#06b6d4 0%,#0284c7 100%);color:white;font-family:sans-serif;">
        <div style="text-align:center;padding:40px;">
          <h1 style="font-size:48px;margin-bottom:20px;">${DEFAULT_CONTENT.name}</h1>
          <p style="font-size:24px;margin-bottom:20px;">${DEFAULT_CONTENT.role}</p>
          <p style="font-size:18px;max-width:500px;">${DEFAULT_CONTENT.bio}</p>
          <button style="margin-top:30px;padding:12px 30px;background:white;color:#06b6d4;border:none;border-radius:50px;font-weight:bold;cursor:pointer;">Get In Touch</button>
        </div>
      </div>`
  }
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

export default function Templates() {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  
  // Responsive iframe viewport width state
  const [viewportWidth, setViewportWidth] = useState('100%')

  useEffect(() => { fetchTemplates() }, [])

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select(`
        id, title, category, html, css, js, is_user_submitted,
        profiles:submitted_by(full_name, email)
      `)
      .eq('status', 'approved')
    if (error) console.error('Error fetching templates:', error.message)
    else setTemplates(data || [])
    setLoading(false)
  }

  const filtered = activeCategory === 'All'
    ? templates
    : templates.filter(t => t.category?.toLowerCase() === activeCategory.toLowerCase())

  const handleUseTemplate = (templateId) => {
    router.push(`/editor/new?templateId=${templateId}`)
  }

  const createCompleteHtml = (template, isThumbnail = true) => {
    const filledContent = forceFillContent(template.html)
    const css = template.css || ''
    const js = template.js || ''

    if (isThumbnail) {
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

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *, html, body { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; }
    ${css}
    ${ANIMATION_OVERRIDE}
  </style>
</head>
<body>${filledContent}<script>${js}</script></body>
</html>`
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white">
      <Navbar />

      {/* Cyber Glow background mesh removed */}

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">

        {/* Dynamic header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-950/20 mb-6 animate-float">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
              Template Library
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Choose your <span className="text-cyan-400">Template</span>
          </h1>
          <p className="text-slate-400 text-lg font-light max-w-xl mx-auto mb-8">
            Kickstart your single-page design with professionally optimized, customizable layouts.
          </p>

        </div>

        {/* Immersive Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => {
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isSelected
                    ? 'bg-cyan-500 text-[#030712] border-cyan-400 shadow-[0_4px_20px_rgba(34,211,238,0.2)] scale-105'
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-cyan-500/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Community CTA */}
        <div className="mb-12 relative rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#080c1e] to-violet-950/30 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(139,92,246,0.05)] hover:border-violet-500/40 transition-colors duration-500 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
          
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-4 text-[10px] font-bold text-violet-300 uppercase tracking-widest">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Developer Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Are you a <span className="text-violet-400">Developer?</span> Showcase Your Skills.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
              Join the Creov community marketplace. Build custom HTML/CSS layouts, share them with thousands of creators, and get recognized for your work.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <button
              onClick={() => router.push('/templates/submit')}
              className="px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-violet-600 hover:bg-violet-500 transition-all duration-300 shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:scale-[1.05] hover:shadow-[0_4px_30px_rgba(139,92,246,0.5)] flex items-center gap-2"
            >
              Start Building
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden animate-pulse border border-white/5 bg-white/5 p-4"
              >
                <div className="h-48 bg-white/5 rounded-2xl mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                  <div className="h-10 bg-white/5 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Templates Grid */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="glass-card text-center py-24 rounded-3xl">
                <PaletteIcon />
                <p className="text-slate-500 font-mono text-sm uppercase">Category Empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(template => (
                  <div
                    key={template.id}
                    className="group rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-300 hover:border-cyan-500/20 hover:shadow-xl hover:scale-[1.01]"
                  >
                    {/* Thumbnail Frame */}
                    <div className="relative overflow-hidden border-b border-white/5" style={{ height: '220px', background: '#0a0f23' }}>
                      <iframe
                        srcDoc={createCompleteHtml(template, true)}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-[1.01] transition-transform duration-500 group-hover:scale-105"
                        title={template.title}
                        sandbox={template.is_user_submitted ? "allow-scripts" : "allow-same-origin allow-scripts"}
                      />

                      {/* Tags */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 backdrop-blur-md w-fit">
                          {template.category}
                        </span>
                        {template.is_user_submitted && template.profiles && (
                          <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg bg-purple-950/80 border border-purple-500/30 text-purple-300 backdrop-blur-md w-fit">
                            BY: {template.profiles.full_name || template.profiles.email?.split('@')[0] || 'Community'}
                          </span>
                        )}
                      </div>

                      {/* Overlay card controls */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20"
                        style={{ background: 'rgba(3,7,18,0.85)' }}>
                        <button
                          onClick={() => {
                            setViewportWidth('100%') // Reset to default desktop
                            setPreviewTemplate(template)
                          }}
                          className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#030712] bg-cyan-500 transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_rgba(34,211,238,0.2)]"
                        >
                          Quick Preview
                        </button>
                      </div>
                    </div>

                    {/* Meta info footer */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg tracking-tight font-[family-name:var(--font-space-grotesk)]">
                            {template.title}
                          </h3>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-1 block">
                            {template.category} Category
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 transition-all duration-300 hover:bg-cyan-500 hover:text-[#030712] hover:border-transparent flex items-center justify-center gap-2"
                      >
                        Use Template
                        <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />

      {/* Multi-Device Live Viewport Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6"
          style={{ background: 'rgba(3,7,18,0.95)' }}>
          
          <div
            className="w-full max-w-6xl flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-[#030712] shadow-2xl"
            style={{ height: '88vh' }}
          >
            {/* Control Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 gap-4 shrink-0 border-b border-white/5">
              <div>
                <h2 className="font-bold text-white text-lg tracking-tight font-[family-name:var(--font-space-grotesk)]">{previewTemplate.title}</h2>
                <p className="text-xs uppercase font-mono tracking-widest text-slate-500 mt-0.5">
                  Responsive Preview Sandbox
                </p>
              </div>

              {/* Viewport resizing toggles */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-1 rounded-xl">
                {[
                  {
                    id: '100%',
                    label: 'Desktop',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    )
                  },
                  {
                    id: '768px',
                    label: 'Tablet',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" transform="rotate(90 12 12)"/>
                        <line x1="12" y1="18" x2="12" y2="18"/>
                      </svg>
                    )
                  },
                  {
                    id: '375px',
                    label: 'Mobile',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12" y2="18"/>
                      </svg>
                    )
                  }
                ].map(mode => {
                  const isActive = viewportWidth === mode.id
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewportWidth(mode.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode.icon}
                      {mode.label}
                    </button>
                  )
                })}
              </div>

              {/* Close controls */}
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs"
              >
                ✕
              </button>
            </div>

            {/* Sandbox Canvas */}
            <div className="flex-1 min-h-0 bg-[#030610] p-6 flex justify-center items-center overflow-auto relative">
              {/* Radial lighting background grid */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
                  backgroundSize: '24px 24px'
                }} 
              />
              
              {/* Responsive Iframe Frame Wrapper */}
              <div
                className="h-full border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out bg-black relative shadow-2xl"
                style={{
                  width: viewportWidth,
                  maxHeight: '100%',
                  borderRadius: viewportWidth === '375px' ? '32px' : '16px',
                  borderWidth: viewportWidth === '375px' ? '8px' : '1px',
                  borderColor: viewportWidth === '375px' ? '#1e293b' : 'rgba(255,255,255,0.06)'
                }}
              >
                {/* Phone chassis camera lens mockup */}
                {viewportWidth === '375px' && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1e293b] rounded-full z-30" />
                )}
                
                <iframe
                  srcDoc={createCompleteHtml(previewTemplate, false)}
                  className="w-full h-full border-0 bg-[#030712] relative z-10"
                  title={previewTemplate.title}
                  sandbox={previewTemplate.is_user_submitted ? "allow-scripts" : "allow-same-origin allow-scripts"}
                />
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div
              className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 shrink-0 border-t border-white/5 bg-[#05091a]"
            >
              <div className="text-[10px] text-slate-500 font-mono">
                CURRENT VIEWPORT: {viewportWidth === '100%' ? 'DESKTOP (100% WIDTH)' : viewportWidth === '768px' ? 'TABLET (768px WIDTH)' : 'MOBILE (375px WIDTH)'}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 hover:text-white hover:border-white/10 transition-all"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    setPreviewTemplate(null)
                    handleUseTemplate(previewTemplate.id)
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#030712] bg-cyan-500 transition-all duration-300 hover:scale-105 shadow-[0_4px_20px_rgba(34,211,238,0.2)]"
                >
                  Use Template →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}