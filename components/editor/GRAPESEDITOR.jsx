'use client'

import { useEffect, useRef, useState } from 'react'
import './grapes-theme.css'

function uploadImageFromDevice() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload = (ev) => resolve(ev.target.result)
      reader.readAsDataURL(file)
    }
    input.click()
  })
}

const TUI_CSS       = 'https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.min.css'
const TUI_COLOR_CSS = 'https://uicdn.toast.com/tui.color-picker/latest/tui-color-picker.min.css'
const FABRIC_JS     = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js'
const TUI_COLOR_JS  = 'https://uicdn.toast.com/tui.color-picker/latest/tui-color-picker.min.js'
const TUI_JS        = 'https://uicdn.toast.com/tui-image-editor/latest/tui-image-editor.min.js'

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src; s.onload = resolve; s.onerror = resolve
    document.head.appendChild(s)
  })
}

function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'; l.href = href
  document.head.appendChild(l)
}

const TUI_THEME = {
  'common.backgroundColor': '#1a1a1a',
  'common.border': '0px',
  'header.backgroundImage': 'none',
  'header.backgroundColor': '#111',
  'header.border': '0px',
  'loadButton.backgroundColor': '#fff',
  'loadButton.border': '1px solid #ddd',
  'loadButton.color': '#222',
  'downloadButton.backgroundColor': '#000',
  'downloadButton.border': '1px solid #000',
  'downloadButton.color': '#fff',
  'submenu.backgroundColor': '#1a1a1a',
  'submenu.partition.color': '#333',
  'submenu.normalLabel.color': '#aaa',
  'submenu.activeLabel.color': '#fff',
  'submenu.activeLabel.fontWeight': '700',
  'checkbox.border': '1px solid #555',
  'checkbox.backgroundColor': '#1a1a1a',
  'range.pointer.color': '#fff',
  'range.bar.color': '#333',
  'range.subbar.color': '#fff',
  'range.value.color': '#fff',
  'range.value.border': '1px solid #444',
  'range.value.backgroundColor': '#1a1a1a',
  'range.title.color': '#aaa',
  'colorpicker.button.border': '1px solid #555',
  'colorpicker.title.color': '#aaa',
  'common.bi.image': '',
  'common.bisize.width': '0px',
  'common.bisize.height': '0px',
}

function ImageEditorModal({ imageUrl, onApply, onClose }) {
  const containerRef = useRef(null)
  const tuiRef       = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    async function init() {
      loadCSS(TUI_CSS)
      loadCSS(TUI_COLOR_CSS)
      await loadScript(FABRIC_JS)
      await loadScript(TUI_COLOR_JS)
      await loadScript(TUI_JS)
      if (!mounted || !containerRef.current || !window.tui?.ImageEditor) return
      tuiRef.current = new window.tui.ImageEditor(containerRef.current, {
        includeUI: {
          loadImage: { path: imageUrl, name: 'image' },
          theme: TUI_THEME,
          menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'text', 'filter'],
          initMenu: 'crop',
          uiSize: { width: '100%', height: '100%' },
          menuBarPosition: 'bottom',
        },
        cssMaxWidth: 750,
        cssMaxHeight: 480,
        usageStatistics: false,
      })
      if (mounted) setReady(true)
    }
    init()
    return () => {
      mounted = false
      try { tuiRef.current?.destroy() } catch (e) {}
    }
  }, [imageUrl])

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: 880, height: 660, maxWidth: '96vw', maxHeight: '96vh', background: '#1a1a1a' }}>
        <div className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: '#111', borderBottom: '1px solid #2a2a2a' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white opacity-80" />
            <span className="text-sm font-semibold text-white tracking-tight">Image Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
              style={{ color: '#aaa', border: '1px solid #333', background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = '#222'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Cancel
            </button>
            <button
              onClick={() => { if (tuiRef.current) onApply(tuiRef.current.toDataURL()) }}
              disabled={!ready}
              className="px-4 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
              style={{ background: '#fff', color: '#000' }}>
              Apply to Canvas
            </button>
          </div>
        </div>
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: '#1a1a1a' }}>
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs text-gray-400">Loading image editor…</span>
          </div>
        )}
        <div ref={containerRef} className="flex-1 min-h-0" />
      </div>
    </div>
  )
}

let editorInitialized = false

export default function GrapesEditor({ initialHtml = '', initialCss = '', onSave }) {
  const editorRef = useRef(null)
  const gjsRef    = useRef(null)

  const [activeDevice, setActiveDevice] = useState('Desktop')
  const [activePanel,  setActivePanel]  = useState('blocks')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageModal,   setImageModal]   = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (editorInitialized) return
    editorInitialized = true

    async function initEditor() {
      
      const grapesjs = (await import('grapesjs')).default
        loadCSS('https://unpkg.com/grapesjs/dist/css/grapes.min.css')

      const editor = grapesjs.init({
        container: editorRef.current,
        height: '100%',
        width: '100%',
        storageManager: false,
        
        plugins: [],
        pluginsOpts: {},
        panels: { defaults: [] },

        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet',  width: '768px',  widthMedia: '992px' },
            { name: 'Mobile',  width: '375px',  widthMedia: '480px' },
          ],
        },

        blockManager: { appendTo: '#gjs-blocks' },
        layerManager: { appendTo: '#gjs-layers' },
        traitManager: { appendTo: '#gjs-traits' },

        styleManager: {
          appendTo: '#gjs-styles',
          sectors: [],
        },
      })

      // ── Setup everything after editor loads ─────────────────────────────
      editor.on('load', () => {
        // Clear any existing blocks
        const bm = editor.BlockManager
        bm.getAll().reset()

        // ── Add ONLY your working blocks ───────────────────────────────
        
        // Basic blocks
        bm.add('text', {
          label: 'Text',
          category: 'Basic',
          content: '<div style="padding: 10px; color: #000000;">Insert your text here</div>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 6.1H3M21 12.1H3M15.1 18H3"/></svg>`,
        })

        bm.add('heading', {
          label: 'Heading',
          category: 'Basic',
          content: '<h1 style="color: #000000; margin: 20px 0;">Heading Title</h1>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
        })

        bm.add('image', {
          label: 'Image',
          category: 'Media',
          content: { type: 'image' },
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        })

        bm.add('button', {
          label: 'Button',
          category: 'Basic',
          content: '<button style="padding: 10px 20px; background: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Button</button>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
        })

        bm.add('link', {
          label: 'Link',
          category: 'Basic',
          content: '<a href="#" style="color: #0000EE;">Link text</a>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
        })

        // Layout blocks
        bm.add('section', {
          label: 'Section',
          category: 'Layout',
          content: '<section style="padding: 60px 40px; min-height: 180px; background: #f5f5f5;"><p>Your content here</p></section>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/></svg>`,
        })

        bm.add('columns-2', {
          label: '2 Columns',
          category: 'Layout',
          content: `<div style="display: flex; gap: 20px;">
            <div style="flex: 1; padding: 20px; min-height: 100px; background: #f9f9f9;">Column 1</div>
            <div style="flex: 1; padding: 20px; min-height: 100px; background: #f9f9f9;">Column 2</div>
          </div>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>`,
        })

        bm.add('columns-3', {
          label: '3 Columns',
          category: 'Layout',
          content: `<div style="display: flex; gap: 20px;">
            <div style="flex: 1; padding: 20px; min-height: 100px; background: #f9f9f9;">Column 1</div>
            <div style="flex: 1; padding: 20px; min-height: 100px; background: #f9f9f9;">Column 2</div>
            <div style="flex: 1; padding: 20px; min-height: 100px; background: #f9f9f9;">Column 3</div>
          </div>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="6" height="18" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="17" y="3" width="6" height="18" rx="1"/></svg>`,
        })

        // Media blocks
        bm.add('video', {
          label: 'Video',
          category: 'Media',
          content: { type: 'video', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', style: { height: '350px', width: '100%' } },
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
        })

        bm.add('map', {
          label: 'Map',
          category: 'Media',
          content: { type: 'map', style: { height: '350px', width: '100%' } },
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
        })

        // ── Style sectors ─────────────────────────────────────────────────
        const sm = editor.StyleManager
        
        sm.addSector('colors', {
          name: 'Colors',
          open: true,
          properties: [
            { name: 'Text Color', property: 'color', type: 'color' },
            { name: 'Background', property: 'background-color', type: 'color' },
          ],
        })

        sm.addSector('size', {
          name: 'Size',
          open: false,
          buildProps: ['width', 'height', 'max-width', 'min-height'],
        })

        sm.addSector('spacing', {
          name: 'Spacing',
          open: false,
          buildProps: ['margin', 'padding'],
        })

        sm.addSector('typography', {
          name: 'Typography',
          open: false,
          properties: [
            {
              property: 'font-family',
              type: 'select',
              options: [
                { value: 'Arial, sans-serif', name: 'Arial' },
                { value: 'Georgia, serif', name: 'Georgia' },
                { value: 'Courier New, monospace', name: 'Courier New' },
              ],
            },
            { property: 'font-size', type: 'integer', units: ['px', 'em', 'rem'] },
            {
              property: 'font-weight',
              type: 'select',
              options: [
                { value: '300', name: 'Light' },
                { value: '400', name: 'Regular' },
                { value: '600', name: 'Semi Bold' },
                { value: '700', name: 'Bold' },
              ],
            },
            {
              property: 'text-align',
              type: 'radio',
              options: [{ value: 'left' }, { value: 'center' }, { value: 'right' }],
            },
          ],
        })

        sm.addSector('border', {
          name: 'Border',
          open: false,
          properties: [
            { property: 'border-width', type: 'integer', units: ['px'] },
            {
              property: 'border-style',
              type: 'select',
              options: [{ value: 'none' }, { value: 'solid' }, { value: 'dashed' }],
            },
            { name: 'Border Color', property: 'border-color', type: 'color' },
            { property: 'border-radius', type: 'integer', units: ['px', '%'] },
          ],
        })

        // Load initial content
        if (initialHtml) editor.setComponents(initialHtml)
        if (initialCss) editor.setStyle(initialCss)
      })

      // Image upload command
      editor.Commands.add('upload-image', {
        run(ed) {
          const sel = ed.getSelected()
          uploadImageFromDevice().then(dataUrl => {
            if (!dataUrl) return
            if (sel && sel.get('type') === 'image') {
              sel.set('src', dataUrl)
              const el = sel.getEl()
              if (el) el.src = dataUrl
            } else {
              ed.addComponents(`<img src="${dataUrl}" style="max-width:100%;display:block;" />`)
            }
          })
        },
      })

      editor.Commands.add('open-image-editor', {
        run(ed) {
          const sel = ed.getSelected()
          if (!sel) return
          const url = sel.get('src') || sel.getEl()?.src || ''
          const noImage = !url || url.includes('placeholder') || url.includes('placehold')
          if (noImage) {
            const captured = sel
            uploadImageFromDevice().then(dataUrl => {
              if (!dataUrl) return
              captured.set('src', dataUrl)
              const el = captured.getEl()
              if (el) el.src = dataUrl
              setTimeout(() => window.__gjsOpenImageModal?.(dataUrl, captured), 100)
            })
            return
          }
          window.__gjsOpenImageModal?.(url, sel)
        },
      })

      editor.on('component:selected', (component) => {
        if (component?.get('type') !== 'image') return
        const toolbar = component.get('toolbar') || []
        if (!toolbar.find(t => t.command === 'upload-image')) {
          toolbar.unshift({
            attributes: { title: 'Upload from device' },
            command: 'upload-image',
            label: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          })
        }
        if (!toolbar.find(t => t.command === 'open-image-editor')) {
          toolbar.unshift({
            attributes: { title: 'Edit image' },
            command: 'open-image-editor',
            label: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
          })
        }
        component.set('toolbar', toolbar)
      })

      gjsRef.current = editor

      window.__gjsOpenImageModal = (url, component) => {
        setImageModal({ url, component })
      }
    }

    initEditor()

    return () => {
      editorInitialized = false
      window.__gjsOpenImageModal = null
      if (gjsRef.current) { gjsRef.current.destroy(); gjsRef.current = null }
    }
  }, [])

  useEffect(() => {
    if (!gjsRef.current) return
    if (initialHtml) gjsRef.current.setComponents(initialHtml)
    if (initialCss)  gjsRef.current.setStyle(initialCss)
  }, [initialHtml, initialCss])

  function switchDevice(device) {
    gjsRef.current?.setDevice(device)
    setActiveDevice(device)
  }

  const undo = () => gjsRef.current?.UndoManager.undo()
  const redo = () => gjsRef.current?.UndoManager.redo()

  function handlePreview() {
    if (!gjsRef.current) return
    const html = gjsRef.current.getHtml()
    const css  = gjsRef.current.getCss()
    const win  = window.open()
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`)
    win.document.close()
  }

  function handleSave() {
    if (!gjsRef.current) return
    const html     = gjsRef.current.getHtml()
    const css      = gjsRef.current.getCss()
    const js       = gjsRef.current.getJs()
    const fullHtml = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>${css}</style>\n</head>\n<body>\n${html}\n<script>${js}<\/script>\n</body>\n</html>`
    if (onSave) onSave({ html, css, js, fullHtml })
  }
async function handleExport() {
  if (!gjsRef.current) return
  const html = gjsRef.current.getHtml()
  const css = gjsRef.current.getCss()
  const js = gjsRef.current.getJs()

  const { exportAsZip } = await import('@/lib/utils/exportZip')
  await exportAsZip({ html, css, js, filename: 'my-website' })
}
  function handleImageApply(dataUrl) {
    if (imageModal?.component) {
      imageModal.component.set('src', dataUrl)
      const el = imageModal.component.getEl()
      if (el) el.src = dataUrl
    }
    setImageModal(null)
  }

  async function handleSidebarUpload() {
    if (!gjsRef.current) return
    const sel = gjsRef.current.getSelected()
    const dataUrl = await uploadImageFromDevice()
    if (!dataUrl) return
    if (sel && sel.get('type') === 'image') {
      sel.set('src', dataUrl)
      const el = sel.getEl()
      if (el) el.src = dataUrl
    } else {
      gjsRef.current.addComponents(`<img src="${dataUrl}" style="max-width:100%;display:block;" />`)
    }
  }

  const devices = ['Desktop', 'Tablet', 'Mobile']
  const panels  = [
    { id: 'blocks', label: 'Blocks'   },
    { id: 'styles', label: 'Styles'   },
    { id: 'layers', label: 'Layers'   },
    { id: 'traits', label: 'Settings' },
  ]

  return (
    <>
      <div className={`flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen w-full'}`}>
        <div className="flex items-center justify-between px-5 shrink-0 bg-white border-b border-gray-100" style={{ height: 52 }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="text-sm font-bold tracking-tight">Creov</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-0.5">
              <IconBtn onClick={undo} title="Undo"><UndoIcon /></IconBtn>
              <IconBtn onClick={redo} title="Redo"><RedoIcon /></IconBtn>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
            {devices.map(d => (
              <button key={d} onClick={() => switchDevice(d)} title={d}
                className={`flex items-center justify-center w-8 h-7 rounded-lg transition-all text-sm ${
                  activeDevice === d ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-700'
                }`}>
                {d === 'Desktop' ? <DesktopIcon /> : d === 'Tablet' ? <TabletIcon /> : <MobileIcon />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <EyeIcon /> Preview
            </button>
            <IconBtn onClick={() => setIsFullscreen(f => !f)} title="Fullscreen">
              {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </IconBtn>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <SaveIcon /> Save
            </button>

            <button
  onClick={handleExport}
  className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
>
  Export ZIP
</button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col shrink-0 bg-white border-r border-gray-100" style={{ width: 216 }}>
            <div className="flex border-b border-gray-100 px-1 pt-1 shrink-0 gap-0.5">
              {panels.map(p => (
                <button key={p.id} onClick={() => setActivePanel(p.id)}
                  className={`flex-1 py-2 text-[9px] font-bold tracking-widest uppercase rounded-t-lg transition-all ${
                    activePanel === p.id ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div id="gjs-blocks" style={{ display: activePanel === 'blocks' ? 'block' : 'none' }} />
              <div id="gjs-styles" style={{ display: activePanel === 'styles' ? 'block' : 'none' }} />
              <div id="gjs-layers" style={{ display: activePanel === 'layers' ? 'block' : 'none', padding: '8px' }} />
              <div id="gjs-traits" style={{ display: activePanel === 'traits' ? 'block' : 'none' }} />
            </div>

            
          </div>

          <div ref={editorRef} className="flex-1 min-h-0" />
        </div>
      </div>

      {imageModal && (
        <ImageEditorModal
          imageUrl={imageModal.url}
          onApply={handleImageApply}
          onClose={() => setImageModal(null)}
        />
      )}
    </>
  )
}

function IconBtn({ onClick, title, children }) {
  return (
    <button onClick={onClick} title={title}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-black transition-colors">
      {children}
    </button>
  )
}

const s = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const UndoIcon           = () => <svg {...s}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
const RedoIcon           = () => <svg {...s}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
const DesktopIcon        = () => <svg {...s}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
const TabletIcon         = () => <svg {...s}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const MobileIcon         = () => <svg {...s}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const FullscreenIcon     = () => <svg {...s}><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M16 21h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
const ExitFullscreenIcon = () => <svg {...s}><path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3"/></svg>
const EyeIcon            = () => <svg {...s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const SaveIcon           = () => <svg {...s}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const UploadIcon         = () => <svg {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>