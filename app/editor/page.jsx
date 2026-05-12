'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

const defaultTemplate = `
<section style="
  padding: 80px 40px;
  text-align: center;
  min-height: 100vh;
  background: #060a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Inter, sans-serif;
">
 
  <h1 style="
    font-size: 28px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 12px;
    letter-spacing: -0.02em;
  ">Start building your website</h1>
  <p style="
    font-size: 15px;
    color: #64748b;
    margin: 0 0 32px;
    max-width: 340px;
    line-height: 1.6;
  ">select a template or genertae via AI to get started</p>
  
</section>
`

function EditorPageInner() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function fetchTemplate() {
      if (!templateId) {
        setHtml(defaultTemplate)
        setCss('')
        setReady(true)
        return
      }

      const { data, error } = await supabase
        .from('templates')
        .select('html')
        .eq('id', templateId)
        .single()

      if (error || !data?.html) {
        setHtml(defaultTemplate)
        setCss('')
        setReady(true)
        return
      }

      const parser = new DOMParser()
      const doc = parser.parseFromString(data.html, 'text/html')

      const bodyHtml = doc.body.innerHTML

      const styleTags = [...doc.querySelectorAll('style')]
      let cssContent = styleTags.map(s => s.textContent).join('\n')

      const fontLinks = [...doc.querySelectorAll('link[rel="stylesheet"]')]
      const fontImports = fontLinks.map(l => `@import url('${l.getAttribute('href')}');`).join('\n')

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

      setHtml(bodyHtml || defaultTemplate)
      setCss(cssContent)
      setReady(true)
    }

    fetchTemplate()
  }, [templateId])

  function handleSave(data) {
    console.log('Saved:', data)
  }

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(6,182,212,0.3)', borderTopColor: '#06b6d4' }}
        />
        <p className="text-sm" style={{ color: '#64748b' }}>Loading editor...</p>
      </div>
    </div>
  )

  return (
    <GrapesEditor
      initialHtml={html}
      initialCss={css}
      onSave={handleSave}
    />
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'rgba(6,182,212,0.3)', borderTopColor: '#06b6d4' }}
          />
          <p className="text-sm" style={{ color: '#64748b' }}>Loading editor...</p>
        </div>
      </div>
    }>
      <EditorPageInner />
    </Suspense>
  )
}