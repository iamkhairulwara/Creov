'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import { supabase } from '@/lib/supabase/client'

const categories = ['All', 'Portfolio', 'Business', 'Restaurant', 'Landing Page']

const CARD_BG = 'rgba(255,255,255,0.02)'
const CARD_BORDER = 'rgba(255,255,255,0.06)'
const CYAN = '#06b6d4'
const TEXT_SECONDARY = '#94a3b8'
const TEXT_MUTED = '#64748b'

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
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;font-family:sans-serif;">
        <div style="text-align:center;padding:40px;">
          <h1 style="font-size:48px;margin-bottom:20px;">${DEFAULT_CONTENT.name}</h1>
          <p style="font-size:24px;margin-bottom:20px;">${DEFAULT_CONTENT.role}</p>
          <p style="font-size:18px;max-width:500px;">${DEFAULT_CONTENT.bio}</p>
          <button style="margin-top:30px;padding:12px 30px;background:white;color:#667eea;border:none;border-radius:50px;font-weight:bold;">Get In Touch</button>
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

  useEffect(() => { fetchTemplates() }, [])

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('id, title, category, html, css, js')
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
    <div className="min-h-screen">
      <Navbar />

      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full mb-6 border"
            style={{
              background: 'rgba(6,182,212,0.08)',
              borderColor: 'rgba(6,182,212,0.2)',
              color: CYAN
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M3 9h18M9 21V9"/>
            </svg>
            Template Library
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Choose your template
          </h1>
          <p style={{ color: TEXT_SECONDARY }}>
            Pick a professionally designed template and make it yours in minutes
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={
                activeCategory === cat
                  ? {
                      background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                      color: 'white',
                      boxShadow: '0 0 20px rgba(6,182,212,0.3)'
                    }
                  : {
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: TEXT_SECONDARY
                    }
              }
              onMouseEnter={e => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'
                  e.currentTarget.style.color = 'white'
                }
              }}
              onMouseLeave={e => {
                if (activeCategory !== cat) {
                  e.currentTarget.style.borderColor = CARD_BORDER
                  e.currentTarget.style.color = TEXT_SECONDARY
                }
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse border"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
                <div className="h-52 bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                  <div className="h-10 bg-white/5 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Grid */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div
                className="text-center py-20 rounded-2xl border"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
                <div className="text-5xl mb-4">🎨</div>
                <p style={{ color: TEXT_MUTED }}>No templates in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(template => (
                  <div
                    key={template.id}
                    className="group rounded-2xl overflow-hidden border transition-all duration-300"
                    style={{ background: CARD_BG, borderColor: CARD_BORDER }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)'
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = CARD_BORDER
                      e.currentTarget.style.boxShadow = 'none'
                    }}>

                    {/* Thumbnail */}
                    <div className="relative overflow-hidden" style={{ height: '220px', background: '#0a0f23' }}>
                      <iframe
                        srcDoc={createCompleteHtml(template, true)}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                        title={template.title}
                        sandbox="allow-same-origin allow-scripts"
                      />

                      {/* Category badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className="px-2.5 py-1 text-xs font-medium rounded-lg"
                          style={{
                            background: 'rgba(6,182,212,0.15)',
                            border: '1px solid rgba(6,182,212,0.3)',
                            color: CYAN
                          }}>
                          {template.category}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20"
                        style={{ background: 'rgba(6,10,26,0.75)' }}>
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                            boxShadow: '0 0 20px rgba(6,182,212,0.4)'
                          }}>
                          Quick Preview
                        </button>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5">
                      <h3 className="font-semibold text-white text-base mb-1">
                        {template.title}
                      </h3>
                      <p className="text-xs uppercase tracking-widest mb-4" style={{ color: TEXT_MUTED }}>
                        {template.category}
                      </p>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                        Use Template
                        <span className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 inline-block">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(6,10,26,0.9)' }}>
          <div
            className="w-full max-w-5xl flex flex-col border"
            style={{
              height: '88vh',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#080e20',
              borderColor: 'rgba(6,182,212,0.15)'
            }}>

            {/* Modal Header */}
            <div
              className="flex justify-between items-center px-6 py-4 shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <h2 className="font-semibold text-white text-lg">{previewTemplate.title}</h2>
                <p className="text-sm mt-0.5" style={{ color: TEXT_MUTED }}>
                  {previewTemplate.category} Template
                </p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all text-sm"
                style={{ color: TEXT_MUTED, border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = TEXT_MUTED
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                }}>
                ✕
              </button>
            </div>

            {/* iframe */}
            <div className="flex-1 min-h-0">
              <iframe
                srcDoc={createCompleteHtml(previewTemplate, false)}
                className="w-full h-full border-0"
                title={previewTemplate.title}
              />
            </div>

            {/* Modal Footer */}
            <div
              className="flex justify-end gap-3 px-6 py-4 shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ color: TEXT_SECONDARY, border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = TEXT_SECONDARY}>
                Close
              </button>
              <button
                onClick={() => {
                  setPreviewTemplate(null)
                  handleUseTemplate(previewTemplate.id)
                }}
                className="px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                Use This Template →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}