'use client'
import Link from 'next/link'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import MagneticButton from '@/components/ui/MagneticButton'

// Icons
const ZapIcon = () => <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
const PaletteIcon = () => <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
const FolderIcon = () => <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
const SmartphoneIcon = () => <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
const PackageIcon = () => <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Snappy typing

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const bentoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-32 overflow-hidden">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-5xl mx-auto px-6 pt-32 pb-16 text-center relative z-10"
        >
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8 font-[family-name:var(--font-space-grotesk)] text-white max-w-4xl mx-auto">
            Your idea. A live website. <br />
            <span className="text-cyan-400">
              No code in between.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-slate-400 font-light leading-relaxed">
            Describe your idea in plain English. Creov generates a fully responsive site in seconds — then refine it visually and export clean, ready-to-host code.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
            <MagneticButton as="link" href="/generate" magneticStrength={0.15}>
              <div className="relative flex items-center justify-center gap-2 text-[#030712] font-semibold px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-colors hover:scale-[1.02] shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)]">
                <span className="font-[family-name:var(--font-space-grotesk)] text-base">Generate a site</span>
              </div>
            </MagneticButton>

            <MagneticButton as="link" href="/templates" magneticStrength={0.1}>
              <div className="flex items-center justify-center gap-2 font-[family-name:var(--font-space-grotesk)] text-base font-medium px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:scale-[1.02] transition-all">
                Browse Templates
              </div>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Browser Mockup with Parallax and Soft Glow */}
        <motion.div
          style={{ y: yParallax }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto rounded-t-2xl border-t border-l border-r border-white/10 bg-[#0a0f1a] overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.05)]"
        >
          {/* Browser Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-2 px-4 pt-3 bg-[#060913]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>
            <div className="px-10 py-1.5 bg-white/5 rounded-md text-[10px] text-slate-500 font-medium font-sans">
              creov.app/workspace
            </div>
            <div className="w-12" />
          </div>

          {/* Canvas Interface */}
          <div className="grid grid-cols-12 gap-4 h-[400px] text-left p-4">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-white/5 pr-4 flex flex-col gap-3">
              <div className="h-4 bg-white/5 rounded-md w-1/2" />
              <div className="h-4 bg-white/5 rounded-md w-full" />
              <div className="h-4 bg-white/5 rounded-md w-4/5" />
              <div className="h-px bg-white/5 my-2" />
              
              {/* Prompt Input Box */}
              <div className="mt-auto bg-[#030712] border border-white/10 rounded-lg p-3">
                <p className="text-xs text-cyan-400 font-mono">
                  &gt; <TypewriterText text="Create a dark-mode portfolio for a freelance designer with a bento grid layout." />
                </p>
              </div>
            </div>

            {/* Main Canvas - Filled to look like a Bento Grid Portfolio */}
            <div className="col-span-9 bg-[#030712] rounded-xl border border-white/5 p-6 flex flex-col gap-4 relative overflow-hidden opacity-90">
               {/* Nav Mockup */}
               <div className="flex justify-between items-center mb-2">
                 <div className="h-5 w-24 bg-white/10 rounded" />
                 <div className="flex gap-3">
                   <div className="h-4 w-12 bg-white/5 rounded" />
                   <div className="h-4 w-12 bg-white/5 rounded" />
                 </div>
               </div>
               
               {/* Hero Section */}
               <div className="flex gap-4">
                 <div className="w-2/3 h-40 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 p-5 flex flex-col justify-end">
                   <div className="h-8 w-3/4 bg-white/10 rounded mb-3" />
                   <div className="h-4 w-1/2 bg-white/5 rounded mb-2" />
                   <div className="h-4 w-2/5 bg-white/5 rounded" />
                 </div>
                 <div className="w-1/3 h-40 rounded-xl bg-cyan-500/10 border border-cyan-500/20 p-4 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-cyan-500/20 mb-3 flex items-center justify-center text-cyan-400">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                   </div>
                   <div className="h-3 w-20 bg-cyan-500/40 rounded" />
                 </div>
               </div>

               {/* Bento Bottom Row */}
               <div className="flex gap-4">
                 <div className="w-1/3 h-28 rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
                    <div className="h-8 w-8 bg-white/5 rounded-lg" />
                 </div>
                 <div className="w-1/3 h-28 rounded-xl bg-white/[0.02] border border-white/5 p-4 flex flex-col justify-between">
                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                    <div className="flex gap-2"><div className="h-6 w-12 bg-white/5 rounded-full" /><div className="h-6 w-12 bg-white/5 rounded-full" /></div>
                 </div>
                 <div className="w-1/3 h-28 rounded-xl bg-cyan-900/20 border border-cyan-500/10 p-4 flex flex-col items-center justify-center">
                    <div className="h-8 w-24 bg-cyan-500 rounded-lg opacity-80" />
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── VISUAL PIPELINE ── */}
      <section className="py-24 bg-[#030712] border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
              The Architecture of Instant Creation
            </h2>
            <p className="mt-4 text-slate-400 font-light max-w-2xl mx-auto">Watch how a single natural language prompt flows through our AI engine to become production-ready code.</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-12 right-12 h-px bg-white/10 -translate-y-1/2 z-0 overflow-hidden">
               <div className="h-full bg-cyan-400 w-full animate-[progress_3s_ease-in-out_infinite]" style={{ transformOrigin: 'left', animation: 'progress 3s ease-in-out infinite' }} />
            </div>

            {/* Node 1 */}
            <div className="relative z-10 flex flex-col items-center bg-[#030712] p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors">
                <svg className="text-slate-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="text-white font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Natural Language</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 text-center w-32 leading-relaxed">You describe your vision in plain English.</p>
            </div>

            {/* Node 2 */}
            <div className="relative z-10 flex flex-col items-center bg-[#030712] p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,211,238,0.15)] relative">
                <div className="absolute inset-0 border border-cyan-400 rounded-2xl animate-ping opacity-20" />
                <ZapIcon />
              </div>
              <h3 className="text-cyan-400 font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Creov AI Engine</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 text-center w-32 leading-relaxed">Parses intent and generates the architecture.</p>
            </div>

            {/* Node 3 */}
            <div className="relative z-10 flex flex-col items-center bg-[#030712] p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors">
                <PaletteIcon />
              </div>
              <h3 className="text-white font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Visual Canvas</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 text-center w-32 leading-relaxed">Live rendering of HTML/CSS for visual editing.</p>
            </div>

            {/* Node 4 */}
            <div className="relative z-10 flex flex-col items-center bg-[#030712] p-4 rounded-xl group hover:scale-105 transition-transform">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.02)] group-hover:border-white/20 transition-colors">
                <PackageIcon />
              </div>
              <h3 className="text-white font-bold text-sm font-[family-name:var(--font-space-grotesk)]">Production Code</h3>
              <p className="text-[11px] text-slate-500 mt-1.5 text-center w-32 leading-relaxed">Export ready-to-host static files.</p>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes progress {
            0% { transform: scaleX(0); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: scaleX(1); opacity: 0; }
          }
        `}</style>
      </section>

      {/* ── HOW IT WORKS (The Process) ── */}
      <section className="py-32 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="text-center mb-20"
          >
            <motion.span variants={bentoVariants} className="text-xs font-bold uppercase tracking-widest text-cyan-500 font-mono">
              The Process
            </motion.span>
            <motion.h2 variants={bentoVariants} className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4 font-[family-name:var(--font-space-grotesk)]">
              From prompt to published site in three steps
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                step: '01',
                title: 'Describe & Ideate',
                desc: 'Type your requirements in natural language. Creov reads your intent and builds the layout, colors, and content to match.',
                icon: <ZapIcon />
              },
              {
                step: '02',
                title: 'Edit & Tailor Visually',
                desc: 'Click-to-edit every element — text, color, image, layout — no code required using our visual canvas.',
                icon: <PaletteIcon />
              },
              {
                step: '03',
                title: 'Export Production Code',
                desc: 'Download a complete, dependency-free site — host it anywhere with clean HTML, CSS, and JS.',
                icon: <PackageIcon />
              }
            ].map((item) => (
              <motion.div
                variants={bentoVariants}
                key={item.step}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col group hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-bold text-white text-xl mb-3 font-[family-name:var(--font-space-grotesk)]">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="py-32 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
              Everything You Need
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[550px]"
          >
            {/* Box 1: AI Engine (Large 2x2) */}
            <motion.div
              variants={bentoVariants}
              className="md:col-span-2 md:row-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-8 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                  <ZapIcon />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">AI Design Engine</h3>
                <p className="text-slate-400 font-light text-sm max-w-sm">
                  Generates full page layouts — structure, color palette, and copy — from a single prompt.
                </p>
              </div>

              {/* Vendor Neutral Syntax Highlight Block */}
              <div className="mt-8 rounded-lg bg-[#010308] border border-white/5 p-5 font-mono text-[11px] overflow-hidden relative">
                <div className="flex gap-1.5 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="space-y-2 opacity-90">
                  <p><span className="text-slate-500">{"// Initialize layout engine"}</span></p>
                  <p><span className="text-pink-400">const</span> engine = <span className="text-cyan-400">new</span> CreovEngine();</p>
                  <p className="mt-2"><span className="text-slate-500">{"// Parse prompt to AST"}</span></p>
                  <p><span className="text-pink-400">const</span> structure = <span className="text-blue-400">await</span> engine.<span className="text-yellow-200">parse</span>(prompt);</p>
                  <p className="mt-2"><span className="text-slate-500">{"// Render live DOM"}</span></p>
                  <p><span className="text-pink-400">const</span> dom = <span className="text-blue-400">await</span> engine.<span className="text-yellow-200">renderToCanvas</span>(structure);</p>
                  <p><span className="text-cyan-400">console</span>.<span className="text-yellow-200">log</span>(<span className="text-green-300">&quot;Layout ready: 100%&quot;</span>);</p>
                </div>
              </div>
            </motion.div>

            {/* Box 2: Visual Canvas (Medium) */}
            <motion.div
              variants={bentoVariants}
              className="md:col-span-2 md:row-span-1 rounded-2xl border border-white/5 bg-white/[0.02] p-8 flex items-center justify-between"
            >
              <div className="max-w-[220px]">
                <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">Visual Canvas</h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Click-to-edit every element — text, color, image, layout — no code required.
                </p>
              </div>
              <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                <PaletteIcon />
              </div>
            </motion.div>

            {/* Box 3: Templates (Small) */}
            <motion.div
              variants={bentoVariants}
              className="md:col-span-1 md:row-span-1 rounded-md border border-white/5 bg-white/[0.02] p-6 flex flex-col"
            >
              <FolderIcon />
              <h3 className="text-base font-bold text-white mt-4 mb-1 font-[family-name:var(--font-space-grotesk)]">Curated Templates</h3>
              <p className="text-[11px] text-slate-400 font-light mt-1">Templates built for real use cases — portfolios, startups, agencies.</p>
            </motion.div>

            {/* Box 4: Export (Small) */}
            <motion.div
              variants={bentoVariants}
              className="md:col-span-1 md:row-span-1 rounded-md border border-white/5 bg-white/[0.02] p-6 flex flex-col"
            >
              <PackageIcon />
              <h3 className="text-base font-bold text-white mt-4 mb-1 font-[family-name:var(--font-space-grotesk)]">Clean Export</h3>
              <p className="text-[11px] text-slate-400 font-light mt-1">Download a complete, dependency-free site — host it anywhere.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="py-24 bg-[#030712] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
              Built for every workflow
            </h2>
            <p className="mt-4 text-slate-400 font-light max-w-2xl mx-auto">Whether you&apos;re building alone or scaling an agency, Creov adapts to how you work.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">For Founders</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed mb-6">Stop fighting with CSS when you should be talking to users. Generate your landing page in minutes and start validating your idea immediately.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Launch in hours, not weeks</li>
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> No coding required</li>
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Fully responsive design</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-2xl bg-cyan-900/10 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl" />
              <h3 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)] relative z-10">For Freelancers</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed mb-6 relative z-10">Take on more clients without burning out. Use Creov to generate the boilerplate and structure, then spend your time on the creative polish.</p>
              <ul className="space-y-3 text-sm text-slate-300 relative z-10">
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> 10x your output capacity</li>
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Export clean Tailwind CSS</li>
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Perfect mobile responsiveness</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-4 font-[family-name:var(--font-space-grotesk)]">For Agencies</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed mb-6">Rapidly prototype ideas for client pitches. Export the production-ready code directly to your development team to wire up the backend.</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Instant client prototypes</li>
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Developer-friendly HTML/JS</li>
                <li className="flex items-center gap-2"><svg className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Consistent design systems</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS & TRUST ── */}
      <section className="py-24 bg-[#030712] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
              Trusted by creators worldwide
            </h2>
            <p className="mt-4 text-slate-400 font-light">Join thousands of designers and developers building faster with Creov.</p>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 mb-24 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-3 font-bold text-2xl font-mono tracking-tighter"><div className="w-8 h-8 bg-white rounded-full" /> NEXT.JS</div>
            <div className="flex items-center gap-3 font-bold text-2xl tracking-tight"><div className="w-8 h-8 border-4 border-white transform rotate-45" /> framer</div>
            <div className="flex items-center gap-3 font-bold text-2xl"><div className="w-8 h-8 border-[4px] border-white rounded-full" /> supabase</div>
            <div className="flex items-center gap-3 font-bold text-2xl text-cyan-400"><svg className="w-8 h-8" viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg> React</div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Freelance Designer",
                content: "Creov entirely changed my workflow. What used to take me a week of coding and tweaking in React now takes a single prompt and 10 minutes of visual editing."
              },
              {
                name: "Markus Voller",
                role: "Agency Founder",
                content: "We use Creov to generate rapid prototypes for clients. The fact that it exports clean, dependency-free code means we can hand it right over to our dev team."
              },
              {
                name: "Elena Rodriguez",
                role: "Product Manager",
                content: "The ability to just describe a layout and see it rendered live with perfect Tailwind classes is magical. It's the best AI design tool I've used."
              }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-6 hover:bg-white/[0.04] transition-colors duration-300">
                <div className="flex gap-1 text-cyan-400 text-sm">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <svg key={i} className="text-cyan-400 w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                  </div>
                </div>
                <p className="text-slate-300 font-light leading-relaxed flex-1">&quot;{t.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-[#030712] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-4">
            {[
              {
                q: "What kind of code does Creov export?",
                a: "Creov exports standard HTML, Tailwind CSS, and vanilla JavaScript. No heavy frameworks, no lock-in. Just clean, semantic code you can host anywhere."
              },
              {
                q: "Do I need to know how to code?",
                a: "Not at all. You can generate and visually edit your entire website without writing a single line of code. If you are a developer, you'll love the clean output."
              },
              {
                q: "Is the generated website responsive?",
                a: "Yes! Every layout generated by Creov is fully responsive by default, using Tailwind's mobile-first breakpoint system."
              },
              {
                q: "Can I use custom fonts and colors?",
                a: "Absolutely. Our visual canvas lets you tweak the global design system, including typography, color palettes, and spacing variables."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors duration-300 group">
                <h3 className="text-white font-bold mb-2 group-hover:text-cyan-400 transition-colors">{faq.q}</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#030712]">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/5 bg-white/[0.02] p-12 md:p-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Ready to build your website?
            </h2>
            <p className="mb-10 text-slate-400 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">
              Generate a site, refine it visually, and export clean code — completely free.
            </p>
            <div className="flex justify-center">
              <MagneticButton as="link" href="/auth/signup" magneticStrength={0.1}>
                <div className="inline-flex items-center justify-center text-[#030712] font-semibold px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-colors hover:scale-[1.02] shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)]">
                  <span className="font-[family-name:var(--font-space-grotesk)] text-base">Get Started Free</span>
                </div>
              </MagneticButton>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}