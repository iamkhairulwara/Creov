'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import CreovLogo from '@/components/ui/CREOVLOGO'

const NavLink = ({ href, icon, label, specialColor }) => {
  const pathname = usePathname()
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
        active ? (specialColor || 'text-cyan-400') : 'text-slate-400 hover:text-white'
      }`}
    >
      {/* Background hover pill */}
      <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Active Underline */}
      {active && (
        <span className={`absolute -bottom-1 left-2 right-2 h-[2px] rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] ${specialColor ? 'bg-violet-400' : 'bg-cyan-400'}`} />
      )}

      <span className="relative z-10 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
        {icon}
        {label}
      </span>
    </Link>
  )
}

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // New States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const handleScroll = () => {
      if (isMounted) setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Close profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    const fetchUserAndRole = async (sessionUser) => {
      if (!sessionUser) {
        if (isMounted) {
          setUser(null)
          setIsAdmin(false)
        }
        return
      }

      if (isMounted) setUser(sessionUser)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', sessionUser.id)
        .maybeSingle()

      if (isMounted && profile?.role === 'admin') {
        setIsAdmin(true)
      }
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await fetchUserAndRole(session?.user || null)
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        await fetchUserAndRole(session?.user || null)
        if (isMounted) setLoading(false)
      }
    })

    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
      subscription.unsubscribe()
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleGetStarted = () => {
    router.push('/auth/login')
  }

  const isActive = (path) => pathname === path

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }


  return (
    <>
      <nav
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 mx-auto max-w-[85rem] rounded-2xl border ${scrolled
            ? 'bg-[#030712]/80 backdrop-blur-xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-3'
            : 'bg-transparent border-transparent py-4'
          }`}
      >
        <div className="px-5 sm:px-6 flex items-center justify-between">

          <Link href="/" className="relative z-50">
            <CreovLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-6">
            <div className="flex items-center gap-1 lg:gap-3">
              <NavLink
                href="/generate"
                label="Generate"
                icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
              />
              <NavLink
                href="/templates"
                label="Templates"
                icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>}
              />
              <NavLink
                href="/showcase"
                label="Showcase"
                icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>}
              />
              <NavLink
                href="/docs"
                label="Docs"
                icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>}
              />
              <NavLink
                href="/contact"
                label="Contact"
                icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
              />
            </div>

            {loading ? (
              <div className="pl-4 border-l border-white/10">
                <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
              </div>
            ) : user ? (


                <div className="pl-4 border-l border-white/10 relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 p-[2px] cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  <div className={`absolute right-0 mt-3 w-56 bg-[#0a0f24]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50 transition-all duration-200 origin-top-right ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
                      Dashboard
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        Admin Panel
                      </Link>
                    )}
                    
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
            ) : (
              <button
                onClick={handleGetStarted}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.25)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)] hover:scale-[1.02]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#030712]/95 backdrop-blur-2xl z-40 transition-all duration-500 md:hidden flex flex-col pt-28 px-6 overflow-y-auto pb-12 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {user ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 p-[2px]">
                <div className="w-full h-full bg-[#030712] rounded-full flex items-center justify-center text-lg font-bold text-white">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Signed in as</p>
                <p className="text-sm font-semibold text-white">{user.email}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/generate" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/generate') ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Generate
              </Link>
              <Link href="/templates" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/templates') ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                Templates
              </Link>
              <Link href="/showcase" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/showcase') ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                Showcase
              </Link>
              <Link href="/docs" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/docs') ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                Docs
              </Link>
              <Link href="/contact" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/contact') ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Contact
              </Link>
              <div className="h-px bg-white/10 my-2"></div>
              <Link href="/dashboard" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/dashboard') ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className={`p-4 rounded-xl flex items-center gap-3 font-semibold ${isActive('/admin') ? 'bg-violet-500/10 text-violet-400' : 'text-slate-300 hover:bg-white/5'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  Admin Panel
                </Link>
              )}
            </nav>

            <button onClick={handleLogout} className="mt-auto mb-10 w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-center pb-20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center font-[family-name:var(--font-space-grotesk)]">Ready to create?</h2>
            <p className="text-slate-400 text-center mb-8">Sign in to generate unlimited websites with AI.</p>
            <button
              onClick={handleGetStarted}
              className="w-full py-4 rounded-2xl bg-cyan-500 text-[#030712] text-sm font-bold uppercase tracking-wider shadow-[0_4px_25px_rgba(34,211,238,0.3)]"
            >
              Sign In to Continue
            </button>
          </div>
        )}
      </div>
    </>
  )
}