'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import './grapes-theme.css'
import CreovLogo from '@/components/ui/CREOVLOGO'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { showToast } from '@/lib/toast'

// Icons
const ZapIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const GlobeIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const PaletteIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const RocketIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const DiamondIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13"/><path d="M13 3l3 6-4 13"/></svg>
const TargetIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
const BoxIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
const LeafIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
const CheckCircleIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const XCircleIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
const SaveDiskIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const RestoreArrIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
const TrashIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
const SparklesIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>

// Link Icon
const LinkIcon = ({className="w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>

// Editor Interface Icons
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
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [showButtonEditor, setShowButtonEditor] = useState(false)
  const [selectedButton, setSelectedButton] = useState(null)
  const [buttonText, setButtonText] = useState('')
  const [buttonLink, setButtonLink] = useState('https://example.com')
  const [buttonNewTab, setButtonNewTab] = useState(true)
  const [selectedMap, setSelectedMap] = useState(null)
const [mapLocation, setMapLocation] = useState('')
const [mapHeight, setMapHeight] = useState('400')
const [showMapEditor, setShowMapEditor] = useState(false) 


  const allQuickActions = [
    { icon: <ZapIcon className="w-3 h-3" />, label: 'Modern Hero', prompt: 'Completely redesign this as a stunning modern hero section with gradient background, large bold heading, descriptive subheading, two CTA buttons, and floating decorative elements. Use modern colors and smooth animations.' },
    { icon: <GlobeIcon className="w-3 h-3" />, label: 'Glassmorphism', prompt: 'Apply glassmorphism style: semi-transparent background with backdrop blur (10px), subtle white border, rounded corners (20px), and modern shadow effects. Make it look like frosted glass.' },
    { icon: <PaletteIcon className="w-3 h-3" />, label: 'Premium Luxury', prompt: 'Redesign with luxury aesthetics: gold/dark color scheme, serif fonts for headings, elegant spacing, subtle patterns or gradients, and sophisticated animations.' },
    { icon: <RocketIcon className="w-3 h-3" />, label: 'Startup Modern', prompt: 'Modern startup style: clean gradients, large sans-serif fonts (800 weight), rounded corners, floating cards, and micro-interactions. Make it bold and energetic.' },
    { icon: <DiamondIcon className="w-3 h-3" />, label: 'Neumorphism', prompt: 'Apply neumorphism design: soft shadows, matching background colors, subtle inset/outset effects, and clean minimalist typography.' },
    { icon: <TargetIcon className="w-3 h-3" />, label: 'Bold & Vibrant', prompt: 'Create a bold, vibrant design with eye-catching gradient colors, large typography, dramatic shadows, and energetic hover animations. Make it stand out.' },
    { icon: <BoxIcon className="w-3 h-3" />, label: 'Cyberpunk', prompt: 'Apply a neon cyberpunk aesthetic with dark backgrounds, glowing pink/cyan borders, glowing text, and futuristic styling.' },
    { icon: <LeafIcon className="w-3 h-3" />, label: 'Eco Minimal', prompt: 'Redesign with a clean eco-friendly minimalist style. Use soft greens, lots of whitespace, rounded organic shapes, and a very calm vibe.' },
    // New Link-related quick actions
    { icon: <LinkIcon className="w-3 h-3" />, label: 'Stylish Links', prompt: 'Redesign all links with modern styling: gradient underline on hover, smooth color transitions, and a subtle scale effect. Make them stand out without being overwhelming.' },
    { icon: <LinkIcon className="w-3 h-3" />, label: 'Button Links', prompt: 'Convert text links into prominent button-style links with pill shapes, gradient backgrounds, shadow effects, and hover animations. Make them look like clickable CTAs.' },
  ]

  useEffect(() => {
    if (isChatOpen && selectedComponent && messages.length === 0) {
      const timer = setInterval(() => {
        setSuggestionIndex(prev => (prev + 4) % allQuickActions.length)
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [isChatOpen, selectedComponent, messages.length])

  const currentQuickActions = Array.from({length: 4}).map((_, i) => allQuickActions[(suggestionIndex + i) % allQuickActions.length])

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
  // BUTTON SETTINGS SAVE HANDLER
  // ============================================
  function applyButtonChanges() {
    if (!selectedButton || !gjsRef.current) return

    const nextText = buttonText.trim() || 'Button'
    const nextHref = buttonLink.trim() || '#'
    const nextTarget = buttonNewTab ? '_blank' : '_self'

    const currentTag = selectedButton.get('tagName')?.toLowerCase()
    if (currentTag === 'button') {
      selectedButton.set('tagName', 'a')
      selectedButton.set('type', 'link')
    }

    selectedButton.components(nextText)
    selectedButton.addAttributes({
      href: nextHref,
      target: nextTarget,
      role: 'button'
    })

    selectedButton.set('droppable', false)
    selectedButton.set('draggable', true)
    gjsRef.current.refresh()
  }
 function applyMapChanges() {
  if (!selectedMap || !gjsRef.current) return

  const trimmedLocation = mapLocation.trim() || 'Lahore, Pakistan'
  const trimmedHeight = mapHeight.trim() || '400'

  // Update location attribute - triggers updateMap via trait
  selectedMap.addAttributes({
    location: trimmedLocation
  })

  // Update height
  selectedMap.setStyle({
    ...(selectedMap.getStyle?.() || {}),
    height: `${trimmedHeight}px`
  })

  gjsRef.current.refresh()
  if (gjsRef.current.getCanvas && gjsRef.current.getCanvas().render) {
    gjsRef.current.getCanvas().render()
  }

  setShowMapEditor(false)
  showToast(`<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Map updated to "${trimmedLocation}"`)
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

 
  // SAFE COMPONENT REPLACER 
  
  function safeReplaceComponent(component, newHtml) {
    try {
      if (!component || !newHtml) return false

      const cleanHtml = sanitizeAiHtml(newHtml)
      if (!cleanHtml) return false

      const previousStyle = component.getStyle?.() || {}
      const previousAttributes = component.getAttributes?.() || {}
      const previousClasses = component.get('classes')?.models?.map(c => c.get('name')) || []

      const replacementResult = component.replaceWith(cleanHtml)
      const newComponent = replacementResult?.[0] || null

      if (newComponent) {
        const mergedStyle = {
          ...(newComponent.getStyle?.() || {}),
          ...previousStyle,
        }
        newComponent.setStyle(mergedStyle)

        if (previousClasses.length) {
          newComponent.addClass(previousClasses)
        }

        const safeAttrs = { ...previousAttributes }
        delete safeAttrs.class
        delete safeAttrs.style
        if (Object.keys(safeAttrs).length) {
          newComponent.addAttributes(safeAttrs)
        }

        setSelectedComponent(newComponent)
        setEditingComponentInfo({
          tagName: newComponent.get('tagName')?.toLowerCase() || 'component',
          classes: newComponent.get('classes')?.models?.map(c => c.get('name')) || []
        })

        if (gjsRef.current?.select) {
          gjsRef.current.select(newComponent)
        }
      }

      setTimeout(() => {
        if (gjsRef.current?.refresh) gjsRef.current.refresh()
        if (gjsRef.current?.getCanvas?.().render) gjsRef.current.getCanvas().render()
      }, 50)

      return !!newComponent
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
editor.DomComponents.addType('google-map', {
  isComponent(el) {
    if (el.classList && el.classList.contains('map-component')) {
      return { type: 'google-map' }
    }
  },

  model: {
    defaults: {
      tagName: 'div',

      attributes: {
        class: 'map-component',
        location: 'Lahore, Pakistan'
      },

      traits: [
        {
          type: 'text',
          name: 'location',
          label: 'Location'
        }
      ],

    components: [
  {
    tagName: 'iframe',

    selectable: false,
    draggable: false,
    hoverable: false,

    attributes: {
      src: 'https://www.google.com/maps?q=Lahore,Pakistan&output=embed',
      width: '100%',
      height: '400',
      loading: 'lazy',
      allowfullscreen: true,
      style: 'border:0;border-radius:12px;pointer-events:none;'
    }
  }
]},
   
    init() {
      this.on('change:attributes:location', this.updateMap)
    },

    
    updateMap() {
      const location = this.getAttributes().location || 'Lahore, Pakistan'

      const iframe = this.components().at(0)

      if (iframe) {
        iframe.addAttributes({
          src: `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`
        })
      }
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
          a {
            transition: all 0.3s ease;
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
      <a href="#" style="display: inline-block; padding: 14px 32px; background: white; color: #667eea; border: none; border-radius: 50px; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; transition: all 0.3s ease;">View Our Menu</a>
      <a href="#" style="display: inline-block; padding: 14px 32px; background: transparent; color: white; border: 2px solid white; border-radius: 50px; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; transition: all 0.3s ease;">Reserve a Table</a>
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
          content: `<a href="https://example.com" target="_blank" style="display:inline-block; padding:12px 24px; background-color:#667eea; color:white; text-decoration:none; border-radius:8px; cursor:pointer; font-weight:600;">Button</a>`,
          media: `<svg vi
          ewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
        })
        bm.add('columns-2', {
          label: '2 Cols', category: 'Layout',
          content: `<section style="padding:60px 20px;"><div style="display:flex; flex-wrap:wrap; gap:30px; max-width:1200px; margin:0 auto;"><div style="flex:1; min-width:250px; padding:30px; background:#f9f9f9; border-radius:16px;">Column 1</div><div style="flex:1; min-width:250px; padding:30px; background:#f9f9f9; border-radius:16px;">Column 2</div></div></section>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="9" height="18" rx="1"/><rect x="13" y="3" width="9" height="18" rx="1"/></svg>`,
        })

        // NEW: Link blocks
        bm.add('link', {
          label: 'Link', 
          category: 'Basic',
          content: `<a href="#" style="color: #667eea; text-decoration: none; font-weight: 500; transition: color 0.3s; cursor: pointer;">Link Text</a>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        })
        
        bm.add('button-link', {
          label: 'Button Link', 
          category: 'Basic',
          content: `<a href="https://example.com" target="_blank" style="display: inline-block; padding: 12px 32px; background-color: #667eea; color: white; text-decoration: none; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; cursor: pointer;">Button Link</a>`,
          media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="8" width="16" height="8" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
        })
        bm.add('google-map', {
  label: 'Map',
  category: 'Basic',

  content: {
    type: 'google-map'
  },
   media: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Map outline -->
    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/>
    <!-- Vertical lines on map -->
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
    <!-- Location pin on map -->
    <circle cx="12" cy="11" r="2" fill="currentColor"/>
  </svg>`,
})

        // Add link traits
        const linkType = editor.DomComponents.getType('link')
        if (linkType) {
          linkType.model.prototype.defaults.traits = [
            {
              type: 'text',
              label: 'URL',
              name: 'href',
              placeholder: 'https://example.com',
            },
            {
              type: 'select',
              label: 'Target',
              name: 'target',
              options: [
                { value: '_self', name: 'Same Window' },
                { value: '_blank', name: 'New Window' },
              ],
            },
          ]
        }

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
        // Add link styles sector
        sm.addSector('link-styles', {
          name: 'Link Styles', 
          open: false,
          properties: [
            { 
              property: 'text-decoration', 
              type: 'select', 
              options: [
                { value: 'none', name: 'None' },
                { value: 'underline', name: 'Underline' },
                { value: 'line-through', name: 'Line Through' },
              ] 
            },
            { 
              property: 'cursor', 
              type: 'select', 
              options: [
                { value: 'pointer', name: 'Pointer' },
                { value: 'default', name: 'Default' },
              ] 
            },
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
      // UPDATED COMPONENT SELECTION HANDLER WITH LINK SUPPORT
      // ============================================
     editor.on('component:selected', (component) => {
  // ============================================
  // MAP DETECTION - MUST RUN FIRST
  // ============================================
  const componentType = component?.get('type')?.toLowerCase() || ''
  const componentClasses = component?.get('classes')?.models?.map(c => c.get('name')) || []
  const isMap = componentType === 'google-map' || componentClasses.includes('map-component')
  console.log("Selected Type:", component.get('type'))
console.log("Selected Tag:", component.get('tagName'))
console.log(component)
  if (isMap) {
    console.log("🎯 Map Selected!")
    setSelectedMap(component)
    setSelectedComponent(component)
    
    const attrs = component.getAttributes()
    const location = attrs.location || 'Lahore, Pakistan'
    setMapLocation(location)
    
    const style = component.getStyle?.() || {}
    const height = (style.height || '400px').toString().replace('px', '')
    setMapHeight(height || '400')
    
    setShowMapEditor(true)
    setShowButtonEditor(false)
    setSelectedButton(null)
    setEditingComponentInfo({ tagName: 'map', classes: ['map-component'] })
    return // CRITICAL: Stop further processing
  }
  
  // ============================================
  // NON-MAP COMPONENTS - NORMAL PROCESSING
  // ============================================
  setShowMapEditor(false)
  setSelectedMap(null)
  
  const editableComponent = getBestEditableComponent(component)
  setSelectedComponent(editableComponent)

  const tagName = editableComponent?.get('tagName')?.toLowerCase() || 'component'
  const attrs = editableComponent?.getAttributes() || {}
  const classes = editableComponent?.get('classes')?.models?.map(c => c.get('name')) || []
  setEditingComponentInfo({ tagName, classes })

  console.log(`📝 Editing: <${tagName}>`, classes)

  // Highlight effect
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

  // Button detection
  const selectedTag = component?.get('tagName')?.toLowerCase()
  const isButtonLike = selectedTag === 'button' || selectedTag === 'a' || component?.get('type') === 'link'

  if (isButtonLike) {
    const attrs = component.getAttributes()
    setSelectedButton(component)
    setButtonText(component.get('content')?.trim() || component.view?.el?.textContent?.trim() || 'Button')
    setButtonLink(attrs.href || 'https://example.com')
    setButtonNewTab(attrs.target === '_blank')
    setShowButtonEditor(true)
  } else {
    setSelectedButton(null)
    setShowButtonEditor(false)
  }

  // Image toolbar
  if (component?.get('type') === 'image') {
    const toolbar = component.get('toolbar') || []
    if (!toolbar.find(t => t.command === 'upload-image')) {
      toolbar.unshift({
        attributes: { title: 'Change image' },
        command: 'upload-image',
        label: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
      })
      component.set('toolbar', toolbar)
    }
  }
})

      editor.on('component:deselected', () => {
        setSelectedComponent(null)
        setEditingComponentInfo(null)
        setSelectedButton(null)
        setShowButtonEditor(false)
         setSelectedMap(null)     // Clear map selection
  setShowMapEditor(false)  // Close map editor
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
    
    showToast(`<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> "${newVersion.name}" saved (${Math.round(html.length / 1024)} KB)`)
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
      flash.innerHTML = `<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Restored "${version.name}"`
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
      flash.innerHTML = `<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2-2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Deleted "${versionName}"`
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
        flash.innerHTML = `<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Redesign applied successfully!`
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
        flash.innerHTML = `<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Failed to apply redesign. Check console for errors.`
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
          content: `I've completely redesigned your ${componentTag} with modern styles, gradients, and hover effects! Click "Apply" to see the transformation.`
        }])

        const flash = document.createElement('div')
        flash.innerHTML = `<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg> Complete redesign ready! Preview it before applying.`
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
          content: `Error: ${data.error}`
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Invalid response. Please try again with a clearer request.`
        }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Failed: ${err.message}`
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ background: 'rgba(3,7,18,0.95)' }}>
          <div className="rounded-3xl w-[400px] flex flex-col border shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden" style={{ background: '#080d20', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-[#05091a]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div>
                <h3 className="text-white font-extrabold text-lg tracking-tight">Save Version</h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">Create a recovery snapshot</p>
              </div>
              <button onClick={() => setShowSaveVersionModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs">
                ✕
              </button>
            </div>
            <div className="p-6 bg-[#030610] relative">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10">
                <input
                  type="text"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="e.g. Before Redesign"
                  className="w-full rounded-xl p-3.5 text-sm transition-all focus:ring-1 focus:ring-cyan-500/50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-3 font-light">Provide a descriptive name to help you identify this state later.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-[#05091a]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => setShowSaveVersionModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 hover:text-white hover:border-white/10 transition-all">
                Cancel
              </button>
              <button
                onClick={saveCurrentVersion}
                disabled={!versionName.trim()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none">
                Save Version
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Preview Modal */}
      {selectedVersionForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ background: 'rgba(3,7,18,0.95)' }}>
          <div className="rounded-3xl w-[95vw] max-w-[1400px] h-[90vh] overflow-hidden flex flex-col border shadow-[0_0_80px_rgba(0,0,0,0.8)]" style={{ background: '#080d20', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-[#05091a]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div>
                <h3 className="text-white font-extrabold text-lg tracking-tight">{selectedVersionForPreview.name}</h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">{formatDate(selectedVersionForPreview.timestamp)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeVersionPreview}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 hover:text-white hover:border-white/10 transition-all">
                  Close
                </button>
                <button
                  onClick={() => restoreVersion(selectedVersionForPreview)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <RestoreIcon /> Restore This Version
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-[#030610] relative">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10 w-full min-h-full rounded-2xl overflow-hidden shadow-2xl bg-white border border-white/10">
                <iframe
                  title="Version Preview"
                  className="w-full min-h-[calc(90vh-140px)] border-0"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" style={{ background: 'rgba(3,7,18,0.95)' }}>
          <div className="rounded-3xl w-[900px] max-w-[90vw] max-h-[85vh] overflow-hidden flex flex-col border shadow-[0_0_80px_rgba(0,0,0,0.8)]" style={{ background: '#080d20', borderColor: 'rgba(255,255,255,0.1)' }}>
            
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0 bg-[#05091a]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div>
                <h3 className="text-white font-extrabold text-lg tracking-tight">Preview Redesign</h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">Review generated changes before applying</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-white/10 transition-all text-xs">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 bg-[#030610] relative">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative z-10 w-full min-h-[300px] rounded-2xl overflow-hidden shadow-2xl bg-white border border-white/10 p-4">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-[#05091a]" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => setShowPreview(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 hover:text-white hover:border-white/10 transition-all">
                Reject
              </button>
              <button
                onClick={applyPreview}
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                Apply Redesign →
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div
        className="flex items-center justify-between px-6 shrink-0 border-b backdrop-blur-xl relative z-10"
        style={{ height: 64, background: 'rgba(8, 14, 32, 0.85)', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)' }}>

        <div className="flex items-center gap-4">
          <Link href="/">
            <CreovLogo className="w-6 h-6" suffix="EDITOR" />
          </Link>
          <div className="w-px h-4" style={{ background: BORDER }} />
          <div className="flex items-center gap-0.5">
            <IconBtn onClick={undo} title="Undo"><UndoIcon /></IconBtn>
            <IconBtn onClick={redo} title="Redo"><RedoIcon /></IconBtn>
          </div>
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
              background: isChatOpen ? 'rgba(6,182,212,0.15)' : 'transparent',
              color: isChatOpen ? '#22d3ee' : TEXT_SECONDARY,
              border: `1px solid ${isChatOpen ? '#06b6d4' : BORDER}`
            }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4"/><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="m21.1 15.6-1.4 1.4"/><path d="m21.1 8.6-1.4 1.4"/><path d="m8.6 21.1 1.4-1.4"/><path d="m15.6 21.1 1.4-1.4"/></svg>
            Refine Design
            {selectedComponent && !isChatOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
            <EyeIcon /> Preview
          </button>

         

          <button
            onClick={() => {
              if (!websiteId) {
                alert('Please Save your website first before publishing!');
              } else {
                const url = window.location.origin + '/p/' + websiteId;
                navigator.clipboard.writeText(url);
                showToast(`<svg style="display:inline-block;width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Link copied to clipboard!`);
                window.open(url, '_blank');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:bg-cyan-500/10 hover:text-cyan-400"
            style={{ color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
            <GlobeIcon /> Publish
          </button>

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

        {/* Button Settings Sidebar */}
        {showButtonEditor && !showMapEditor && !isChatOpen && !showVersionHistory && (

          <div
            className="flex flex-col shrink-0 border-l relative z-10"
            style={{ width: 400, background: SIDEBAR_BG, borderColor: BORDER, boxShadow: '-10px 0 30px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
              <div>
                <h3 className="text-white font-semibold text-sm">Button Settings</h3>
                <p className="text-xs" style={{ color: TEXT_MUTED }}>Edit the selected button link and label</p>
              </div>
              <button onClick={() => setShowButtonEditor(false)} className="p-1 rounded-lg transition-all" style={{ color: TEXT_MUTED }}>
                <CloseIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="text-xs font-medium" style={{ color: TEXT_SECONDARY }}>Button Text</label>
                <input
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full mt-2 rounded-xl p-3 text-sm transition-all focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, color: 'white', outline: 'none' }}
                />
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: TEXT_SECONDARY }}>Button Link</label>
                <input
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full mt-2 rounded-xl p-3 text-sm transition-all focus:ring-1 focus:ring-cyan-500/50"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, color: 'white', outline: 'none' }}
                />
              </div>
              <label className="flex items-center gap-3 rounded-xl px-3 py-2 border text-sm cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', borderColor: BORDER, color: 'white' }}>
                <input type="checkbox" checked={buttonNewTab} onChange={(e) => setButtonNewTab(e.target.checked)} className="h-4 w-4" />
                <span>Open in New Tab</span>
              </label>
              <button onClick={applyButtonChanges} className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', boxShadow: '0 0 18px rgba(6,182,212,0.25)' }}>
                Apply Changes
              </button>
            </div>
          </div>
        )}
{/* Map Settings Sidebar */}
{showMapEditor && !isChatOpen && !showVersionHistory && (
  <div
    className="flex flex-col shrink-0 border-l relative z-10"
    style={{ width: 400, background: SIDEBAR_BG, borderColor: BORDER, boxShadow: '-10px 0 30px rgba(0,0,0,0.3)' }}>
    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
      <div>
        <h3 className="text-white font-semibold text-sm">Map Settings</h3>
        <p className="text-xs" style={{ color: TEXT_MUTED }}>Set the location shown on this map</p>
      </div>
      <button onClick={() => setShowMapEditor(false)} className="p-1 rounded-lg transition-all" style={{ color: TEXT_MUTED }}>
        <CloseIcon />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div>
        <label className="text-xs font-medium" style={{ color: TEXT_SECONDARY }}>Location</label>
        <input
          value={mapLocation}
          onChange={(e) => setMapLocation(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') applyMapChanges() }}
          placeholder="e.g. Lahore, Pakistan or an address"
          className="w-full mt-2 rounded-xl p-3 text-sm transition-all focus:ring-1 focus:ring-cyan-500/50"
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, color: 'white', outline: 'none' }}
          autoFocus
        />
        <p className="text-[11px] mt-2 font-light" style={{ color: TEXT_MUTED }}>
          Type a city, address, or landmark. It's passed straight to Google Maps search.
        </p>
      </div>
      <div>
        <label className="text-xs font-medium" style={{ color: TEXT_SECONDARY }}>Map Height (px)</label>
        <input
          value={mapHeight}
          onChange={(e) => setMapHeight(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="400"
          className="w-full mt-2 rounded-xl p-3 text-sm transition-all focus:ring-1 focus:ring-cyan-500/50"
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, color: 'white', outline: 'none' }}
        />
      </div>
      <button 
        onClick={applyMapChanges} 
        disabled={!mapLocation.trim()} 
        className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100" 
        style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)', boxShadow: '0 0 18px rgba(6,182,212,0.25)' }}>
        Update Map
      </button>
    </div>
  </div>
)}
        {/* Version History Sidebar */}
        {showVersionHistory && !isChatOpen && (
          <div
            className="flex flex-col shrink-0 border-l relative z-10"
            style={{ width: 380, background: SIDEBAR_BG, borderColor: BORDER, boxShadow: '-10px 0 30px rgba(0,0,0,0.3)' }}>
            
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
            className="flex flex-col shrink-0 border-l relative z-10"
            style={{ width: 400, background: SIDEBAR_BG, borderColor: BORDER, boxShadow: '-10px 0 30px rgba(0,0,0,0.3)' }}>

            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))' }}>
                  <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-wide text-sm">Design Refiner</h3>
                  <p className="text-xs font-mono tracking-wider uppercase mt-0.5" style={{ color: TEXT_MUTED }}>
                    {selectedComponent
                      ? `Target: ${selectedComponent.get('tagName')?.toLowerCase() || 'element'}`
                      : 'No target selected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: TEXT_MUTED }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}>
                <CloseIcon />
              </button>
            </div>

            {/* Component Info Panel */}
            {selectedComponent && editingComponentInfo && (
              <div className="m-4 p-3.5 rounded-xl border" style={{ background: 'rgba(6,182,212,0.05)', borderColor: `rgba(6,182,212,0.15)` }}>
                <p className="text-xs font-medium" style={{ color: '#22d3ee' }}>
                  <span className="inline-flex items-center gap-1.5"><TargetIcon className="w-3.5 h-3.5" /> Active Element: <strong>&lt;{editingComponentInfo.tagName}&gt;</strong></span>
                  {editingComponentInfo.classes.length > 0 && (
                    <span className="ml-1 opacity-70 font-mono text-[10px]">
                      ({editingComponentInfo.classes.join(', ')})
                    </span>
                  )}
                </p>
                <p className="text-xs mt-2.5 font-light" style={{ color: TEXT_MUTED }}>
                  <span className="inline-flex items-start gap-1.5"><ZapIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Tip: Select a parent wrapper (like a section or navbar) to refine the entire block at once.</span>
                </p>
              </div>
            )}

            {selectedComponent && messages.length === 0 && (
              <div className="p-4 border-b" style={{ borderColor: BORDER }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: TEXT_MUTED }}>
                  <svg className="w-3.5 h-3.5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 4 4"/><path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><path d="m21.1 15.6-1.4 1.4"/><path d="m21.1 8.6-1.4 1.4"/><path d="m8.6 21.1 1.4-1.4"/><path d="m15.6 21.1 1.4-1.4"/></svg>
                  Quick Refinements
                </p>
                <div className="flex flex-wrap gap-2.5 min-h-[70px] relative">
                  <AnimatePresence mode="popLayout">
                    {currentQuickActions.map((action, i) => (
                      <motion.button
                        key={`${suggestionIndex}-${i}`}
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onClick={() => sendMessage(action.prompt)}
                        disabled={isRefining}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm border"
                        style={{
                          background: 'rgba(6,182,212,0.08)',
                          color: '#67e8f9',
                          borderColor: 'rgba(6,182,212,0.2)',
                          opacity: isRefining ? 0.5 : 1
                        }}
                        onMouseEnter={e => { if (!isRefining) { e.currentTarget.style.background = 'rgba(6,182,212,0.15)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)' } }}
                        onMouseLeave={e => { if (!isRefining) { e.currentTarget.style.background = 'rgba(6,182,212,0.08)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)' } }}>
                        {action.icon && <span className="mr-1">{action.icon}</span>}
                        <span>{action.label}</span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-2xl mb-5 flex items-center justify-center border shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-pulse" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.2)' }}>
                    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  <h3 className="text-white font-black text-lg mb-2 tracking-tight">Refine Element</h3>
                  <p className="text-xs font-light max-w-[250px] mx-auto leading-relaxed" style={{ color: TEXT_MUTED }}>
                    {selectedComponent
                      ? 'Apply quick visual styles above, or describe your specific requirements below to customize this element.'
                      : 'Select any element on the canvas to inspect it and apply contextual design refinements.'}
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[85%] rounded-xl p-3.5 shadow-sm"
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: 'white', borderBottomRightRadius: '4px' }
                          : { background: 'rgba(255,255,255,0.05)', color: TEXT_SECONDARY, borderBottomLeftRadius: '4px', border: `1px solid ${BORDER}` }
                      }>
                      <p className="text-[13px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isRefining && (
                <div className="flex justify-start">
                  <div className="rounded-xl p-3.5 border" style={{ background: 'rgba(255,255,255,0.05)', borderColor: BORDER, borderBottomLeftRadius: '4px' }}>
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t" style={{ borderColor: BORDER, background: '#030712' }}>
              <div className="flex gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={selectedComponent ? 'Specify styling instructions (e.g. "make it darker")...' : 'Select a component first...'}
                  disabled={!selectedComponent || isRefining}
                  rows={2}
                  className="flex-1 rounded-xl p-3 text-xs resize-none transition-all focus:ring-1 focus:ring-cyan-500/50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${BORDER}`,
                    color: 'white',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || !selectedComponent || isRefining}
                  className="w-12 rounded-xl transition-all flex items-center justify-center shrink-0"
                  style={{
                    background: inputMessage.trim() && selectedComponent && !isRefining
                      ? 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                      : 'rgba(255,255,255,0.05)',
                    opacity: inputMessage.trim() && selectedComponent && !isRefining ? 1 : 0.5,
                    cursor: inputMessage.trim() && selectedComponent && !isRefining ? 'pointer' : 'not-allowed',
                    border: `1px solid ${inputMessage.trim() && selectedComponent && !isRefining ? 'transparent' : BORDER}`
                  }}>
                  <SendIcon />
                </button>
              </div>
              <p className="text-[10px] mt-2.5 text-center font-bold tracking-wider uppercase" style={{ color: TEXT_MUTED }}>
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
}}
