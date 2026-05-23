'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/ui/NAVBAR'
import { supabase } from '@/lib/supabase/client'

const CARD_BG = 'rgba(255,255,255,0.02)'
const CARD_BORDER = 'rgba(255,255,255,0.06)'
const CYAN = '#06b6d4'
const TEXT_MUTED = '#64748b'
const TEXT_SECONDARY = '#94a3b8'

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
    <div className="min-h-screen">
      <Navbar />

      {/* Background glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05), transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">My Websites</h1>
            <p className="mt-1 text-sm" style={{ color: TEXT_MUTED }}>
              {websites.length} website{websites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/templates"
              className="px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
              style={{ color: TEXT_SECONDARY, borderColor: CARD_BORDER }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = TEXT_SECONDARY}>
              Browse Templates
            </Link>
            <Link
              href="/generate"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
              Generate New
            </Link>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div
                key={i}
                className="rounded-2xl border p-6 animate-pulse"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
                <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-1/3 mb-6" />
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && websites.length === 0 && (
          <div
            className="text-center py-24 rounded-2xl border"
            style={{ background: CARD_BG, borderColor: CARD_BORDER }}>
            <div className="text-5xl mb-4">🌐</div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No websites yet
            </h2>
            <p className="mb-8 text-sm" style={{ color: TEXT_MUTED }}>
              Generate one with AI or pick a template to get started
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/templates"
                className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all"
                style={{ color: TEXT_SECONDARY, borderColor: CARD_BORDER }}>
                Browse Templates
              </Link>
              <Link
                href="/generate"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                Generate with AI
              </Link>
            </div>
          </div>
        )}

        {/* Websites Grid */}
        {!loading && websites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map(website => (
              <div
                key={website.id}
                className="rounded-2xl border overflow-hidden transition-all"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.06)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = CARD_BORDER
                  e.currentTarget.style.boxShadow = 'none'
                }}>

                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden cursor-pointer group"
                  style={{ height: '160px', background: '#0a0f23' }}
                  onClick={() => handlePreview(website)}>
                  <iframe
                    srcDoc={`<html><head><style>*{margin:0;padding:0;}body{transform:scale(0.4);transform-origin:top left;width:250%;height:250%;overflow:hidden;}${website.css || ''}</style></head><body>${website.html || ''}</body></html>`}
                    className="w-full h-full border-0 pointer-events-none"
                    title={website.title}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(6,10,26,0.7)' }}>
                    <span
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(6,182,212,0.2)', color: CYAN, border: '1px solid rgba(6,182,212,0.3)' }}>
                      Preview
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white truncate text-sm">
                      {website.title || 'Untitled'}
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                      style={{
                        background: 'rgba(6,182,212,0.1)',
                        color: CYAN,
                        border: '1px solid rgba(6,182,212,0.2)'
                      }}>
                      {website.source === 'generated' ? 'AI' : 'Template'}
                    </span>
                  </div>
                  <p className="text-xs mb-4" style={{ color: TEXT_MUTED }}>
                    {formatDate(website.updated_at || website.created_at)}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(website)}
                      className="py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleExport(website)}
                      className="py-2 rounded-lg text-xs font-medium border transition-all"
                      style={{ color: TEXT_SECONDARY, borderColor: CARD_BORDER }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = TEXT_SECONDARY}>
                      Export
                    </button>
                    <button
                      onClick={() => handlePreview(website)}
                      className="py-2 rounded-lg text-xs font-medium border transition-all"
                      style={{ color: TEXT_SECONDARY, borderColor: CARD_BORDER }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = TEXT_SECONDARY}>
                      Preview
                    </button>
                    <button
                      onClick={() => handleDelete(website.id)}
                      disabled={deleting === website.id}
                      className="py-2 rounded-lg text-xs font-medium border transition-all disabled:opacity-50"
                      style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {deleting === website.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}