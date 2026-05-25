'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

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

function EditorNewPageInner() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const router = useRouter()

  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [template, setTemplate] = useState(null)
  const [savedId, setSavedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadTemplate() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }

      if (templateId) {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .single()

        if (error) {
          setError(error.message)
        } else if (data?.html) {
          setTemplate(data)
          const { bodyHtml, cssContent } = parseFullHtml(data.html)
          setHtml(bodyHtml)
          setCss(cssContent)
        }
      } else {
        const stored = localStorage.getItem('selected_template')
        if (stored) {
          const tmpl = JSON.parse(stored)
          localStorage.removeItem('selected_template')
          setTemplate(tmpl)
          const { bodyHtml, cssContent } = parseFullHtml(tmpl.html)
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

  function showToast(message, isError = false) {
    const toast = document.createElement('div')
    toast.innerText = message
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px;
      background: ${isError ? '#ef4444' : '#06b6d4'};
      color: white; padding: 12px 20px;
      border-radius: 10px; font-size: 13px;
      z-index: 9999; font-family: Inter, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      font-weight: 500;
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  async function handleSave({ html, css, js }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      if (savedId) {
        const { error } = await supabase
          .from('websites')
          .update({ html, css, js, updated_at: new Date().toISOString() })
          .eq('id', savedId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('websites')
          .insert({
            user_id: user.id,
            title: template?.title || 'My Website',
            html, css, js,
            source: 'template',
            template_id: template?.id || null,
          })
          .select()
          .single()
        if (error) throw error
        setSavedId(data.id)
      }

      showToast('Website saved!')
    } catch (err) {
      showToast('Error: ' + err.message, true)
    }
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
          <div className="text-red-500 text-xl mb-4">?? Error</div>
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

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorNewPageInner />
    </Suspense>
  )
}
