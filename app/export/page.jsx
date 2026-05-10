'use client'

import { useRouter } from 'next/navigation'

export default function EditorPage() {
  const router = useRouter()

  const handleExport = () => {
    // Example editor data
    // Replace these with your REAL GrapesJS values
    const html = editor.getHtml()
    const css = editor.getCss()
    const js = editor.getJs()

    // Save temporarily
    localStorage.setItem(
      'export_code',
      JSON.stringify({
        html,
        css,
        js,
      })
    )

    // Go to export page
    router.push('/export')
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-6">

        <h1 className="text-xl font-semibold">
          Website Editor
        </h1>

        <div className="flex gap-3">

          {/* SAVE BUTTON */}
          <button
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Save
          </button>

          {/* EXPORT BUTTON */}
          <button
            onClick={handleExport}
            className="px-5 py-2 rounded-lg bg-black text-white hover:bg-gray-900"
          >
            Export
          </button>

        </div>
      </div>

      {/* EDITOR AREA */}
      <div className="h-[calc(100vh-64px)]">

        {/* YOUR GRAPES EDITOR COMPONENT */}
        <div id="editor" className="h-full" />

      </div>
    </div>
  )
}