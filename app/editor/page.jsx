'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase/client'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

const defaultTemplate = `
<section style="padding:60px;text-align:center">
  <h1>Welcome to Editor 🚀</h1>
  <p>Start designing your page</p>
  <button>Click Me</button>
</section>
`

export default function EditorPage() {
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
      let cssContent = styleTags.map(s => s.textContent).join('\n') // ✅ was s.innerHTML

      const fontLinks = [...doc.querySelectorAll('link[rel="stylesheet"]')]
      const fontImports = fontLinks
        .map(l => `@import url('${l.getAttribute('href')}');`) // ✅ was l.href (breaks in DOMParser)
        .join('\n')

      if (fontImports) {
        cssContent = fontImports + '\n' + cssContent
      }

      // ✅ Force all scroll-animated elements visible inside the editor
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

  if (!ready) return null

  return (
    <GrapesEditor
      initialHtml={html}
      initialCss={css}
      onSave={handleSave}
    />
  )
}