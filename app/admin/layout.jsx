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
  const [pendingSubmissions, setPendingSubmissions] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

        // Fetch counts for badges
        const { count: subCount } = await supabase
          .from('templates')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        const { count: msgCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'unread')

        if (isMounted) {
          setIsAdmin(true)
          setPendingSubmissions(subCount || 0)
          setUnreadMessages(msgCount || 0)
          setLoading(false)
        }
      } catch (err) {
        console.error('Admin check error:', err)
        if (isMounted) router.replace('/generate')
      }
    }

    checkAdmin()

    // Real-time subscriptions for live notification badges
    const submissionsSub = supabase.channel('submissions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, async () => {
        const { count } = await supabase.from('templates').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        if (isMounted) setPendingSubmissions(count || 0)
      }).subscribe()

    const messagesSub = supabase.channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, async () => {
        const { count } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread')
        if (isMounted) setUnreadMessages(count || 0)
      }).subscribe()

    return () => { 
      isMounted = false 
      supabase.removeChannel(submissionsSub)
      supabase.removeChannel(messagesSub)
    }
  }, [router, pathname])

  const isActive = (path) => pathname === path

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
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
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* Ambient background glows removed */}

      {/* Cyber Grid Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#030712] sticky top-0 z-20">
        <Link href="/admin">
          <CreovLogo className="w-8 h-8" suffix="Admin" />
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-[#030712] border-r border-white/10 flex flex-col justify-between z-40 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="mb-10 px-2">
            <Link href="/admin">
              <CreovLogo className="w-9 h-9" suffix="Admin" />
            </Link>
          </div>

          <nav className="space-y-1">
            <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
              Dashboard
            </Link>
            <Link href="/admin/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/analytics') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
              Analytics
            </Link>
            <Link href="/admin/templates" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/templates') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
              Templates
            </Link>
            <Link href="/admin/submissions" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/submissions') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <div className="relative flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                {pendingSubmissions > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md px-1 ring-2 ring-[#030712]">
                    {pendingSubmissions}
                  </span>
                )}
              </div>
              Submissions
            </Link>
            <Link href="/admin/messages" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/messages') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <div className="relative flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><polyline points="15,9 18,9 18,11"/><path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0"/><line x1="6" y1="10" x2="7" y2="10"/></svg>
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md px-1 ring-2 ring-[#030712]">
                    {unreadMessages}
                  </span>
                )}
              </div>
              Messages
            </Link>
            <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/users') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              Users
            </Link>
            <Link href="/admin/logs" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/logs') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h10" /></svg>
              Activity Logs
            </Link>
            <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 ${isActive('/admin/settings') ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              Settings
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/10 bg-[#030712] flex flex-col gap-4">
          {/* System Status Widget */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">System Status</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Optimal
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Database</span>
                  <span className="text-white">99.9%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[99.9%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">Generative API</span>
                  <span className="text-white">42ms</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 w-[85%]" />
                </div>
              </div>
            </div>
          </div>

          <Link href="/" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 19-7-7 7-7M5 12h14" /></svg>
            Return to App
          </Link>
        </div>
      </aside>

      <div className="lg:ml-64 p-4 md:p-8 relative min-h-screen">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}