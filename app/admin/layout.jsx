'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import CreovLogo from '@/components/ui/CREOVLOGO'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let isMounted = true

    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user

        if (!user) {
          if (isMounted) router.replace('/auth/login')
          return
        }

        // ✅ FIX: Use maybeSingle() instead of single() to avoid 406 error
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()  // ← Changed from .single()

        if (error) {
          console.error('Profile fetch error:', error)
          if (isMounted) router.replace('/generate')
          return
        }

        if (profile?.role !== 'admin') {
          if (isMounted) router.replace('/generate')
          return
        }

        if (isMounted) {
          setIsAdmin(true)
          setLoading(false)
        }
      } catch (err) {
        console.error('Admin check error:', err)
        if (isMounted) router.replace('/generate')
      }
    }

    checkAdmin()

    return () => { isMounted = false }
  }, [router])

  const isActive = (path) => pathname === path

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060a1a]">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-cyan-400 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#060a1a] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Cyber Grid Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#030712]/60 backdrop-blur-xl border-r border-white/5 flex flex-col justify-between z-30">
        <div className="p-6">
          <div className="mb-10 px-2">
            <Link href="/admin">
              <CreovLogo className="w-9 h-9" suffix="Admin" />
            </Link>
          </div>

          <nav className="space-y-1">
            <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin') ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
              Dashboard
            </Link>
            <Link href="/admin/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/analytics') ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
              Analytics
            </Link>
            <Link href="/admin/templates" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/templates') ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
              Templates
            </Link>
            <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/users') ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Users
            </Link>
            <Link href="/admin/logs" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/logs') ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h10" /></svg>
              Activity Logs
            </Link>
            <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/settings') ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-l-2 border-cyan-400 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 bg-[#02050f]/20">
          <Link href="/generate" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 19-7-7 7-7M5 12h14" /></svg>
            Return to App
          </Link>
        </div>
      </aside>

      <div className="ml-64 p-8 relative min-h-screen">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}