'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'
import Navbar from '@/components/ui/NAVBAR'

const AlertTriangleIcon = () => <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const PaletteIcon = () => <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>

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
      let user = session?.user

      if (!user) {
        try {
          const cached = localStorage.getItem('creov_cached_user')
          if (cached) user = JSON.parse(cached)
        } catch(e) {}
      }

      if (!user) {
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
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm text-slate-500 font-mono">Loading template canvas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white selection:bg-cyan-500/30">
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl p-8 rounded-3xl border border-red-500/20 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <span className="mb-2"><AlertTriangleIcon /></span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Template</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">{error}</p>
          <button
            onClick={() => window.location.href = '/templates'}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 btn-3d-cyan"
          >
            Back to Templates
          </button>
        </div>
      </div>
    )
  }

  if (!html) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white selection:bg-cyan-500/30">
        <div className="bg-[#080c1e]/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/5 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
            <span className="mb-2"><PaletteIcon /></span>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">No template selected. Please browse our layout catalog.</p>
          <button
            onClick={() => window.location.href = '/templates'}
            className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all duration-300 btn-3d-cyan"
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
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <p className="text-sm text-slate-500 font-mono">Loading editor canvas...</p>
        </div>
      </div>
    }>
      <EditorNewPageInner />
    </Suspense>
  )
}
