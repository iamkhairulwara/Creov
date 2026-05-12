'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CYAN = '#06b6d4'
const CARD_BG = 'rgba(255,255,255,0.02)'
const CARD_BORDER = 'rgba(255,255,255,0.06)'
const TEXT_SECONDARY = '#94a3b8'
const TEXT_MUTED = '#64748b'

export default function ExportPage() {
  const [selected, setSelected] = useState(null)
  const [exporting, setExporting] = useState(false)
  const router = useRouter()

  // Get website data passed via localStorage
  function getWebsiteData() {
    const stored = localStorage.getItem('export_website')
    if (!stored) return null
    return JSON.parse(stored)
  }

  async function handleExport() {
    const website = getWebsiteData()
    if (!website) {
      alert('No website data found. Please go back to the editor.')
      return
    }

    setExporting(true)

    try {
      if (selected === 'single') {
        // Export as single combined .html file
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${website.title || 'My Website'}</title>
  <style>
${website.css || ''}
  </style>
</head>
<body>
${website.html || ''}
<script>
${website.js || ''}
</script>
</body>
</html>`

        const blob = new Blob([fullHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${website.title || 'my-website'}.html`
        a.click()
        URL.revokeObjectURL(url)

      } else if (selected === 'multiple') {
        // Export as ZIP with separate files
        const { exportAsZip } = await import('@/lib/utils/exportZip')
        await exportAsZip({
          html: website.html,
          css: website.css,
          js: website.js,
          filename: website.title || 'my-website'
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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: 'Single HTML File',
      description: 'Everything combined into one .html file. CSS and JS are embedded inside. Best for sharing or quick hosting.',
      tag: 'Simplest',
      files: ['index.html'],
    },
    {
      id: 'multiple',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
        </svg>
      ),
      title: 'Multiple Files (ZIP)',
      description: 'Separate HTML, CSS and JS files packed into a ZIP. Best for developers who want clean organized code.',
      tag: 'Recommended',
      files: ['index.html', 'style.css', 'script.js'],
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">

      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)' }}
        />
      </div>

      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full mb-6 border"
            style={{
              background: 'rgba(6,182,212,0.08)',
              borderColor: 'rgba(6,182,212,0.2)',
              color: CYAN
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Website
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
            Choose export format
          </h1>
          <p style={{ color: TEXT_MUTED }}>
            Select how you want to download your website
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className="text-left p-6 rounded-2xl border transition-all"
              style={{
                background: selected === option.id
                  ? 'rgba(6,182,212,0.08)'
                  : CARD_BG,
                borderColor: selected === option.id
                  ? 'rgba(6,182,212,0.4)'
                  : CARD_BORDER,
                boxShadow: selected === option.id
                  ? '0 0 24px rgba(6,182,212,0.1)'
                  : 'none'
              }}>

              {/* Icon + Tag */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: selected === option.id
                      ? 'rgba(6,182,212,0.15)'
                      : 'rgba(255,255,255,0.04)',
                    color: selected === option.id ? CYAN : TEXT_MUTED
                  }}>
                  {option.icon}
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: selected === option.id
                      ? 'rgba(6,182,212,0.15)'
                      : 'rgba(255,255,255,0.04)',
                    color: selected === option.id ? CYAN : TEXT_MUTED,
                    border: `1px solid ${selected === option.id ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.06)'}`
                  }}>
                  {option.tag}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-bold text-base mb-2"
                style={{ color: selected === option.id ? 'white' : TEXT_SECONDARY }}>
                {option.title}
              </h3>

              {/* Description */}
              <p className="text-xs leading-relaxed mb-4" style={{ color: TEXT_MUTED }}>
                {option.description}
              </p>

              {/* Files list */}
              <div className="flex flex-wrap gap-1.5">
                {option.files.map(f => (
                  <span
                    key={f}
                    className="text-xs px-2 py-0.5 rounded-md font-mono"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: TEXT_MUTED
                    }}>
                    {f}
                  </span>
                ))}
              </div>

              {/* Selected indicator */}
              {selected === option.id && (
                <div className="flex items-center gap-1.5 mt-4">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: CYAN }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium" style={{ color: CYAN }}>Selected</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all border"
            style={{ color: TEXT_SECONDARY, borderColor: CARD_BORDER }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = TEXT_SECONDARY}>
            Back to Editor
          </button>

          <button
            onClick={handleExport}
            disabled={!selected || exporting}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: selected
                ? 'linear-gradient(135deg, #06b6d4, #0284c7)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: selected ? '0 0 24px rgba(6,182,212,0.25)' : 'none'
            }}>
            {exporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {selected ? `Export as ${selected === 'single' ? '.html' : 'ZIP'}` : 'Select a format first'}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}