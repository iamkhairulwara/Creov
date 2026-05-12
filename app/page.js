'use client'
import Link from 'next/link'
import Navbar from '@/components/ui/NAVBAR'

const BG = '#060a1a'
const CARD_BG = 'rgba(255,255,255,0.02)'
const CARD_BORDER = 'rgba(255,255,255,0.06)'
const CARD_BORDER_HOVER = 'rgba(34,211,238,0.2)'
const CYAN = '#22d3ee'
const CYAN_DARK = '#06b6d4'
const TEXT_SECONDARY = '#94a3b8'
const TEXT_MUTED = '#64748b'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Glow blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/4 w-100 h-100 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(2,132,199,0.08), transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-75 h-75 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)' }} />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(rgba(34,211,238,0.6) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />

        <div className="max-w-5xl mx-auto px-6 pt-36 pb-28 text-center">

         

          {/* Heading */}
          <h1 className="text-3xl md:text-7xl font-extrabold leading-none tracking-tight mb-6">
            <span className="text-white">Build websites</span>
            <br />
            <span style={{
              background: 'linear-gradient(90deg, #22d3ee, #38bdf8, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              with AI in seconds
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: TEXT_SECONDARY }}>
            Describe your website in plain English, pick a template, or let AI generate
            one for you. Edit visually with drag and drop. Export clean code instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                boxShadow: '0 0 35px rgba(6,182,212,0.35)'
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Generate with AI
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl border transition-all text-sm hover:bg-white/5"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
              Browse Templates
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { value: '10+', label: 'Templates' },
            
              { value: '100%', label: 'Free Export' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold" style={{ color: CYAN }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-28 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
            <p style={{ color: TEXT_MUTED }}>From idea to website in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                title: 'Describe or Choose',
                desc: 'Type what you need in plain language or browse our template library across multiple categories.'
              },
              {
                step: '02',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                title: 'Edit Visually',
                desc: 'Drag and drop elements, change text, images and colors. No coding required whatsoever.'
              },
              {
                step: '03',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
                title: 'Export Clean Code',
                desc: 'Download your website as clean HTML, CSS and JS files. Host anywhere you want.'
              }
            ].map(item => (
              <div
                key={item.step}
                className="p-7 rounded-2xl border transition-all group"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}
                onMouseEnter={e => e.currentTarget.style.borderColor = CARD_BORDER_HOVER}
                onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.12)', color: CYAN_DARK }}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: CYAN_DARK }}>
                    Step {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-25">
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need</h2>
            <p style={{ color: TEXT_MUTED }}>Professional tools built for speed and simplicity</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'AI Generation', desc: 'Generate complete websites from a single prompt using Gemini AI.' },
              { icon: '🎨', title: 'Visual Editor', desc: 'Drag and drop editor powered by GrapesJS for full customization.' },
              { icon: '📁', title: 'Template Library', desc: 'Professionally designed templates across multiple categories.' },
              { icon: '📱', title: 'Responsive Design', desc: 'Every website looks perfect on desktop, tablet and mobile.' },
              { icon: '💾', title: ' Save', desc: 'Save your webiste after editing to your requirement.' },
              { icon: '📦', title: 'Clean Export', desc: 'Export as a ZIP with clean HTML, CSS and JS files.' },
            ].map(f => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border transition-all cursor-default"
                style={{ background: CARD_BG, borderColor: CARD_BORDER }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = CARD_BORDER_HOVER
                  e.currentTarget.style.background = 'rgba(6,182,212,0.04)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = CARD_BORDER
                  e.currentTarget.style.background = CARD_BG
                }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-px"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(2,132,199,0.1), rgba(6,182,212,0.3))' }}>
          <div
            className="rounded-3xl px-10 py-16 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(2,132,199,0.05))' }}>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to build your website?
            </h2>
            <p className="mb-8 text-sm" style={{ color: TEXT_SECONDARY }}>
              Create your first website in minutes. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-sm"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }}>
                Get Started Free
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center justify-center font-semibold px-8 py-3 rounded-xl border transition-all text-sm hover:bg-white/5"
                style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#cbd5e1' }}>
                Browse Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: 'rgba(255,255,255,0.04)', color: TEXT_MUTED }}>
        © 2026 Creov. All rights reserved.
      </footer>
    </div>
  )
}