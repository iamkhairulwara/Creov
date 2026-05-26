'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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

export default function GrapesEditor({
  initialHtml = '',
  initialCss = '',
  onSave,
  websiteId,
  userId
}) {
  const editorRef = useRef(null)
  const gjsRef = useRef(null)
  const chatEndRef = useRef(null)
  const isEditorReady = useRef(false)
  
  const messagesRef = useRef([])
  const isRequestingRef = useRef(false)

  const [activeDevice, setActiveDevice] = useState('Desktop')
  const [activePanel, setActivePanel] = useState('blocks')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isRefining, setIsRefining] = useState(false)
  const [previewHtml, setPreviewHtml] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  // Version History State
  const [versions, setVersions] = useState([])
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [selectedVersionForPreview, setSelectedVersionForPreview] = useState(null)
  const [versionName, setVersionName] = useState('')
  const [showSaveVersionModal, setShowSaveVersionModal] = useState(false)

  // Load versions from localStorage on mount
  useEffect(() => {
    if (websiteId) {
      const savedVersions = localStorage.getItem(`versions_${websiteId}`)
      if (savedVersions) {
        try {
          const parsed = JSON.parse(savedVersions)
          setVersions(parsed)
        } catch (e) {
          console.error('Failed to parse versions:', e)
        }
      }
    }
  }, [websiteId])

  // Save versions to localStorage whenever they change
  useEffect(() => {
    if (websiteId && versions.length > 0) {
      localStorage.setItem(`versions_${websiteId}`, JSON.stringify(versions))
    }
  }, [versions, websiteId])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isEditorReady.current) return
    isEditorReady.current = true

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
          components: { wrapper: { droppable: true } }
        },
        canvas: { styles: ['/grapes-theme.css'] },
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
          content: `<section style="padding:20px; width:100%;"><div style="display:flex; flex-wrap:wrap; gap:20px;"><div style="flex:1 1 300px; min-height:100px; padding:20px; background:#f9f9f9;">Column 1</div><div style="flex:1 1 300px; min-height:100px; padding:20px; background:#f9f9f9;">Column 2</div></div></section>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>`,
        })
        bm.add('columns-3', {
          label: '3 Cols', category: 'Layout',
          content: `<section style="padding:20px; width:100%;"><div style="display:flex; flex-wrap:wrap; gap:20px;"><div style="flex:1 1 250px; min-height:100px; padding:20px; background:#f9f9f9;">Col 1</div><div style="flex:1 1 250px; min-height:100px; padding:20px; background:#f9f9f9;">Col 2</div><div style="flex:1 1 250px; min-height:100px; padding:20px; background:#f9f9f9;">Col 3</div></div></section>`,
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

        if (initialHtml && initialHtml.length > 0) {
          editor.setComponents(initialHtml)
        }
        if (initialCss && initialCss.length > 0) {
          editor.setStyle(initialCss)
          injectCssIntoCanvas(editor, initialCss)
        }
      })

      editor.on('device:change', () => {
        setTimeout(() => {
          const iframe = document.querySelector('.gjs-frame iframe')
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.dispatchEvent(new Event('resize'))
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
        setSelectedComponent(component)

        if (component?.get('type') !== 'image') return
        const toolbar = component.get('toolbar') || []
        if (!toolbar.find(t => t.command === 'upload-image')) {
          toolbar.unshift({
            attributes: { title: 'Change image' },
            command: 'upload-image',
            label: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
          })
          component.set('toolbar', toolbar)
        }
      })

      editor.on('component:deselected', () => {
        setSelectedComponent(null)
      })

      gjsRef.current = editor
    }

    initEditor()

    return () => {
      isEditorReady.current = false
      if (gjsRef.current) {
        gjsRef.current.destroy()
        gjsRef.current = null
      }
    }
  }, [])

  function injectCssIntoCanvas(editor, css) {
    setTimeout(() => {
      const iframe = editor.Canvas.getFrameEl()
      if (iframe && iframe.contentDocument) {
        const existing = iframe.contentDocument.getElementById('injected-body-styles')
        if (existing) existing.remove()
        const style = iframe.contentDocument.createElement('style')
        style.id = 'injected-body-styles'
        style.textContent = css
        iframe.contentDocument.head.appendChild(style)
      }
    }, 300)
  }

  const isMounted = useRef(false)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    if (!gjsRef.current) return
    if (initialHtml && initialHtml.length > 0) {
      gjsRef.current.setComponents(initialHtml)
    }
    if (initialCss && initialCss.length > 0) {
      gjsRef.current.setStyle(initialCss)
      injectCssIntoCanvas(gjsRef.current, initialCss)
    }
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
    localStorage.setItem('export_website', JSON.stringify({ html, css, js, title: 'my-website' }))
    window.location.href = '/export'
  }

  // ============ VERSION HISTORY FUNCTIONS ============
  
  function saveCurrentVersion() {
    if (!gjsRef.current) {
      alert('Editor not ready')
      return
    }
    
    const html = gjsRef.current.getHtml()
    const css = gjsRef.current.getCss()
    const js = gjsRef.current.getJs()
    
    if (!html || html.length < 10) {
      alert('No content to save. Please add some elements to your page first.')
      return
    }
    
    const newVersion = {
      id: Date.now(),
      name: versionName.trim() || `Version ${versions.length + 1}`,
      timestamp: new Date().toISOString(),
      html: html,
      css: css || '',
      js: js || '',
    }
    
    setVersions(prev => [newVersion, ...prev].slice(0, 50))
    setVersionName('')
    setShowSaveVersionModal(false)
    
    const flash = document.createElement('div')
    flash.textContent = `💾 "${newVersion.name}" saved (${Math.round(html.length / 1024)} KB)`
    flash.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: #10b981; color: white; padding: 8px 16px;
      border-radius: 8px; z-index: 10001; font-size: 14px;
      animation: fadeInOut 2s ease;
    `
    document.body.appendChild(flash)
    setTimeout(() => flash.remove(), 2000)
  }
  
  function openVersionPreview(version) {
    if (!version.html || version.html.length < 10) {
      alert('This version has no content to preview')
      return
    }
    setSelectedVersionForPreview(version)
  }
  
  function closeVersionPreview() {
    setSelectedVersionForPreview(null)
  }
  
  function restoreVersion(version) {
    if (!gjsRef.current) return
    
    if (confirm(`Restore "${version.name}"? Current changes will be lost.`)) {
      gjsRef.current.setComponents(version.html)
      if (version.css) gjsRef.current.setStyle(version.css)
      if (version.js) gjsRef.current.setJs(version.js)
      
      setSelectedVersionForPreview(null)
      setShowVersionHistory(false)
      
      const flash = document.createElement('div')
      flash.textContent = `↩️ Restored "${version.name}"`
      flash.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #8b5cf6; color: white; padding: 8px 16px;
        border-radius: 8px; z-index: 10001; font-size: 14px;
        animation: fadeInOut 2s ease;
      `
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 2000)
    }
  }
  
  function deleteVersion(versionId, versionName) {
    if (confirm(`Delete "${versionName}"? This cannot be undone.`)) {
      setVersions(prev => prev.filter(v => v.id !== versionId))
      
      const flash = document.createElement('div')
      flash.textContent = `🗑️ Deleted "${versionName}"`
      flash.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #ef4444; color: white; padding: 8px 16px;
        border-radius: 8px; z-index: 10001; font-size: 14px;
        animation: fadeInOut 2s ease;
      `
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 2000)
    }
  }
  
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString()
  }

  function getStructuredComponentData(component) {
    return {
      tag: component.get('tagName') || 'div',
      classes: component.get('classes').models.map(c => c.get('name')),
      attributes: component.getAttributes(),
      content: component.get('content'),
      style: component.getStyle(),
      type: component.get('type')
    }
  }

  function safeReplaceComponent(component, newHtml) {
    try {
      component.set('content', newHtml)
      return true
    } catch (err) {
      console.error('Failed to replace component:', err)
      return false
    }
  }

  function showPreviewModal(newHtml) {
    setPreviewHtml(newHtml)
    setShowPreview(true)
  }

  function applyPreview() {
    if (previewHtml && selectedComponent) {
      safeReplaceComponent(selectedComponent, previewHtml)
      setShowPreview(false)
      setPreviewHtml(null)
    }
  }

  const sendMessage = useCallback(async (overrideMessage) => {
    if (isRequestingRef.current) return
    if (!selectedComponent) return
    
    const messageToSend = overrideMessage || inputMessage.trim()
    if (!messageToSend) return

    isRequestingRef.current = true
    if (!overrideMessage) setInputMessage('')
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }])
    setIsRefining(true)

    try {
      const conversationHistory = messagesRef.current
        .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n\n')

      const componentData = getStructuredComponentData(selectedComponent)
      
      const refinementPrompt = `
You are a professional UI designer.

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}
Current request: ${messageToSend}

Current component:
- Type: ${componentData.type}
- Tag: ${componentData.tag}
- Classes: ${componentData.classes.join(', ')}
- Content: ${componentData.content}

STRICT RULES:
- Return ONLY valid HTML for this section
- Preserve existing structure unless improvement is required
- Do NOT remove essential classes or layout containers
- Ensure responsive design (mobile-first)
- Use clean semantic HTML
- Do NOT include full page wrapper, only section content
- NO markdown, NO backticks, NO explanations

Return ONLY the raw HTML.`.trim()

      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          userId,
          refinement: refinementPrompt,
          sectionHtml: selectedComponent.toHTML(),
        })
      })

      const data = await response.json()

      if (data.html && typeof data.html === 'string' && data.html.includes('<')) {
        showPreviewModal(data.html)

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✨ I've prepared the changes. Click "Apply" to see them, or "Reject" to cancel.`
        }])

        const flash = document.createElement('div')
        flash.textContent = '✨ Changes ready! Review them first.'
        flash.style.cssText = `
          position: fixed; bottom: 20px; right: 20px;
          background: #8b5cf6; color: white; padding: 8px 16px;
          border-radius: 8px; z-index: 10001; font-size: 14px;
          animation: fadeInOut 2s ease;
        `
        document.body.appendChild(flash)
        setTimeout(() => flash.remove(), 2000)

      } else if (data.error) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `❌ Error: ${data.error}`
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `❌ Invalid response from AI. Please try again.`
        }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed: ${err.message}`
      }])
    } finally {
      isRequestingRef.current = false
      setIsRefining(false)
    }
  }, [selectedComponent, inputMessage, websiteId, userId])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { icon: '🎨', label: 'Make modern', prompt: 'Make this section more modern and visually appealing with clean design and subtle shadows' },
    { icon: '📱', label: 'Mobile friendly', prompt: 'Make this section fully responsive and mobile-friendly with proper spacing' },
    { icon: '🎯', label: 'Add CTA', prompt: 'Add a compelling call-to-action button that stands out' },
    { icon: '✨', label: 'Improve design', prompt: 'Improve the typography, spacing, and overall visual design' },
    { icon: '🌙', label: 'Dark mode', prompt: 'Convert this section to a modern dark mode color scheme' },
    { icon: '⚡', label: 'Better layout', prompt: 'Improve the layout and alignment of all elements' },
  ]

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

      {/* Save Version Modal */}
      {showSaveVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-xl w-[400px] overflow-hidden" style={{ background: '#0f172a' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-white font-semibold">Save Version</h3>
              <button onClick={() => setShowSaveVersionModal(false)} className="text-gray-400 hover:text-white">
                <CloseIcon />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="Version name (required)"
                className="w-full rounded-lg p-2 text-sm"
                style={{
                  background: '#111827',
                  border: `1px solid ${BORDER}`,
                  color: 'white',
                  outline: 'none'
                }}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2">Give your version a descriptive name</p>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: BORDER }}>
              <button
                onClick={() => setShowSaveVersionModal(false)}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: '#374151' }}>
                Cancel
              </button>
              <button
                onClick={saveCurrentVersion}
                disabled={!versionName.trim()}
                className="px-4 py-2 rounded-lg text-white"
                style={{
                  background: versionName.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : '#374151',
                  opacity: versionName.trim() ? 1 : 0.5
                }}>
                Save Version
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Preview Modal */}
      {selectedVersionForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.95)' }}>
          <div className="rounded-xl w-[95vw] max-w-[1400px] h-[90vh] overflow-hidden flex flex-col" style={{ background: '#0f172a' }}>
            <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ borderColor: BORDER }}>
              <div>
                <h3 className="text-white font-semibold text-lg">{selectedVersionForPreview.name}</h3>
                <p className="text-xs text-gray-400">{formatDate(selectedVersionForPreview.timestamp)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => restoreVersion(selectedVersionForPreview)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <RestoreIcon /> Restore This Version
                </button>
                <button
                  onClick={closeVersionPreview}
                  className="px-4 py-2 rounded-lg text-white transition-all hover:bg-gray-600"
                  style={{ background: '#374151' }}>
                  Close
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div className="w-full min-h-full rounded-lg overflow-hidden shadow-2xl" style={{ background: '#ffffff' }}>
                <iframe
                  title="Version Preview"
                  className="w-full min-h-[calc(90vh-120px)] border-0"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          * { margin: 0; padding: 0; box-sizing: border-box; }
                          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; padding: 20px; }
                          ${selectedVersionForPreview.css || ''}
                        </style>
                      </head>
                      <body>
                        ${selectedVersionForPreview.html || '<div style="padding: 40px; text-align: center; color: #666;">No content to preview</div>'}
                      </body>
                    </html>
                  `}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal for AI Changes */}
      {showPreview && previewHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-xl w-[800px] max-w-[90vw] max-h-[80vh] overflow-hidden" style={{ background: '#0f172a' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-white font-semibold">Preview Changes</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
            <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: BORDER }}>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: '#374151' }}>
                Reject
              </button>
              <button
                onClick={applyPreview}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div
        className="flex items-center justify-between px-4 shrink-0 border-b"
        style={{ height: 52, background: TOOLBAR_BG, borderColor: BORDER }}>

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

        <div
          className="flex items-center rounded-xl p-1 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
          {devices.map(d => (
            <button
              key={d}
              onClick={() => switchDevice(d)}
              title={d}
              className="flex items-center justify-center w-8 h-7 rounded-lg transition-all text-sm"
              style={activeDevice === d
                ? { background: CYAN_DIM, color: CYAN }
                : { color: TEXT_MUTED }}>
              {d === 'Desktop' ? <DesktopIcon /> : d === 'Tablet' ? <TabletIcon /> : <MobileIcon />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVersionHistory(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
            <HistoryIcon /> History ({versions.length})
          </button>

          <button
            onClick={() => setShowSaveVersionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
            <SaveVersionIcon /> Save Version
          </button>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{
              background: isChatOpen ? 'rgba(139,92,246,0.2)' : 'transparent',
              color: isChatOpen ? '#a78bfa' : TEXT_SECONDARY,
              border: `1px solid ${isChatOpen ? '#8b5cf6' : BORDER}`
            }}>
            <SparkleIcon /> Refinement
            {selectedComponent && !isChatOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
            <EyeIcon /> Preview
          </button>

          <IconBtn onClick={() => setIsFullscreen(f => !f)} title="Fullscreen">
            {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </IconBtn>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
            <ExportIcon /> Export
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all text-white hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', boxShadow: '0 0 16px rgba(6,182,212,0.3)' }}>
            <SaveIcon /> Save
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar */}
        <div
          className="flex flex-col shrink-0 border-r"
          style={{ width: 216, background: SIDEBAR_BG, borderColor: BORDER }}>
          <div
            className="flex shrink-0 border-b px-1 pt-1 gap-0.5"
            style={{ borderColor: BORDER }}>
            {panels.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePanel(p.id)}
                className="flex-1 py-2 text-[9px] font-bold tracking-widest uppercase rounded-t-lg transition-all"
                style={activePanel === p.id
                  ? { background: CYAN_DIM, color: CYAN }
                  : { color: TEXT_MUTED }}>
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

        {/* Canvas */}
        <div ref={editorRef} className="flex-1 min-h-0" />

        {/* Version History Sidebar - PROFESSIONAL VERSION (no raw HTML) */}
        {showVersionHistory && !isChatOpen && (
          <div
            className="flex flex-col shrink-0 border-l"
            style={{ width: 380, background: '#0f172a', borderColor: BORDER }}>
            
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: BORDER }}>
              <div>
                <h3 className="text-white font-semibold text-sm">Version History</h3>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>
                  {versions.length} {versions.length === 1 ? 'version' : 'versions'} saved
                </p>
              </div>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="p-1 rounded-lg transition-all"
                style={{ color: TEXT_MUTED }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}>
                <CloseIcon />
              </button>
            </div>

            {/* Versions List - Professional design with visual preview */}
            <div className="flex-1 overflow-y-auto p-3">
              {versions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                    <HistoryIcon size={24} />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">No versions yet</p>
                  <p className="text-xs text-center" style={{ color: TEXT_MUTED }}>
                    Click "Save Version" to save<br />your first snapshot
                  </p>
                </div>
              ) : (
                versions.map((version) => (
                  <div
                    key={version.id}
                    className="mb-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg overflow-hidden"
                    style={{ 
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${BORDER}`
                    }}
                    onClick={() => openVersionPreview(version)}>
                    
                    {/* Version Header */}
                    <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: BORDER }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          
                          <h4 className="text-white font-medium text-sm">{version.name}</h4>
                        </div>
                        <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
                          {formatDate(version.timestamp)}
                        </p>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteVersion(version.id, version.name)
                        }}
                        className="p-1.5 rounded transition-all opacity-50 hover:opacity-100 hover:bg-red-500/20"
                        style={{ color: '#ef4444' }}>
                        <DeleteIcon />
                      </button>
                    </div>
                    
                    {/* Visual Preview - Mini iframe preview (no raw code) */}
                    <div className="p-2 bg-gray-900/50">
                      <div className="rounded overflow-hidden" style={{ background: '#fff', height: '80px' }}>
                        <iframe
                          title={`Preview of ${version.name}`}
                          className="w-full h-full border-0 pointer-events-none"
                          sandbox="allow-same-origin"
                          srcDoc={`
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  * { margin: 0; padding: 0; box-sizing: border-box; }
                                  body { 
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                    font-size: 10px;
                                    padding: 8px;
                                    transform: scale(0.8);
                                    transform-origin: top left;
                                    width: 125%;
                                    height: 125%;
                                    overflow: hidden;
                                  }
                                  img { max-width: 100%; height: auto; }
                                  ${version.css || ''}
                                </style>
                              </head>
                              <body style="margin: 0;">
                                ${version.html ? version.html.substring(0, 500) : '<div style="padding: 20px; text-align: center;">Preview not available</div>'}
                              </body>
                            </html>
                          `}
                        />
                      </div>
                    </div>
                    
                    {/* Preview Hint */}
                    <div className="p-2 text-center border-t" style={{ borderColor: BORDER }}>
                      <span className="text-xs" style={{ color: '#a78bfa' }}>
                         Click to preview full version
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* AI Refinement Sidebar */}
        {isChatOpen && !showVersionHistory && (
          <div
            className="flex flex-col shrink-0 border-l"
            style={{ width: 380, background: '#0f172a', borderColor: BORDER }}>

            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                  <SparkleIcon size={14} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Refinement</h3>
                  <p className="text-xs" style={{ color: TEXT_MUTED }}>
                    {selectedComponent
                      ? `Editing: ${selectedComponent.get('type') || 'component'}`
                      : 'Select a component to start'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg transition-all"
                style={{ color: TEXT_MUTED }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}>
                <CloseIcon />
              </button>
            </div>

            {/* Quick Actions */}
            {selectedComponent && messages.length === 0 && (
              <div className="p-3 border-b" style={{ borderColor: BORDER }}>
                <p className="text-xs mb-2" style={{ color: TEXT_MUTED }}>Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.prompt)}
                      disabled={isRefining}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all"
                      style={{
                        background: 'rgba(139,92,246,0.1)',
                        color: '#a78bfa',
                        border: '1px solid rgba(139,92,246,0.2)',
                        opacity: isRefining ? 0.5 : 1
                      }}
                      onMouseEnter={e => { if (!isRefining) e.currentTarget.style.background = 'rgba(139,92,246,0.2)' }}
                      onMouseLeave={e => { if (!isRefining) e.currentTarget.style.background = 'rgba(139,92,246,0.1)' }}>
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                    <SparkleIcon size={24} />
                  </div>
                  <p className="text-sm font-medium text-white mb-1">AI Design Assistant</p>
                  <p className="text-xs" style={{ color: TEXT_MUTED }}>
                    {selectedComponent
                      ? 'Ask me to refine this component!'
                      : 'Select any component on the canvas to start refining'}
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] rounded-lg p-3"
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white' }
                          : { background: 'rgba(255,255,255,0.05)', color: TEXT_SECONDARY }
                      }>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isRefining && (
                <div className="flex justify-start">
                  <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: BORDER }}>
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={selectedComponent ? 'Describe how to refine this section...' : 'Select a component first...'}
                  disabled={!selectedComponent || isRefining}
                  rows={2}
                  className="flex-1 rounded-lg p-2 text-sm resize-none"
                  style={{
                    background: '#111827',
                    border: `1px solid ${BORDER}`,
                    color: 'white',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || !selectedComponent || isRefining}
                  className="px-4 rounded-lg transition-all flex items-center justify-center"
                  style={{
                    background: inputMessage.trim() && selectedComponent && !isRefining
                      ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                      : '#374151',
                    opacity: inputMessage.trim() && selectedComponent && !isRefining ? 1 : 0.5,
                    cursor: inputMessage.trim() && selectedComponent && !isRefining ? 'pointer' : 'not-allowed'
                  }}>
                  <SendIcon />
                </button>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: TEXT_MUTED }}>
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
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
      onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.color = TEXT_MUTED; e.currentTarget.style.background = 'transparent' }}>
      {children}
    </button>
  )
}

const s = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
const UndoIcon = () => <svg {...s}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
const RedoIcon = () => <svg {...s}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
const DesktopIcon = () => <svg {...s}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
const TabletIcon = () => <svg {...s}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const MobileIcon = () => <svg {...s}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const FullscreenIcon = () => <svg {...s}><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M16 21h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
const ExitFullscreenIcon = () => <svg {...s}><path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3"/></svg>
const EyeIcon = () => <svg {...s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const SaveIcon = () => <svg {...s}><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const ExportIcon = () => <svg {...s}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>

function SparkleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L14 9H21L15.5 13.5L18 21L12 16.5L6 21L8.5 13.5L3 9H10L12 2Z" fill="currentColor"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function HistoryIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M12 6v2M12 12v2"/>
    </svg>
  )
}

function SaveVersionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
      <path d="M12 3v5"/>
    </svg>
  )
}

function RestoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18"/>
      <path d="M6 6l12 12"/>
    </svg>
  )
}