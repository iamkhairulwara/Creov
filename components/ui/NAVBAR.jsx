'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import CreovLogo from '@/components/ui/CREOVLOGO'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Scroll listener for neat visual shift
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const isActive = (path) => pathname === path

  return (
    <nav 
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 mx-auto max-w-7xl rounded-2xl border ${
        scrolled 
          ? 'bg-[#030712]/80 backdrop-blur-xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] py-3' 
          : 'bg-[#030712]/40 backdrop-blur-md border-white/5 py-4'
      }`}
    >
      <div className="px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/">
          <CreovLogo />
        </Link>

        {/* Navigation Links & Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Dynamic Nav Menu Items with premium micro-icons */}
              <div className="flex items-center gap-5 sm:gap-6">
                
                {/* Generate Link */}
                <Link 
                  href="/generate" 
                  className={`relative text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5 ${
                    isActive('/generate') ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  <span>Generate</span>
                  {isActive('/generate') && (
                    <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
                  )}
                </Link>

                {/* Templates Link */}
                <Link 
                  href="/templates" 
                  className={`relative text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5 ${
                    isActive('/templates') ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18M9 21V9"/>
                  </svg>
                  <span>Templates</span>
                  {isActive('/templates') && (
                    <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
                  )}
                </Link>

                {/* Dashboard Link (Restored) */}
                <Link 
                  href="/dashboard" 
                  className={`relative text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="9" rx="1"/>
                    <rect x="14" y="3" width="7" height="5" rx="1"/>
                    <rect x="14" y="12" width="7" height="9" rx="1"/>
                    <rect x="3" y="16" width="7" height="5" rx="1"/>
                  </svg>
                  <span>Dashboard</span>
                  {isActive('/dashboard') && (
                    <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
                  )}
                </Link>

              </div>

              {/* User Dropdown / Controls */}
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex flex-col text-right hidden md:flex">
                  <span className="text-[10px] text-slate-500 font-mono">PORTAL ACCESS</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/15 hover:bg-red-500/20 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="relative overflow-hidden px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 transition-all duration-300 group-hover:opacity-90 shadow-[0_4px_20px_rgba(6,182,212,0.25)]" />
              <span className="relative z-10">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}