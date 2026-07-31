'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'
import { showToast } from '@/lib/toast'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

const VISIBILITY_FIX = `
  .fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right,
  .animate, .animated, .aos-animate, [data-aos],
  .scroll-animation, .reveal, .visible, .show,
  [class*="fade"], [class*="animate"], [class*="scroll"],
  .hidden-initially {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
    visibility: visible !important;
    animation: none !important;
  }
`

function parseFullHtml(fullHtml) {
  if (!fullHtml) return { bodyHtml: '', cssContent: '', jsContent: '' }

  fullHtml = fullHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim()
  fullHtml = fullHtml.replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  if (!fullHtml.trim().startsWith('<html') && !fullHtml.trim().startsWith('<!DOCTYPE')) {
    return { bodyHtml: fullHtml, cssContent: '', jsContent: '' }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(fullHtml, 'text/html')

  const bodyHtml = doc.body.innerHTML

  const styleTags = [...doc.querySelectorAll('style')]
  let cssContent = styleTags.map(s => s.textContent).join('\n')

  const linkTags = [...doc.querySelectorAll('link[rel="stylesheet"]')]
  const fontImports = linkTags
    .map(l => `@import url('${l.getAttribute('href')}');`)
    .join('\n')

  if (fontImports) cssContent = fontImports + '\n' + cssContent

  const bodyStyle = doc.body.getAttribute('style') || ''
  cssContent = `* { box-sizing: border-box; } body { ${bodyStyle} }\n` + cssContent

  const scriptTags = [...doc.querySelectorAll('script')]
  const jsContent = scriptTags
    .filter(s => !s.src)
    .map(s => s.textContent)
    .join('\n')

  return { bodyHtml, cssContent, jsContent }
}

export default function EditWebsite() {
  const params = useParams()
  const websiteId = params?.id
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [editorHtml, setEditorHtml] = useState('')
  const [editorCss, setEditorCss] = useState('')
  const [editorJs, setEditorJs] = useState('')

  useEffect(() => {
    if (websiteId) loadWebsite()
  }, [websiteId])

  async function loadWebsite() {
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

    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('id', websiteId)
      .single()

    if (error || !data) {
      router.push('/dashboard')
      return
    }

    // Parse the HTML to extract body, css, js
    const { bodyHtml, cssContent, jsContent } = parseFullHtml(data.html || '')

    // Use saved css/js if they exist, otherwise use extracted
    const finalCss = (data.css || cssContent) + VISIBILITY_FIX
    const finalJs = data.js || jsContent

    setEditorHtml(finalJs ? `${bodyHtml}<script>${finalJs}<\/script>` : bodyHtml)
    setEditorCss(finalCss)
    setEditorJs(finalJs)
    setLoading(false)
  }



  async function handleSave({ html, css, js }) {
    try {
      // If GrapesJS returns empty js, fall back to what we extracted
      const jsToSave = js || editorJs

      const { error } = await supabase
        .from('websites')
        .update({
          html,
          css,
          js: jsToSave,
          updated_at: new Date().toISOString()
        })
        .eq('id', websiteId)

      if (error) throw error
      setEditorJs(jsToSave) // keep state in sync
      showToast('Website saved!')
    } catch (err) {
      showToast('Error: ' + err.message, true)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white selection:bg-cyan-500/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <p className="text-sm text-slate-500 font-mono">Securing design canvas...</p>
      </div>
    </div>
  )

  return (
    <GrapesEditor
      initialHtml={editorHtml}
      initialCss={editorCss}
      onSave={handleSave}
      websiteId={websiteId}
    />
  )
}