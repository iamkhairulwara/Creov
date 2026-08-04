'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { supabase } from '@/lib/supabase/client'

export default function Showcase() {
  const router = useRouter()
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShowcase()
  }, [])

  async function fetchShowcase() {
    // Fetch websites that have a slug (published)
    const { data, error } = await supabase
      .from('websites')
      .select(`
        id, title, description, slug, created_at,
        profiles:user_id(full_name, email)
      `)
      .not('slug', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching showcase:', error.message)
    } else {
      setWebsites(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Community Showcase
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Built with <span className="text-cyan-400">Creov</span>
            </h1>
            <p className="text-slate-400 text-lg font-light max-w-xl mx-auto mb-8">
              Explore the amazing websites generated and published by our incredible community of creators.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : websites.length === 0 ? (
            <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
              <p className="text-slate-400 font-mono text-sm uppercase">No published sites yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map(site => (
                <a
                  key={site.id}
                  href={`/p/${site.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative h-64 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 flex flex-col justify-between hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{site.title || 'Untitled Project'}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{site.description || 'A beautiful website generated with AI on Creov.'}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      By: {site.profiles?.full_name || site.profiles?.email?.split('@')[0] || 'Anonymous'}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
