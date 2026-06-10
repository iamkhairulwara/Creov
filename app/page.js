'use client'
import Link from 'next/link'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { motion } from 'framer-motion'

// Icons
const ZapIcon = () => <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const PaletteIcon = () => <svg className="w-8 h-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
const FolderIcon = () => <svg className="w-8 h-8 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
const SmartphoneIcon = () => <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const PackageIcon = () => <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* ── IMMERSIVE HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        
        {/* Futuristic Glowing Background Elements */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Main glowing mesh */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-pink-500/5 blur-[80px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
        </div>

        {/* Cyber Grid Pattern with flow animation */}
        <div 
          className="absolute inset-0 -z-10 opacity-[0.06] animate-grid-flow"
          style={{
            backgroundImage: 'radial-gradient(rgba(34,211,238,0.4) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px'
          }} 
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center relative z-10"
        >
          {/* Micro-badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md mb-8 animate-float">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Introducing Creov Engine 2.0
            </span>
          </div>

          {/* Majestic Title */}
          <h1 className="text-4xl md:text-8xl font-black leading-none tracking-tight mb-8">
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">Build websites</span>
            <br />
            <span className="neon-text-tricolor font-extrabold uppercase inline-block hover:scale-105 transition-transform duration-300">
              with AI in seconds
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed text-slate-300 font-light">
            Describe your idea in plain English, and our advanced AI will instantly synthesize fully responsive, beautiful, single-page sites. Refine visually with our real-time editor and export clean code instantly.
          </p>

          {/* CTAs with Glow Effect */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
            <Link
              href="/generate"
              className="group relative inline-flex items-center justify-center gap-3 text-white font-bold px-8 py-5 rounded-2xl transition-all duration-300 hover:scale-[1.03]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.4)] transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(139,92,246,0.6)]" />
              <span className="relative z-10 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Generate with AI
              </span>
            </Link>
            
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 font-bold px-8 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-slate-200 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
            >
              Browse Templates
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Platform Mockup Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#080c1e]/60 backdrop-blur-2xl p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] glow-cyan transition-all duration-500 hover:border-cyan-500/20 perspective-1000"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="px-10 py-1 bg-white/5 rounded-lg text-[10px] text-slate-500 font-mono">
                creov.app/workspace
              </div>
              <div className="w-4" />
            </div>

            {/* Interactive Grid Mockup representing Visual Editor */}
            <div className="grid grid-cols-12 gap-4 h-[350px] text-left">
              {/* Sidebar */}
              <div className="col-span-3 border-r border-white/5 pr-4 flex flex-col gap-3">
                <div className="h-6 bg-white/5 rounded-lg w-2/3" />
                <div className="h-32 bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider">AI Copilot</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-light group-hover:text-cyan-100 transition-colors">"Creating photography studio layout with glowing buttons."</div>
                  <div className="h-6 bg-cyan-500 rounded-lg w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 w-1/3 skew-x-12 animate-slide-right" />
                  </div>
                </div>
                <div className="h-6 bg-white/5 rounded-lg w-full" />
                <div className="h-6 bg-white/5 rounded-lg w-4/5" />
              </div>

              {/* Central Canvas */}
              <div className="col-span-9 bg-[#030612]/80 border border-white/5 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
                {/* Visual template mock */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-500/5 pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                <div className="flex items-center justify-between z-10">
                  <div className="text-sm font-black tracking-wide text-white">S H U T T E R</div>
                  <div className="flex items-center gap-3">
                    <span className="h-1 bg-white/40 rounded w-8 hover:bg-white transition-colors" />
                    <span className="h-1 bg-white/40 rounded w-8 hover:bg-white transition-colors" />
                    <span className="h-1 bg-cyan-400 rounded w-8 shadow-[0_0_8px_#06b6d4] hover:shadow-[0_0_15px_#06b6d4] transition-shadow" />
                  </div>
                </div>

                <div className="text-center my-auto z-10 transform group-hover:scale-105 transition-transform duration-500">
                  <h2 className="text-2xl font-black mb-2 text-white">Capture Every Moment</h2>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">Professional studio services for artistic minds.</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-bold uppercase tracking-widest text-white rounded-lg shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1">
                    Book Session
                  </button>
                </div>

                <div className="flex justify-between items-center z-10 border-t border-white/5 pt-4">
                  <div className="text-[9px] text-slate-500">© 2026 Shutter Studio</div>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors" />
                    <div className="w-4 h-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS SECTION ── */}
      <section className="py-32 border-t border-white/5 relative bg-[#02050f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-500/20">
              Simple Flow
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-6 mb-4">
              How Creov Works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Synthesize and customize websites in three straightforward steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Describe & Ideate',
                desc: 'Type your requirements in natural language. Our AI parses user intent, layouts, colors, and content structure dynamically.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                )
              },
              {
                step: '02',
                title: 'Edit & Tailor Visually',
                desc: 'Refine designs instantly with our GrapesJS-powered canvas. Swap images, alter typography, and adjust structures visually.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                )
              },
              {
                step: '03',
                title: 'Export Production Code',
                desc: 'Download high-performance, single-page packages as ZIP files containing clean, standalone HTML, CSS, and JS.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                )
              }
            ].map((item, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                key={item.step}
                className="group relative p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/30"
              >
                {/* Glowing step card hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-violet-600/0 to-pink-500/0 opacity-0 group-hover:opacity-[0.03] transition-all duration-500 rounded-3xl" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-500/25 group-hover:scale-105">
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-violet-400">
                    Step {item.step}
                  </span>
                </div>

                <h3 className="font-extrabold text-white text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES SECTION ── */}
      <section className="py-32 border-t border-white/5 bg-[#030712] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-950/30 px-4 py-2 rounded-full border border-violet-500/20 animate-float-delayed">
              Robust Tech
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-6 mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Professional components packed into a seamless, high-performance platform.
            </p>
          </div>

          {/* Premium Bento Grid */}
          <div className="grid grid-cols-12 gap-6 auto-rows-[220px]">
            {/* Box 1: AI Generator (Large) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="col-span-12 md:col-span-7 row-span-2 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-between group overflow-hidden relative hover:border-cyan-500/20 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(6,182,212,0.15)] perspective-1000"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 transform group-hover:translate-z-10 transition-transform duration-300">
                <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all origin-bottom-left inline-block">
                  <ZapIcon />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Gemini AI Synthesis</h3>
                <p className="text-sm text-slate-400 max-w-md font-light leading-relaxed">
                  Generate complete web designs instantly with active section logic. Simply enter your prompt and watch artificial intelligence craft layouts, color theory, and bespoke copy.
                </p>
              </div>
              
              {/* Code visual mock */}
              <div className="h-28 bg-[#030612] rounded-2xl border border-white/5 p-4 font-mono text-[10px] text-cyan-400 overflow-hidden opacity-80 mt-4 relative group-hover:border-cyan-500/30 transition-colors shadow-inner">
                <span className="text-slate-600">// AI Prompt Interpreter</span><br />
                <span className="text-violet-400">const</span> model = genAI.getGenerativeModel(&quot;gemini-2.0-flash&quot;);<br />
                <span className="text-violet-400">const</span> layout = <span className="text-white">await</span> callGemini(geminiPrompt);<br />
                <span className="text-slate-500">console.log(&quot;Layout Synthesized: 100%&quot;);</span>
              </div>
            </motion.div>

            {/* Box 2: Visual Editor */}
            <div className="col-span-12 md:col-span-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-between group hover:border-violet-500/20 transition-all duration-300">
              <div>
                <div className="mb-3"><PaletteIcon /></div>
                <h3 className="text-xl font-bold text-white mb-1.5">Visual Canvas Editor</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Full custom visual editing capability powered by GrapesJS. Swap styles, alignments, and images with simple clicks.
                </p>
              </div>
            </div>

            {/* Box 3: Template Library */}
            <div className="col-span-12 md:col-span-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-between group hover:border-pink-500/20 transition-all duration-300">
              <div>
                <div className="mb-3"><FolderIcon /></div>
                <h3 className="text-xl font-bold text-white mb-1.5">Curated Templates</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Beautiful, pre-built template designs configured across multiple categories for portfolios, startups, and agencies.
                </p>
              </div>
            </div>

            {/* Box 4: Multi-device Responsive (Large) */}
            <div className="col-span-12 md:col-span-5 row-span-1 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-between group hover:border-cyan-500/20 transition-all duration-300">
              <div>
                <div className="mb-3"><SmartphoneIcon /></div>
                <h3 className="text-xl font-bold text-white mb-1.5">Responsive Previews</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Test your designs immediately across Desktop, Tablet, and Mobile viewport modes with real-time scaling and smooth animation testing.
                </p>
              </div>
            </div>

            {/* Box 5: Clean Code ZIP Export */}
            <div className="col-span-12 md:col-span-7 row-span-1 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl p-8 flex flex-col justify-between group hover:border-violet-500/20 transition-all duration-300">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="mb-3"><PackageIcon /></div>
                  <h3 className="text-xl font-bold text-white mb-1.5">Clean Production Export</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Download complete standalone ZIP packages instantly. All assets are packed cleanly inside optimized index.html, styles.css, and index.js files. Host anywhere with zero dependencies.
                  </p>
                </div>
                <div className="w-32 h-20 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-slate-500 font-mono flex-shrink-0 animate-float">
                  index.zip
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#02050f]">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        <div
          className="max-w-4xl mx-auto rounded-3xl p-[1px]"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(139,92,246,0.1), rgba(236,72,153,0.3))' }}>
          <div
            className="rounded-3xl px-8 py-20 text-center bg-[#040818]/90 backdrop-blur-3xl border border-white/5 relative">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to build your website?
            </h2>
            <p className="mb-10 text-slate-400 text-sm md:text-base max-w-lg mx-auto font-light leading-relaxed">
              Synthesize elegant designs, visual edits, and download clean packages instantly. Absolutely free.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="group relative inline-flex items-center justify-center text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 rounded-xl shadow-[0_4px_25px_rgba(6,182,212,0.3)] group-hover:shadow-[0_4px_35px_rgba(139,92,246,0.5)]" />
                <span className="relative z-10">Get Started Free</span>
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center justify-center font-bold px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-slate-200 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reusable Footer Component */}
      <Footer />
    </div>
  )
}