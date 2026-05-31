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
  const [editingComponentInfo, setEditingComponentInfo] = useState(null)
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

  // ============================================
  // HTML SANITIZER
  // ============================================
  function sanitizeAiHtml(html) {
    if (!html) return ''
    
    return html
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?body[^>]*>/gi, '')
      .replace(/<\/?head[^>]*>/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
      .trim()
  }

  // ============================================
  // ENHANCE HTML WITH BETTER STYLES
  // ============================================
  function enhanceHtmlWithStyles(html, componentType) {
    if (!html) return html
    
    // If it's a section/hero without proper styling, add default modern styles
    if (componentType === 'section' || componentType === 'header' || html.includes('<section') || html.includes('<header')) {
      // Check if it has basic styling
      if (!html.includes('gradient') && !html.includes('box-shadow') && !html.includes('border-radius')) {
        // Add modern default styles
        html = html.replace(/<section/, '<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 40px; color: white; text-align: center; border-radius: 0; margin: 0;"')
        html = html.replace(/<h1/, '<h1 style="font-size: 3.5rem; margin-bottom: 20px; font-weight: 700;"')
        html = html.replace(/<p/, '<p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.95;"')
        
        // Add buttons if missing
        if (!html.includes('button')) {
          html = html.replace(/<\/section>/, `
  <div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;">
    <button style="padding: 14px 32px; background: white; color: #667eea; border: none; border-radius: 50px; font-weight: 600; cursor: pointer; transition: transform 0.2s;">Get Started</button>
    <button style="padding: 14px 32px; background: transparent; color: white; border: 2px solid white; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Learn More</button>
  </div>
</section>`)
        }
      }
    }
    
    // Add hover effect styles if missing
    if (!html.includes('hover')) {
      html = html.replace(/<button/g, '<button style="transition: all 0.3s ease;" onmouseover="this.style.transform=\'translateY(-2px)\'; this.style.boxShadow=\'0 10px 20px rgba(0,0,0,0.2)\';" onmouseout="this.style.transform=\'translateY(0)\'; this.style.boxShadow=\'none\';"')
    }
    
    return html
  }

  // ============================================
  // FIND BEST COMPONENT FOR EDITING
  // ============================================
  function getBestEditableComponent(selectedComponent) {
    if (!selectedComponent) return null
    
    // List of component types that should be edited at parent level
    const blockLevelTypes = ['navbar', 'nav', 'header', 'section', 'footer', 'hero', 'aside', 'main', 'article']
    
    let current = selectedComponent
    let best = selectedComponent
    
    // Traverse up to find the best parent for editing
    while (current) {
      const tagName = current.get('tagName')?.toLowerCase() || ''
      const type = current.get('type')?.toLowerCase() || ''
      const classes = current.get('classes').models.map(c => c.get('name').toLowerCase())
      
      // Check if this is a block-level element
      const isBlockLevel = blockLevelTypes.includes(tagName) || 
                           blockLevelTypes.includes(type) ||
                           classes.some(c => blockLevelTypes.includes(c))
      
      if (isBlockLevel) {
        best = current
        break // Found a good parent, stop going up
      }
      
      // If no block-level found, use parent if it exists and it's different
      const parent = current.parent()
      if (parent && parent !== current) {
        best = parent
        current = parent
      } else {
        break
      }
    }
    
    return best
  }

  //  injectCssIntoCanvas with proper error checking
  const injectCssIntoCanvas = useCallback((editor, css) => {
    if (!editor || !css) return
    
    // Wait for canvas to be ready
    setTimeout(() => {
      try {
        // Check if editor and canvas exist
        if (!editor.Canvas) {
          console.warn('Editor canvas not ready yet')
          return
        }
        
        const iframe = editor.Canvas.getFrameEl()
        if (iframe && iframe.contentDocument) {
          // Remove existing style to avoid duplicates
          const existing = iframe.contentDocument.getElementById('injected-body-styles')
          if (existing) existing.remove()
          
          // Create new style element
          const style = iframe.contentDocument.createElement('style')
          style.id = 'injected-body-styles'
          style.textContent = css
          iframe.contentDocument.head.appendChild(style)
          
          // Also ensure body has basic visibility
          if (iframe.contentDocument.body) {
            iframe.contentDocument.body.style.display = 'block'
            iframe.contentDocument.body.style.visibility = 'visible'
          }
          
          // Safely refresh canvas if method exists
          if (editor.refresh) editor.refresh()
          if (editor.getCanvas && editor.getCanvas().render) {
            editor.getCanvas().render()
          }
        }
      } catch (err) {
        console.error('Error injecting CSS:', err)
      }
    }, 300)
  }, [])

  // ============================================
  // SAFE COMPONENT REPLACER - FIXED VERSION
  // ============================================
 function safeReplaceComponent(component, newHtml) {
  try {
    if (!component || !newHtml) return false
    
    const cleanHtml = sanitizeAiHtml(newHtml)
    if (!cleanHtml) return false
    
    // Replace the component content
    component.components('')
    component.components(cleanHtml)
    
    // Simple refresh - this is all that's needed
    setTimeout(() => {
      if (gjsRef.current?.refresh) gjsRef.current.refresh()
    }, 50)
    
    return true
  } catch (err) {
    console.error('Failed to replace component:', err)
    return false
  }
}
  // Editor initialization effect
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
        avoidInlineStyle: false,
        fromElement: false,
        clearOnRender: false,
        domComponents: {
          draggableComponents: true,
          components: { wrapper: { droppable: true } }
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
          ]
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
        // Add default base styles to ensure visibility
        const defaultStyles = `
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            color: #1a1a1a;
            min-height: 100vh;
            line-height: 1.5;
          }
          * { 
            box-sizing: border-box; 
          }
          img { 
            max-width: 100%; 
            height: auto; 
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 0;
            margin-bottom: 0.5rem;
          }
          p {
            margin-top: 0;
            margin-bottom: 1rem;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
        `
        
        // Inject default styles first
        injectCssIntoCanvas(editor, defaultStyles)
        
        // Load initial HTML with modern hero section
        let htmlToLoad = initialHtml && initialHtml.trim() && initialHtml.length > 10
          ? initialHtml 
          : `<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 120px 40px; color: white; text-align: center; font-family: 'Inter', sans-serif;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 4rem; margin-bottom: 20px; font-weight: 800; animation: fadeInUp 0.6s ease-out;">Welcome to Aurora Bistro</h1>
    <p style="font-size: 1.3rem; margin-bottom: 30px; opacity: 0.95; line-height: 1.6;">Experience culinary excellence where passion meets plate. Savor exquisite flavors and unforgettable moments.</p>
    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
      <button style="padding: 14px 32px; background: white; color: #667eea; border: none; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;">View Our Menu</button>
      <button style="padding: 14px 32px; background: transparent; color: white; border: 2px solid white; border-radius: 50px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;">Reserve a Table</button>
    </div>
  </div>
</section>`
        
        // Set components
        editor.setComponents(htmlToLoad)
        
        // Set CSS if provided
        if (initialCss && initialCss.length > 0) {
          editor.setStyle(initialCss)
          injectCssIntoCanvas(editor, initialCss)
        }
        
        // Force canvas to render
        setTimeout(() => {
          if (editor.refresh) editor.refresh()
          if (editor.getCanvas && editor.getCanvas().render) {
            editor.getCanvas().render()
          }
        }, 300)

        const imageComponent = editor.DomComponents.getType('image')
        if (imageComponent) {
          imageComponent.model.prototype.defaults.draggable = true
          imageComponent.model.prototype.defaults.resizable = true
        }

        const bm = editor.BlockManager
        bm.getAll().reset()

        bm.add('navbar', {
          label: 'Navbar', category: 'Layout',
          content: `<nav style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000;">
  <div style="font-size: 1.5rem; font-weight: bold; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Aurora</div>
  <div style="display: flex; gap: 2rem;">
    <a href="#" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Home</a>
    <a href="#" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Menu</a>
    <a href="#" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">About</a>
    <a href="#" style="text-decoration: none; color: #333; font-weight: 500; transition: color 0.3s;">Contact</a>
  </div>
</nav>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
        })
        bm.add('hero', {
          label: 'Hero Section', category: 'Layout',
          content: `<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 120px 40px; color: white; text-align: center;">
  <div style="max-width: 800px; margin: 0 auto;">
    <h1 style="font-size: 3.5rem; margin-bottom: 20px; font-weight: 800;">Amazing Hero Title</h1>
    <p style="font-size: 1.2rem; margin-bottom: 30px;">Compelling description that captures attention</p>
    <button style="padding: 14px 32px; background: white; color: #667eea; border: none; border-radius: 50px; font-weight: 600; cursor: pointer;">Get Started</button>
  </div>
</section>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
        })
        bm.add('text', {
          label: 'Text', category: 'Basic',
          content: '<div style="padding: 10px; font-family: inherit;">Insert your text here</div>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 6.1H3M21 12.1H3M15.1 18H3"/></svg>`,
        })
        bm.add('heading', {
          label: 'Heading', category: 'Basic',
          content: '<h1 style="margin: 20px 0; font-family: inherit;">Heading Title</h1>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
        })
        bm.add('image', {
          label: 'Image', category: 'Media',
          content: { type: 'image', style: 'max-width: 100%; height: auto; border-radius: 12px;' },
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
        })
        bm.add('button', {
          label: 'Button', category: 'Basic',
          content: '<button style="padding: 12px 24px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Button</button>',
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
        })
        bm.add('columns-2', {
          label: '2 Cols', category: 'Layout',
          content: `<section style="padding:60px 20px;"><div style="display:flex; flex-wrap:wrap; gap:30px; max-width:1200px; margin:0 auto;"><div style="flex:1; min-width:250px; padding:30px; background:#f9f9f9; border-radius:16px;">Column 1</div><div style="flex:1; min-width:250px; padding:30px; background:#f9f9f9; border-radius:16px;">Column 2</div></div></section>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>`,
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
            { property: 'font-family', type: 'select', options: [{ value: 'Inter, sans-serif', name: 'Inter' }, { value: 'Arial, sans-serif', name: 'Arial' }, { value: 'Georgia, serif', name: 'Georgia' }] },
            { property: 'font-size', type: 'integer', units: ['px', 'em', 'rem'] },
            { property: 'font-weight', type: 'select', options: [{ value: '300', name: 'Light' }, { value: '400', name: 'Regular' }, { value: '600', name: 'Semi Bold' }, { value: '700', name: 'Bold' }, { value: '800', name: 'Extra Bold' }] },
          ],
        })
      })

      editor.on('device:change', () => {
        setTimeout(() => {
          const iframe = document.querySelector('.gjs-frame iframe')
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.dispatchEvent(new Event('resize'))
          }
          if (editor.refresh) editor.refresh()
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
              ed.addComponents(`<img src="${dataUrl}" style="max-width:100%; display:block; border-radius:12px;" />`)
            }
          })
        },
      })

      // ============================================
      // UPDATED COMPONENT SELECTION HANDLER
      // ============================================
      editor.on('component:selected', (component) => {
        // Find the best editable component (navbar, section, etc.)
        const editableComponent = getBestEditableComponent(component)
        setSelectedComponent(editableComponent)
        
        // Store info about what's being edited
        const tagName = editableComponent?.get('tagName')?.toLowerCase() || 'component'
        const classes = editableComponent?.get('classes')?.models?.map(c => c.get('name')) || []
        setEditingComponentInfo({ tagName, classes })
        
        console.log(`📝 Editing: <${tagName}>`, classes)
        
        // Visual feedback - briefly highlight the component being edited
        if (editableComponent && editableComponent !== component) {
          const originalOutline = editableComponent.getStyle()?.outline
          editableComponent.setStyle({ outline: '2px solid #8b5cf6', outlineOffset: '2px' })
          setTimeout(() => {
            if (editableComponent) {
              if (originalOutline) {
                editableComponent.setStyle({ outline: originalOutline })
              } else {
                const style = editableComponent.getStyle()
                delete style.outline
                delete style.outlineOffset
                editableComponent.setStyle(style)
              }
            }
          }, 1500)
        }

        // Image toolbar handling
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
        setEditingComponentInfo(null)
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
  }, [initialHtml, initialCss, injectCssIntoCanvas])

  // Separate effect to update content when props change
  useEffect(() => {
    if (!gjsRef.current) return
    
    const updateContent = () => {
      const editor = gjsRef.current
      if (!editor) return
      
      if (initialHtml && initialHtml.trim() && initialHtml.length > 10) {
        editor.setComponents(initialHtml)
      }
      if (initialCss && initialCss.length > 0) {
        editor.setStyle(initialCss)
        injectCssIntoCanvas(editor, initialCss)
      }
      setTimeout(() => {
        if (editor.refresh) editor.refresh()
        if (editor.getCanvas && editor.getCanvas().render) {
          editor.getCanvas().render()
        }
      }, 200)
    }
    
    const timer = setTimeout(updateContent, 500)
    return () => clearTimeout(timer)
  }, [initialHtml, initialCss, injectCssIntoCanvas])

  // Force canvas visibility after mount
  useEffect(() => {
    if (!gjsRef.current) return
    
    const forceCanvasVisibility = () => {
      const editor = gjsRef.current
      if (!editor) return
      
      try {
        if (!editor.Canvas) return
        
        const frame = editor.Canvas.getFrameEl()
        if (frame && frame.contentDocument) {
          const body = frame.contentDocument.body
          if (body) {
            body.style.outline = 'none'
            body.style.border = 'none'
            body.style.display = 'block'
            body.style.visibility = 'visible'
            
            const allElements = body.querySelectorAll('*')
            allElements.forEach(el => {
              if (el.style.outline === '1px dashed red' || 
                  el.style.outline === '1px dashed blue' ||
                  el.style.outline === '1px dashed green') {
                el.style.outline = 'none'
              }
            })
          }
          
          if (editor.refresh) editor.refresh()
          if (editor.getCanvas && editor.getCanvas().render) {
            editor.getCanvas().render()
          }
        }
      } catch (err) {
        console.error('Error forcing canvas visibility:', err)
      }
    }
    
    const timer = setTimeout(forceCanvasVisibility, 1000)
    return () => clearTimeout(timer)
  }, [])

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
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css}</style></head><body>${html}</body></html>`)
    win.document.close()
  }

  function handleSave() {
    if (!gjsRef.current) return
    const html = gjsRef.current.getHtml()
    const css = gjsRef.current.getCss()
    const js = gjsRef.current.getJs()
    const fullHtml = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<style>${css}</style>\n</head>\n<body>\n${html}\n<script>${js}<\/script>\n</body>\n</html>`
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

  // Version History Functions
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
      
      setTimeout(() => {
        if (gjsRef.current) {
          if (gjsRef.current.refresh) gjsRef.current.refresh()
          if (gjsRef.current.getCanvas && gjsRef.current.getCanvas().render) {
            gjsRef.current.getCanvas().render()
          }
        }
      }, 100)
      
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
    if (!component) return {}
    return {
      tag: component.get('tagName') || 'div',
      classes: component.get('classes').models.map(c => c.get('name')),
      attributes: component.getAttributes(),
      content: component.get('content'),
      style: component.getStyle(),
      type: component.get('type')
    }
  }

  function showPreviewModal(newHtml) {
    setPreviewHtml(newHtml)
    setShowPreview(true)
  }

  function applyPreview() {
    if (previewHtml && selectedComponent) {
      const cleanHtml = sanitizeAiHtml(previewHtml)
      const componentType = selectedComponent.get('tagName')?.toLowerCase() || 'section'
      const enhancedHtml = enhanceHtmlWithStyles(cleanHtml, componentType)
      
      // Log for debugging
      console.log('Applying redesign to:', selectedComponent.get('tagName'))
      console.log('HTML length:', enhancedHtml.length)
      
      const success = safeReplaceComponent(selectedComponent, enhancedHtml)
      
      if (success) {
        setShowPreview(false)
        setPreviewHtml(null)
        
        // Show success feedback
        const flash = document.createElement('div')
        flash.textContent = '✅ Redesign applied successfully!'
        flash.style.cssText = `
          position: fixed; bottom: 20px; right: 20px;
          background: #10b981; color: white; padding: 8px 16px;
          border-radius: 8px; z-index: 10001; font-size: 14px;
          animation: fadeInOut 2s ease;
        `
        document.body.appendChild(flash)
        setTimeout(() => flash.remove(), 2000)
      } else {
        console.error('Failed to apply redesign')
        const flash = document.createElement('div')
        flash.textContent = '❌ Failed to apply redesign. Check console for errors.'
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
      const componentHtml = selectedComponent.toHTML()
      const componentTag = selectedComponent.get('tagName')?.toLowerCase() || 'div'
      const componentClasses = selectedComponent.get('classes').models.map(c => c.get('name')).join(' ')
      
      // Enhanced powerful prompt for complete redesign
      const refinementPrompt = `
You are a senior UI/UX designer. Transform the HTML/CSS of this component COMPLETELY.

## CURRENT COMPONENT:
${componentHtml}

## USER REQUEST:
${messageToSend}

## CRITICAL RULES - FOLLOW STRICTLY:

1. **RETURN COMPLETE NEW HTML** - Don't just change text, redesign the ENTIRE component
2. **INCLUDE FULL INLINE STYLES** - Every element must have proper styling
3. **MODERN DESIGN ELEMENTS REQUIRED**:
   - Use gradient backgrounds (linear-gradient or radial-gradient)
   - Add border-radius (12px-24px for cards/buttons)
   - Include box-shadow for depth
   - Add transition effects on hover
   - Use proper spacing (padding/margin in rem or px)
   - Modern typography (font weights 600-800 for headings)
   - Add subtle animations (fadeInUp, slideIn)

4. **FOR HERO SECTIONS (headers/hero)**:
   - Full width gradient background (e.g., #667eea to #764ba2, or #f093fb to #f5576c)
   - Large heading (3rem - 5rem) with bold font-weight
   - Descriptive subheading (1.2rem - 1.5rem)
   - Two buttons: primary (solid white/colored) and secondary (outline)
   - Add floating elements or decorative shapes for visual interest
   - Text alignment centered or left based on design

5. **FOR NAVBARS**:
   - Sticky position with backdrop blur (backdrop-filter: blur(10px))
   - Logo with gradient text
   - Navigation links with hover effects
   - Mobile responsive design
   - Smooth shadow on scroll

6. **COLOR SCHEMES TO USE**:
   - Modern: Indigo/Purple (#667eea, #764ba2)
   - Corporate: Blue/Cyan (#3b82f6, #06b6d4)
   - Luxury: Gold/Dark (#d4af37, #1a1a1a)
   - Vibrant: Pink/Orange (#f43f5e, #f97316)
   - Nature: Emerald/Teal (#10b981, #14b8a6)

7. **RESPONSIVE DESIGN** - Use flexbox or grid, ensure mobile-friendly

8. **OUTPUT ONLY THE RAW HTML** - No explanations, no markdown, no backticks

9. **PRESERVE SEMANTIC HTML** - Keep appropriate tags (<section>, <header>, <nav>)

10. **replace previous sections** - when replacing replace the entire previous section with the new one don't just add to it and make sure to cover the entire space of previous section 

Return ONLY the redesigned HTML now:`.trim()

      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId,
          userId,
          refinement: refinementPrompt,
          sectionHtml: componentHtml,
        })
      })

      const data = await response.json()

      if (data.html && typeof data.html === 'string' && data.html.includes('<')) {
        let cleanHtml = sanitizeAiHtml(data.html)
        
        // Enhance with better styles based on component type
        const componentType = selectedComponent.get('tagName')?.toLowerCase() || 
                              selectedComponent.get('type')?.toLowerCase() || 'section'
        cleanHtml = enhanceHtmlWithStyles(cleanHtml, componentType)
        
        showPreviewModal(cleanHtml)
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✨ I've **completely redesigned** your ${componentTag} with modern styles, gradients, and hover effects! Click "Apply" to see the transformation.`
        }])

        const flash = document.createElement('div')
        flash.textContent = '✨ Complete redesign ready! Preview it before applying.'
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
          content: `❌ Invalid response. Please try again with a clearer request.`
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
    { icon: '🌈', label: 'Modern Hero', prompt: 'Completely redesign this as a stunning modern hero section with gradient background, large bold heading, descriptive subheading, two CTA buttons, and floating decorative elements. Use modern colors and smooth animations.' },
    { icon: '✨', label: 'Glassmorphism', prompt: 'Apply glassmorphism style: semi-transparent background with backdrop blur (10px), subtle white border, rounded corners (20px), and modern shadow effects. Make it look like frosted glass.' },
    { icon: '🎨', label: 'Premium Luxury', prompt: 'Redesign with luxury aesthetics: gold/dark color scheme, serif fonts for headings, elegant spacing, subtle patterns or gradients, and sophisticated animations.' },
    { icon: '🚀', label: 'Startup Modern', prompt: 'Modern startup style: clean gradients, large sans-serif fonts (800 weight), rounded corners, floating cards, and micro-interactions. Make it bold and energetic.' },
    { icon: '💎', label: 'Neumorphism', prompt: 'Apply neumorphism design: soft shadows, matching background colors, subtle inset/outset effects, and clean minimalist typography.' },
    { icon: '🎯', label: 'Bold & Vibrant', prompt: 'Create a bold, vibrant design with eye-catching gradient colors, large typography, dramatic shadows, and energetic hover animations. Make it stand out.' },
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
                          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
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
          <div className="rounded-xl w-[900px] max-w-[90vw] max-h-[80vh] overflow-hidden" style={{ background: '#0f172a' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
              <h3 className="text-white font-semibold">Preview Redesigned Component</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-auto" style={{ background: '#f5f5f5' }}>
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
                className="px-4 py-2 rounded-lg text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Apply Redesign
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
            <SparkleIcon /> AI Redesign
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
          style={{ width: 240, background: SIDEBAR_BG, borderColor: BORDER }}>
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

        {/* Version History Sidebar */}
        {showVersionHistory && !isChatOpen && (
          <div
            className="flex flex-col shrink-0 border-l"
            style={{ width: 380, background: '#0f172a', borderColor: BORDER }}>
            
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
                    
                    <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: BORDER }}>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{version.name}</h4>
                        <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>
                          {formatDate(version.timestamp)}
                        </p>
                      </div>
                      
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
                                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

        {/* AI Redesign Sidebar */}
        {isChatOpen && !showVersionHistory && (
          <div
            className="flex flex-col shrink-0 border-l"
            style={{ width: 400, background: '#0f172a', borderColor: BORDER }}>

            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                  <SparkleIcon size={14} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">AI Redesign Studio</h3>
                  <p className="text-xs" style={{ color: TEXT_MUTED }}>
                    {selectedComponent
                      ? `Redesigning: ${selectedComponent.get('tagName')?.toLowerCase() || 'component'}`
                      : 'Select a component to redesign'}
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

            {/* Component Info Panel */}
            {selectedComponent && editingComponentInfo && (
              <div className="m-3 p-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.1)', border: `1px solid rgba(139,92,246,0.2)` }}>
                <p className="text-xs" style={{ color: '#a78bfa' }}>
                  🎯 Currently Editing: <strong>&lt;{editingComponentInfo.tagName}&gt;</strong>
                  {editingComponentInfo.classes.length > 0 && (
                    <span className="ml-1 opacity-70">
                      ({editingComponentInfo.classes.join(', ')})
                    </span>
                  )}
                </p>
                <p className="text-xs mt-2" style={{ color: TEXT_MUTED }}>
                  💡 Tip: Click on any navbar, header, or section to redesign the entire component
                </p>
              </div>
            )}

            {selectedComponent && messages.length === 0 && (
              <div className="p-3 border-b" style={{ borderColor: BORDER }}>
                <p className="text-xs mb-2" style={{ color: TEXT_MUTED }}>🚀 Quick Redesign Styles:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(action.prompt)}
                      disabled={isRefining}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={{
                        background: 'rgba(139,92,246,0.15)',
                        color: '#c4b5fd',
                        border: '1px solid rgba(139,92,246,0.3)',
                        opacity: isRefining ? 0.5 : 1
                      }}
                      onMouseEnter={e => { if (!isRefining) e.currentTarget.style.background = 'rgba(139,92,246,0.25)' }}
                      onMouseLeave={e => { if (!isRefining) e.currentTarget.style.background = 'rgba(139,92,246,0.15)' }}>
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
                    <SparkleIcon size={32} />
                  </div>
                  <p className="text-white font-semibold mb-2">AI Component Redesign</p>
                  <p className="text-xs" style={{ color: TEXT_MUTED }}>
                    {selectedComponent
                      ? 'Choose a style above or type your custom request!\nTry: "Make it elegant with gold accents"'
                      : 'Click on any navbar, header, or section to start redesigning'}
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

            <div className="p-4 border-t" style={{ borderColor: BORDER }}>
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={selectedComponent ? 'Describe your redesign vision...' : 'Select a component first...'}
                  disabled={!selectedComponent || isRefining}
                  rows={2}
                  className="flex-1 rounded-lg p-2 text-sm resize-none"
                  style={{
                    background: '#111827',
                    border: `1px solid ${BORDER}`,
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'inherit'
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
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-bounce {
          animation: bounce 0.8s infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
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