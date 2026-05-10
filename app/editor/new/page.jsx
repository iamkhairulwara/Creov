'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

// ── Parses a full HTML document into body HTML + CSS ──────────────────────────
function parseFullHtml(fullHtml) {
  if (!fullHtml) return { bodyHtml: '', cssContent: '' }

  const parser = new DOMParser()
  const doc = parser.parseFromString(fullHtml, 'text/html')

  const bodyHtml = doc.body.innerHTML

  const styleTags = [...doc.querySelectorAll('style')]
  let cssContent = styleTags.map(s => s.textContent).join('\n')

  const linkTags = [...doc.querySelectorAll('link[rel="stylesheet"]')]
  const fontImports = linkTags
    .map(l => `@import url('${l.getAttribute('href')}');`)
    .join('\n')

  if (fontImports) {
    cssContent = fontImports + '\n' + cssContent
  }

  // Force all scroll-animated elements visible inside the editor
  cssContent += `
    .fade-in,
    .fade-in.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: none !important;
    }
  `

  return { bodyHtml, cssContent }
}

export default function Page() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadTemplate() {
      if (templateId) {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .single()

        if (error) {
          setError(error.message)
        } else if (data?.html) {
          const { bodyHtml, cssContent } = parseFullHtml(data.html)
          setHtml(bodyHtml)
          setCss(cssContent)
        }
      } else {
        const stored = localStorage.getItem('selected_template')
        if (stored) {
          const template = JSON.parse(stored)
          localStorage.removeItem('selected_template')
          const { bodyHtml, cssContent } = parseFullHtml(template.html)
          setHtml(bodyHtml)
          setCss(cssContent)
        } else {
          setError('No template selected')
        }
      }

      setLoading(false)
    }

    loadTemplate()
  }, [templateId])

  function handleSave({ html, css, js }) {
    console.log('Saved:', { html, css, js })
    alert('Template saved successfully!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/templates'}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  if (!html) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No template selected</p>
          <button
            onClick={() => window.location.href = '/templates'}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Browse Templates
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      <GrapesEditor
        initialHtml={html}
        initialCss={css}
        onSave={handleSave}
      />
    </div>
  )
}