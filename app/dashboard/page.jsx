'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'

export default function Dashboard() {
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  async function checkAuthAndLoad() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    setUser(session.user)
    loadWebsites(session.user.id)
  }

  async function loadWebsites(userId) {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    if (!error) setWebsites(data || [])
    setLoading(false)
  }

  async function handleDelete(websiteId) {
    if (!confirm('Delete this website? This cannot be undone.')) return
    setDeleting(websiteId)

    // Delete related prompts first to avoid foreign key conflict
    await supabase.from('prompts').delete().eq('website_id', websiteId)

    // Now delete the website
    const { error } = await supabase.from('websites').delete().eq('id', websiteId)

    if (!error) {
      setWebsites(prev => prev.filter(w => w.id !== websiteId))
    }

    setDeleting(null)
  }

  function handleEdit(website) {
    localStorage.setItem('edit_website', JSON.stringify(website))
    router.push(`/editor/${website.id}`)
  }

  function handlePreview(website) {
    const full = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<style>${website.css || ''}</style>
</head>
<body>
${website.html || ''}
<script>${website.js || ''}</script>
</body>
</html>`
    const blob = new Blob([full], { type: 'text/html' })
    window.open(URL.createObjectURL(blob), '_blank')
  }

  function handleExport(website) {
    localStorage.setItem('export_website', JSON.stringify({
      html: website.html,
      css: website.css,
      js: website.js,
      title: website.title || 'my-website'
    }))
    router.push('/export')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Dynamic mesh glows */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse-glow"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">

          {/* Immersive Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-white/5 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-3 animate-float text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Active Hub
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">My Saved Sites</h1>
              <p className="mt-1.5 text-xs font-mono uppercase tracking-widest text-slate-500">
                {websites.length} design{websites.length !== 1 ? 's' : ''} stored in cloud
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href="/templates"
                className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 bg-white/5 hover:border-white/10 hover:text-white transition-all duration-300"
              >
                Browse Templates
              </Link>
              <Link
                href="/generate"
                className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
              >
                Synthesize New AI
              </Link>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/5 bg-white/5 p-6 animate-pulse"
                >
                  <div className="h-32 bg-white/5 rounded-2xl mb-4" />
                  <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-white/5 rounded w-1/3 mb-6" />
                  <div className="h-10 bg-white/5 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Elegant Empty State */}
          {!loading && websites.length === 0 && (
            <div
              className="text-center py-24 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl max-w-3xl mx-auto shadow-2xl"
            >
              <div className="text-6xl mb-6 animate-float">🌐</div>
              <h2 className="text-2xl font-black text-white mb-2">
                No designs synthesized yet
              </h2>
              <p className="mb-8 text-slate-400 text-sm max-w-md mx-auto font-light leading-relaxed">
                Start your workspace by choosing a template layout or describing your business in plain English for instant AI generation.
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/templates"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Browse Templates
                </Link>
                <Link
                  href="/generate"
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
                >
                  Generate with AI
                </Link>
              </div>
            </div>
          )}

          {/* Websites Grid */}
          {!loading && websites.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {websites.map(website => (
                <div
                  key={website.id}
                  className="group rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_8px_30px_rgba(6,182,212,0.06)]"
                >
                  {/* Thumbnail Frame */}
                  <div
                    className="relative overflow-hidden cursor-pointer border-b border-white/5"
                    style={{ height: '180px', background: '#0a0f23' }}
                    onClick={() => handlePreview(website)}
                  >
                    <iframe
                      srcDoc={`<html><head><style>*{margin:0;padding:0;overflow:hidden;}body{transform:scale(0.45);transform-origin:top left;width:222%;height:222%;overflow:hidden;}${website.css || ''}</style></head><body>${website.html || ''}</body></html>`}
                      className="w-full h-full border-0 pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      title={website.title}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: 'rgba(3,7,18,0.85)' }}
                    >
                      <span className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        Launch Live View
                      </span>
                    </div>
                  </div>

                  {/* Card Body Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-extrabold text-white truncate text-base tracking-tight group-hover:text-cyan-300 transition-colors">
                        {website.title || 'Untitled Workspace'}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 backdrop-blur-md">
                        {website.source === 'generated' ? 'AI Synthesized' : 'Template'}
                      </span>
                    </div>
                    
                    <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-6">
                      LAST EDITED: {formatDate(website.updated_at || website.created_at)}
                    </p>

                    {/* Highly Styled Interactive Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEdit(website)}
                        className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300"
                      >
                        Edit Workspace
                      </button>
                      <button
                        onClick={() => handleExport(website)}
                        className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 hover:border-white/10 hover:text-white transition-all duration-300"
                      >
                        Export ZIP
                      </button>
                      <button
                        onClick={() => handlePreview(website)}
                        className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 border border-white/5 hover:border-white/10 hover:text-white transition-all duration-300"
                      >
                        Live Sandbox
                      </button>
                      <button
                        onClick={() => handleDelete(website.id)}
                        disabled={deleting === website.id}
                        className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 border border-red-500/10 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-40"
                      >
                        {deleting === website.id ? 'Deleting...' : 'Delete Cloud'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}