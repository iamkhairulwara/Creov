'use client'
import Link from 'next/link'
import CreovLogo from '@/components/ui/CREOVLOGO'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030712] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12 mb-16">

          {/* Brand info column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="w-fit">
              <CreovLogo />
            </Link>
            <p className="text-sm text-slate-400 font-light leading-relaxed max-w-sm">
              An AI website builder that turns plain-English prompts into ready-to-host sites.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 items-center">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.8c0-1.2-.4-2.2-1-3 2.5-.3 5-1.2 5-5.6 0-1.2-.4-2.3-1.1-3.1.1-.3.5-1.5-.1-3.1 0 0-.9-.3-3 1.1-1-.3-2-.4-3-.4s-2 .1-3 .4c-2.1-1.4-3-1.1-3-1.1-.6 1.6-.2 2.8-.1 3.1-.7.8-1.1 1.9-1.1 3.1 0 4.4 2.5 5.3 5 5.6-.6.5-1 1.4-1 2.8V21"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold text-white font-[family-name:var(--font-space-grotesk)]">Product</span>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link href="/generate" className="hover:text-cyan-400 transition-colors duration-200">AI Generator</Link>
              <Link href="/editor" className="hover:text-cyan-400 transition-colors duration-200">Visual Editor</Link>
              <Link href="/templates" className="hover:text-cyan-400 transition-colors duration-200">Templates</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Integrations</Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold text-white font-[family-name:var(--font-space-grotesk)]">Resources</span>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Documentation</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Blog</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Community</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Help Center</Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold text-white font-[family-name:var(--font-space-grotesk)]">Company</span>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">About Us</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Contact</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Privacy Policy</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 text-xs text-slate-500">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 font-light">
            <span>© 2026 Creov. All rights reserved.</span>
            <div className="hidden md:flex gap-6">
              <Link href="#" className="hover:text-white transition-colors duration-200">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors duration-200">GitHub</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
