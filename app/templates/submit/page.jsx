'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'
import CustomSelect from '@/components/ui/CustomSelect'

const CameraIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
const BuildingIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
const UtensilsIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
const RocketIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
const ShoppingCartIcon = ({className="w-3.5 h-3.5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>

const templateCategoryOptions = [
  { value: 'portfolio', label: 'Portfolio', icon: <CameraIcon /> },
  { value: 'business', label: 'Business', icon: <BuildingIcon /> },
  { value: 'restaurant', label: 'Restaurant', icon: <UtensilsIcon /> },
  { value: 'landing', label: 'Landing Page', icon: <RocketIcon /> },
  { value: 'e-commerce', label: 'E-Commerce', icon: <ShoppingCartIcon /> }
]

export default function SubmitTemplatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'portfolio',
    code: ''
  })
  
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      router.push('/auth/login')
    } else {
      setUser(session.user)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const parseCode = (fullCode) => {
    let htmlContent = fullCode || '';
    let cssContent = '';
    let jsContent = '';

    // Extract <style>...</style>
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let match;
    while ((match = styleRegex.exec(htmlContent)) !== null) {
      cssContent += match[1] + '\n';
    }
    htmlContent = htmlContent.replace(styleRegex, '');

    // Extract <script>...</script> (Note: external scripts are ignored for security)
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    while ((match = scriptRegex.exec(htmlContent)) !== null) {
      if (match[1].trim()) {
        jsContent += match[1] + '\n';
      }
    }
    htmlContent = htmlContent.replace(scriptRegex, '');

    // Extract <body> contents if present
    const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(htmlContent);
    if (bodyMatch) {
      htmlContent = bodyMatch[1];
    } else {
      // Strip outer document tags if no body tag
      htmlContent = htmlContent
        .replace(/<!DOCTYPE[^>]*>/i, '')
        .replace(/<html[^>]*>/i, '')
        .replace(/<\/html>/i, '')
        .replace(/<head[^>]*>[\s\S]*?<\/head>/i, '');
    }

    return {
      html: htmlContent.trim(),
      css: cssContent.trim(),
      js: jsContent.trim()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const { html, css, js } = parseCode(formData.code)

      const res = await fetch('/api/templates/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          html,
          css,
          js
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit template')
      }

      setStatus({ 
        type: 'success', 
        message: 'Submitted for review — you\'ll see it on your dashboard once approved.' 
      })
      
      // Reset form
      setFormData({
        title: '',
        category: 'portfolio',
        code: ''
      })
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 pt-36 pb-24">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-4 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
            Community Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] text-white mb-4">
            Submit a Template
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Share your best designs with the community. Paste your complete HTML website code below. We'll automatically split it up and securely sandbox it.
          </p>
        </div>

        {status.message && (
          <div className={`mb-8 p-4 rounded-xl border text-sm font-semibold flex items-center justify-between ${
            status.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span>{status.message}</span>
            {status.type === 'success' && (
              <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-green-500/20 rounded-lg text-xs uppercase tracking-wider text-green-300 hover:bg-green-500/30 transition-all">
                Go to Dashboard
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Template Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern Dark Portfolio"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition duration-300 text-sm"
              />
            </div>
            <div className="relative z-40">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Category *</label>
              <CustomSelect
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={templateCategoryOptions}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Website Source Code *</label>
            <p className="text-[10px] text-slate-500 mb-2">Paste your entire <code className="text-cyan-400">&lt;!DOCTYPE html&gt;</code> file here. We will extract the CSS and JS automatically.</p>
            <textarea
              name="code"
              required
              rows={18}
              value={formData.code}
              onChange={handleChange}
              placeholder="<!DOCTYPE html>&#10;<html>&#10;<head>&#10;  <style>...</style>&#10;</head>&#10;<body>...</body>&#10;</html>"
              className="w-full px-4 py-4 rounded-xl bg-[#030610] border border-white/10 text-slate-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-500 transition duration-300"
            />
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#030712] bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-[#030712] border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
