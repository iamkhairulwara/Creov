'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import { supabase } from '@/lib/supabase/client'

const categories = ['All', 'Portfolio', 'Business', 'Restaurant', 'Landing Page']

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

// Generic — covers any animation class name any future template might use
const ANIMATION_OVERRIDE = `
  [class*="fade"],
  [class*="reveal"],
  [class*="animate"],
  [class*="scroll"],
  [class*="aos"],
  [class*="hidden"],
  [class*="visible"] {
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

  const filtered =
    activeCategory === 'All'
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

    // Full preview — NO background hardcoded, template's own CSS controls it
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
            Choose Your Template
          </h1>
          <p className="text-gray-500 text-lg">Pick a design and make it yours in minutes</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-10 bg-gray-200 rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-gray-500">No templates found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((template) => (
                  <div key={template.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative bg-gray-900 overflow-hidden" style={{ height: '220px' }}>
                      <iframe
                        srcDoc={createCompleteHtml(template, true)}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                        title={template.title}
                        sandbox="allow-same-origin allow-scripts"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-lg shadow-sm">
                          {template.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                        <button onClick={() => setPreviewTemplate(template)}
                          className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition transform hover:scale-105">
                          👁️ Quick Preview
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{template.title}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">{template.category}</p>
                      <button onClick={() => handleUseTemplate(template.id)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                        Use Template
                        <span className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">→</span>
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
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl flex flex-col shadow-2xl"
            style={{ height: '88vh', borderRadius: '16px', overflow: 'hidden', background: '#111827' }}>

            {/* Header — neutral dark, works for any template color */}
            <div className="flex justify-between items-center px-5 py-3 shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#111827' }}>
              <div>
                <h2 className="font-semibold text-lg text-white">{previewTemplate.title}</h2>
                <p className="text-sm mt-0.5" style={{ color: '#9ca3af' }}>{previewTemplate.category} Template</p>
              </div>
              <button onClick={() => setPreviewTemplate(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition">
                ✕
              </button>
            </div>

            {/* iframe fills completely — template's own background shows, no color clash */}
            <div className="flex-1 min-h-0">
              <iframe
                srcDoc={createCompleteHtml(previewTemplate, false)}
                className="w-full h-full border-0"
                title={previewTemplate.title}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-3 shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111827' }}>
              <button onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                Close
              </button>
              <button onClick={() => handleUseTemplate(previewTemplate.id)}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2 transition"
                style={{ background: '#6366f1' }}
                onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
                onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}>
                Use This Template <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}