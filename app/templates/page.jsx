'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import { supabase } from '@/lib/supabase/client'

const categories = ['All', 'Portfolio', 'Business', 'Restaurant', 'Landing Page']

// DEFAULT CONTENT that will definitely show
const DEFAULT_CONTENT = {
  name: 'Sarah Johnson',
  role: 'Creative Developer & Designer',
  bio: 'I create beautiful, responsive websites that bring ideas to life. With 5+ years of experience, I help brands stand out online.',
  email: 'sarah@creativestudio.com',
  phone: '+1 (555) 123-4567'
}

// Force replace placeholders with actual content
function forceFillContent(html) {
  if (!html || html.trim() === '') {
    return `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: sans-serif;">
        <div style="text-align: center; padding: 40px;">
          <h1 style="font-size: 48px; margin-bottom: 20px;">${DEFAULT_CONTENT.name}</h1>
          <p style="font-size: 24px; margin-bottom: 20px;">${DEFAULT_CONTENT.role}</p>
          <p style="font-size: 18px; max-width: 500px;">${DEFAULT_CONTENT.bio}</p>
          <button style="margin-top: 30px; padding: 12px 30px; background: white; color: #667eea; border: none; border-radius: 50px; font-weight: bold;">Get In Touch</button>
        </div>
      </div>
    `
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

export default function Templates() {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('id, title, category, html, css, js')

    if (error) {
      console.error('Error fetching templates:', error.message)
    } else {
      setTemplates(data || [])
    }
    setLoading(false)
  }

  const filtered =
    activeCategory === 'All'
      ? templates
      : templates.filter(
          (t) => t.category?.toLowerCase() === activeCategory.toLowerCase()
        )

  const handleUseTemplate = (templateId) => {
    router.push(`/editor/new?templateId=${templateId}`)
  }

  const createCompleteHtml = (template, isThumbnail = true) => {
  let filledContent = forceFillContent(template.html)
  const css = template.css || ''
  const js = template.js || ''
  
  if (isThumbnail) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${template.title} Preview</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            /* HIDE SCROLLBARS - ALL BROWSERS */
            html, body {
              overflow: hidden !important;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            
            html::-webkit-scrollbar,
            body::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              background: transparent !important;
            }
            
            /* Scale for thumbnail */
            body {
              transform: scale(0.35);
              transform-origin: top left;
              width: 286%;
              min-height: 286%;
              overflow: hidden !important;
              background: #0f172a;
            }
            
            ${css}
          </style>
        </head>
        <body>
          ${filledContent}
          <script>${js}</script>
        </body>
      </html>
    `
  }
  
  // Full preview (no scaling, normal scroll)
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.title} Preview</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 100%;
            background: #0f172a;
          }
          
          ${css}
        </style>
      </head>
      <body>
        ${filledContent}
        <script>${js}</script>
      </body>
    </html>
  `
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Choose Your Template
          </h1>
          <p className="text-gray-500 text-lg">
            Pick a design and make it yours in minutes
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                  <div className="h-10 bg-gray-200 rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Template Grid */}
        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-gray-500">No templates found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((template) => (
                  <div
                    key={template.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Thumbnail */}
                    <div className="relative bg-gray-900 overflow-hidden" style={{ height: '220px' }}>
                      <iframe
                        srcDoc={createCompleteHtml(template, true)}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                        title={template.title}
                        sandbox="allow-same-origin allow-scripts"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium rounded-lg shadow-sm">
                          {template.category}
                        </span>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 z-20">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition transform hover:scale-105"
                        >
                          👁️ Quick Preview
                        </button>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {template.title}
                        </h3>
                      </div>
                      
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
                        {template.category}
                      </p>
                      
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-xl text-gray-900">
                  {previewTemplate.title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {previewTemplate.category} Template
                </p>
              </div>
              <button 
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-white">
              <iframe
                srcDoc={createCompleteHtml(previewTemplate, false)}
                className="w-full h-full border-0"
                title={previewTemplate.title}
              />
            </div>
            
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-5 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handleUseTemplate(previewTemplate.id)}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
              >
                Use This Template
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}