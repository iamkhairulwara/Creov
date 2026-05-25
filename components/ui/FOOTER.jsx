'use client'
import Link from 'next/link'
import CreovLogo from '@/components/ui/CREOVLOGO'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030712] relative overflow-hidden">
      {/* Subtle lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.01] to-violet-600/[0.01] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand info column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="w-fit">
              <CreovLogo />
            </Link>
            <p className="text-xs text-slate-500 font-light leading-relaxed max-w-sm">
              An advanced AI-powered visual web synthesis platform. Create fully responsive, high-fidelity landing pages from plain English text in seconds.
            </p>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">Platform</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <Link href="/generate" className="hover:text-white transition-colors duration-200 font-light">AI Generator</Link>
              <Link href="/templates" className="hover:text-white transition-colors duration-200 font-light">Template Catalog</Link>
              <Link href="/editor" className="hover:text-white transition-colors duration-200 font-light">Visual Workspace</Link>
            </div>
          </div>

          {/* Powered By Details */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 font-mono">Technology</span>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-mono">
              <span className="font-light">Google Gemini AI</span>
              <span className="font-light">Supabase Auth & DB</span>
              <span className="font-light">GrapesJS Editor</span>
              <span className="font-light">Next.js Framework</span>
            </div>
          </div>

          {/* FYP Badge Details */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 font-mono">Project Scope</span>
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 text-[10px] text-slate-400">
              <span className="font-semibold text-slate-200">FYP 2026</span>
              <span className="font-light">Final Year Project</span>
              <span className="text-[9px] text-slate-500 font-light leading-relaxed mt-1">
                Completed with full dynamic synthesis and active custom components.
              </span>
            </div>
          </div>

        </div>

        {/* Footer bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-light">
            <span>© 2026 Creov Builder. Synthesized for FYP with passion.</span>
          </div>
          <div className="flex gap-6 font-light">
            <Link href="/" className="hover:text-white transition-colors duration-200">System Gateway</Link>
            <Link href="/" className="hover:text-white transition-colors duration-200">Architecture</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
