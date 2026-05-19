'use client'

import { useEffect, useRef, useState } from 'react'
import './grapes-theme.css'

const CYAN = '#06b6d4'
const CYAN_DIM = 'rgba(6,182,212,0.15)'
const TOOLBAR_BG = '#080e20'
const SIDEBAR_BG = '#080e20'
const BORDER = 'rgba(255,255,255,0.06)'
const TEXT_MUTED = '#64748b'
const TEXT_SECONDARY = '#94a3b8'

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

function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const l = document.createElement('link')
  l.rel = 'stylesheet'; l.href = href
  document.head.appendChild(l)
}

let editorInitialized = false

export default function GrapesEditor({ initialHtml = '', initialCss = '', onSave }) {
  const editorRef = useRef(null)
  const gjsRef = useRef(null)

  const [activeDevice, setActiveDevice] = useState('Desktop')
  const [activePanel, setActivePanel] = useState('blocks')
  const [isFullscreen, setIsFullscreen] = useState(false)

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
        
        dragMode: 'translate',
        avoidInlineStyle: true,
        fromElement: false,
        clearOnRender: false,
        
        domComponents: {
          draggableComponents: true,
          components: {
            wrapper: {
              droppable: true,
            }
          }
        },
        
        canvas: {
          styles: ['/grapes-theme.css']
        },
        
        plugins: [],
        pluginsOpts: {},
        panels: { defaults: [] },
        
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px', widthMedia: '768px' },
            { name: 'Mobile', width: '375px', widthMedia: '480px' },
          ],
        },
        
        blockManager: { appendTo: '#gjs-blocks' },
        layerManager: { appendTo: '#gjs-layers' },
        traitManager: { appendTo: '#gjs-traits' },
        styleManager: { appendTo: '#gjs-styles', sectors: [] },
      })

      editor.DomComponents.addType('default', {
        model: {
          defaults: {
            droppable: true,
            draggable: true,
            copyable: true,
            selectable: true,
            hoverable: true,
          }
        }
      })

      editor.on('load', () => {
        const imageComponent = editor.DomComponents.getType('image')
        if (imageComponent) {
          imageComponent.model.prototype.defaults.draggable = true
          imageComponent.model.prototype.defaults.resizable = true
        }
        
        const bm = editor.BlockManager
        bm.getAll().reset()

        bm.add('text', {
          label: 'Text', category: 'Basic',
          content: '<div style="padding: 10px;">Insert your text here</div>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 6.1H3M21 12.1H3M15.1 18H3"/></svg>`,
        })
        
        bm.add('heading', {
          label: 'Heading', category: 'Basic',
          content: '<h1 style="margin: 20px 0;">Heading Title</h1>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
        })
        
        bm.add('image', {
          label: 'Image', category: 'Media',
          content: { type: 'image' },
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        })
        
        bm.add('button', {
          label: 'Button', category: 'Basic',
          content: '<button style="padding: 10px 20px; background: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Button</button>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
        })
        
        bm.add('link', {
          label: 'Link', category: 'Basic',
          content: '<a href="#" style="color: #0000EE;">Link text</a>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
        })
        
        bm.add('section', {
          label: 'Section', category: 'Layout',
          content: '<section style="padding: 60px 40px; min-height: 180px; background: #f5f5f5; width: 100%;"><p>Your content here</p></section>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/></svg>`,
        })
        
        bm.add('columns-2', {
          label: '2 Cols', category: 'Layout',
          content: `
            <section style="padding:20px; width:100%;">
              <div style="display:flex; flex-wrap:wrap; gap:20px;">
                <div style="flex:1 1 300px; min-height:100px; padding:20px; background:#f9f9f9;">
                  Column 1
                </div>
                <div style="flex:1 1 300px; min-height:100px; padding:20px; background:#f9f9f9;">
                  Column 2
                </div>
              </div>
            </section>
          `,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>`,
        })
        
        bm.add('columns-3', {
          label: '3 Cols', category: 'Layout',
          content: `
            <section style="padding:20px; width:100%;">
              <div style="display:flex; flex-wrap:wrap; gap:20px;">
                <div style="flex:1 1 250px; min-height:100px; padding:20px; background:#f9f9f9;">Col 1</div>
                <div style="flex:1 1 250px; min-height:100px; padding:20px; background:#f9f9f9;">Col 2</div>
                <div style="flex:1 1 250px; min-height:100px; padding:20px; background:#f9f9f9;">Col 3</div>
              </div>
            </section>
          `,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="6" height="18" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="17" y="3" width="6" height="18" rx="1"/></svg>`,
        })
        

        const sm = editor.StyleManager
        sm.addSector('colors', {
          name: 'Colors', open: true,
          properties: [
            { name: 'Text Color', property: 'color', type: 'color' },
            { name: 'Background', property: 'background-color', type: 'color' },
          ],
        })
        sm.addSector('spacing', { name: 'Spacing', open: false, buildProps: ['margin', 'padding'] })
        sm.addSector('typography', {
          name: 'Typography', open: false,
          properties: [
            { property: 'font-family', type: 'select', options: [{ value: 'Arial, sans-serif', name: 'Arial' }, { value: 'Georgia, serif', name: 'Georgia' }, { value: 'Courier New, monospace', name: 'Courier New' }] },
            { property: 'font-size', type: 'integer', units: ['px', 'em', 'rem'] },
            { property: 'font-weight', type: 'select', options: [{ value: '300', name: 'Light' }, { value: '400', name: 'Regular' }, { value: '600', name: 'Semi Bold' }, { value: '700', name: 'Bold' }] },
            { property: 'text-align', type: 'radio', options: [{ value: 'left' }, { value: 'center' }, { value: 'right' }] },
          ],
        })
        sm.addSector('border', {
          name: 'Border', open: false,
          properties: [
            { property: 'border-width', type: 'integer', units: ['px'] },
            { property: 'border-style', type: 'select', options: [{ value: 'none' }, { value: 'solid' }, { value: 'dashed' }] },
            { name: 'Border Color', property: 'border-color', type: 'color' },
            { property: 'border-radius', type: 'integer', units: ['px', '%'] },
          ],
        })

        if (initialHtml) editor.setComponents(initialHtml)
        if (initialCss) editor.setStyle(initialCss)
      })

      // Device change handler
      editor.on('device:change', (device) => {
        setTimeout(() => {
          const iframe = document.querySelector('.gjs-frame iframe')
          if (iframe && iframe.contentWindow) {
            const resizeEvent = new Event('resize')
            iframe.contentWindow.dispatchEvent(resizeEvent)
          }
          editor.refresh()
        }, 50)
      })

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

      editor.on('component:selected', (component) => {
        if (component?.get('type') !== 'image') return
        const toolbar = component.get('toolbar') || []
        if (!toolbar.find(t => t.command === 'upload-image')) {
          toolbar.unshift({
            attributes: { title: 'Change image' },
            command: 'upload-image',
            label: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          })
        }
        component.set('toolbar', toolbar)
      })

      gjsRef.current = editor
    }

    initEditor()

    return () => {
      editorInitialized = false
      if (gjsRef.current) { gjsRef.current.destroy(); gjsRef.current = null }
    }
  }, [])

  useEffect(() => {
    if (!gjsRef.current) return
    if (initialHtml) gjsRef.current.setComponents(initialHtml)
    if (initialCss) gjsRef.current.setStyle(initialCss)
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
    const css = gjsRef.current.getCss()
    const win = window.open()
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`)
    win.document.close()
  }

  function handleSave() {
    if (!gjsRef.current) return
    const html = gjsRef.current.getHtml()
    const css = gjsRef.current.getCss()
    const js = gjsRef.current.getJs()
    const fullHtml = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>${css}</style>\n</head>\n<body>\n${html}\n<script>${js}<\/script>\n</body>\n</html>`
    if (onSave) onSave({ html, css, js, fullHtml })
  }

  async function handleExport() {
    if (!gjsRef.current) return
    const html = gjsRef.current.getHtml()
    const css = gjsRef.current.getCss()
    const js = gjsRef.current.getJs()

    localStorage.setItem('export_website', JSON.stringify({
      html, css, js,
      title: 'my-website'
    }))

    window.location.href = '/export'
  }

  const devices = ['Desktop', 'Tablet', 'Mobile']
  const panels = [
    { id: 'blocks', label: 'Blocks' },
    { id: 'styles', label: 'Style' },
    { id: 'layers', label: 'Layers' },
    { id: 'traits', label: 'Settings' },
  ]

  return (
    <div
      className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen w-full'}`}
      style={{ background: TOOLBAR_BG }}>

      {/* Top Toolbar */}
      <div
        className="flex items-center justify-between px-4 shrink-0 border-b"
        style={{ height: 52, background: TOOLBAR_BG, borderColor: BORDER }}>

        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">Creov</span>
          </div>
          <div className="w-px h-4" style={{ background: BORDER }} />
          <div className="flex items-center gap-0.5">
            <IconBtn onClick={undo} title="Undo"><UndoIcon /></IconBtn>
            <IconBtn onClick={redo} title="Redo"><RedoIcon /></IconBtn>
          </div>
        </div>

        {/* Center — Device Toggle */}
        <div
          className="flex items-center rounded-xl p-1 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
          {devices.map(d => (
            <button
              key={d}
              onClick={() => switchDevice(d)}
              title={d}
              className="flex items-center justify-center w-8 h-7 rounded-lg transition-all text-sm"
              style={
                activeDevice === d
                  ? { background: 'rgba(6,182,212,0.15)', color: CYAN }
                  : { color: TEXT_MUTED }
              }
              onMouseEnter={e => { if (activeDevice !== d) e.currentTarget.style.color = TEXT_SECONDARY }}
              onMouseLeave={e => { if (activeDevice !== d) e.currentTarget.style.color = TEXT_MUTED }}>
              {d === 'Desktop' ? <DesktopIcon /> : d === 'Tablet' ? <TabletIcon /> : <MobileIcon />}
            </button>
          ))}
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = TEXT_SECONDARY
              e.currentTarget.style.borderColor = BORDER
            }}>
            <EyeIcon /> Preview
          </button>

          <IconBtn onClick={() => setIsFullscreen(f => !f)} title="Fullscreen">
            {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </IconBtn>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = TEXT_SECONDARY
              e.currentTarget.style.borderColor = BORDER
            }}>
            <ExportIcon /> Export
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all text-white hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
              boxShadow: '0 0 16px rgba(6,182,212,0.3)'
            }}>
            <SaveIcon /> Save
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div
          className="flex flex-col shrink-0 border-r"
          style={{ width: 216, background: SIDEBAR_BG, borderColor: BORDER }}>

          {/* Panel Tabs */}
          <div
            className="flex shrink-0 border-b px-1 pt-1 gap-0.5"
            style={{ borderColor: BORDER }}>
            {panels.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                className="flex-1 py-2 text-[9px] font-bold tracking-widest uppercase rounded-t-lg transition-all"
                style={
                  activePanel === p.id
                    ? { background: CYAN_DIM, color: CYAN }
                    : { color: TEXT_MUTED }
                }
                onMouseEnter={e => { if (activePanel !== p.id) e.currentTarget.style.color = TEXT_SECONDARY }}
                onMouseLeave={e => { if (activePanel !== p.id) e.currentTarget.style.color = TEXT_MUTED }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div id="gjs-blocks" style={{ display: activePanel === 'blocks' ? 'block' : 'none' }} />
            <div id="gjs-styles" style={{ display: activePanel === 'styles' ? 'block' : 'none' }} />
            <div id="gjs-layers" style={{ display: activePanel === 'layers' ? 'block' : 'none', padding: '8px' }} />
            <div id="gjs-traits" style={{ display: activePanel === 'traits' ? 'block' : 'none' }} />
          </div>
        </div>

        {/* Canvas */}
        <div ref={editorRef} className="flex-1 min-h-0" />
      </div>
    </div>
  )
}

function IconBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
      style={{ color: TEXT_MUTED }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'white'
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = TEXT_MUTED
        e.currentTarget.style.background = 'transparent'
      }}>
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
const ExportIcon         = () => <svg {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>