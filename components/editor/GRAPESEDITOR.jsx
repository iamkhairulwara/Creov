'use client'
import { useEffect, useRef } from 'react'

export default function GrapesEditor({ initialHtml = '', onSave }) {
  const editorRef = useRef(null)
  const gjsRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (gjsRef.current) return

    async function initEditor() {
      console.log('Initializing GrapesJS...')

      const grapesjs = (await import('grapesjs')).default
      const presetWebpage = (await import('grapesjs-preset-webpage')).default

      const editor = grapesjs.init({
        container: editorRef.current,
        height: '100%',
        width: '100%',
        storageManager: false,
        plugins: [presetWebpage],
        pluginsOpts: {
          [presetWebpage]: {}
        }
      })

      
      //  IMAGE BLOCK (CUSTOM)
     
      editor.BlockManager.add('image-block', {
        label: 'Image',
        category: 'Basic',
        content: {
          type: 'image',
          activeOnRender: 1,
          src: 'https://via.placeholder.com/300'
        }
      })

      
      //  SECTION BLOCK 
      
      editor.BlockManager.add('section', {
        label: 'Section',
        content: '<section style="padding:50px">New Section</section>',
      })

      
      //  IMAGE STYLING 
      
      const styleManager = editor.StyleManager

      styleManager.addSector('size', {
        name: 'Size',
        open: true,
        buildProps: ['width', 'height', 'max-width']
      })

      styleManager.addSector('spacing', {
        name: 'Spacing',
        open: false,
        buildProps: ['margin', 'padding']
      })

      styleManager.addSector('decorations', {
        name: 'Decorations',
        open: false,
        buildProps: [
          'opacity',
          'border-radius',
          'box-shadow',
          'filter'
        ]
      })

      styleManager.addSector('extra', {
        name: 'Transform',
        open: false,
        buildProps: [
          'transform'
        ]
      })

      
      // LOAD INITIAL HTML
      
      if (initialHtml) {
        editor.setComponents(initialHtml)
      }

      gjsRef.current = editor
    }

    initEditor()

    return () => {
      if (gjsRef.current) {
        gjsRef.current.destroy()
        gjsRef.current = null
      }
    }
  }, [])

  // Update HTML dynamically
  useEffect(() => {
    if (gjsRef.current && initialHtml) {
      gjsRef.current.setComponents(initialHtml)
    }
  }, [initialHtml])

  function handleSave() {
    if (!gjsRef.current) return

    const html = gjsRef.current.getHtml()
    const css = gjsRef.current.getCss()
    const js = gjsRef.current.getJs()

    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
<style>${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>
`

    console.log('Export:', fullHtml)

    if (onSave) onSave({ html, css, js, fullHtml })
  }

  function handlePreview() {
    if (!gjsRef.current) return

    const html = gjsRef.current.getHtml()
    const css = gjsRef.current.getCss()

    const win = window.open()
    win.document.write(`
<html>
<head><style>${css}</style></head>
<body>${html}</body>
</html>
`)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex justify-between">
        <h1 className="text-sm font-semibold">Creov Editor</h1>

        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            className="border px-4 py-1.5 rounded text-sm"
          >
            Preview
          </button>

          <button
            onClick={handleSave}
            className="bg-black text-white px-4 py-1.5 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>

      {/* Editor */}
      <div ref={editorRef} className="flex-1 min-h-0" />
    </div>
  )
}