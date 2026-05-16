'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'

const GrapesEditor = dynamic(
  () => import('@/components/editor/GRAPESEDITOR'),
  { ssr: false }
)

const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Start Building</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        section {
            padding: 80px 40px;
            text-align: center;
            min-height: 100vh;
            background: #060a1a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        h1 {
            font-size: 48px;
            margin-bottom: 20px;
            color: white;
        }
        p {
            font-size: 18px;
            color: #64748b;
            max-width: 500px;
        }
    </style>
</head>
<body>
    <section>
        <h1>Start building your website</h1>
        <p>Select a template or generate via AI to get started</p>
    </section>
</body>
</html>`

function EditorPageInner() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function fetchContent() {
      console.log("🔍 Editor: Checking for content...")
      
      // CRITICAL: Check sessionStorage FIRST (used by generate page)
      const generatedHtml = sessionStorage.getItem('generatedHTML')
      console.log("📦 Editor: sessionStorage has HTML?", !!generatedHtml, "Length:", generatedHtml?.length)
      
      if (generatedHtml && generatedHtml.length > 500) {
        console.log("✅ Editor: Loading generated HTML from sessionStorage")
        // Clear it after reading to prevent re-loading
        sessionStorage.removeItem('generatedHTML')
        sessionStorage.removeItem('generatedPrompt')
        
        setHtml(generatedHtml)
        setCss('')
        setReady(true)
        return
      }
      
      // Also check localStorage as fallback
      const localGenerated = localStorage.getItem('generatedHTML')
      if (localGenerated && localGenerated.length > 500) {
        console.log("✅ Editor: Loading generated HTML from localStorage")
        localStorage.removeItem('generatedHTML')
        setHtml(localGenerated)
        setCss('')
        setReady(true)
        return
      }
      
      // If no generated content, load default
      console.log("📄 Editor: No generated content found, loading default template")
      setHtml(defaultTemplate)
      setCss('')
      setReady(true)
    }

    fetchContent()
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
        <p style={{ color: '#64748b' }}>Loading editor...</p>
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
          <p style={{ color: '#64748b' }}>Loading editor...</p>
        </div>
      </div>
    }>
      <EditorPageInner />
    </Suspense>
  )
}