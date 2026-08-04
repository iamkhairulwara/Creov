'use client'

import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'

export default function Docs() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 pt-36 pb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-950/20 mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                Documentation
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              How to use <span className="text-purple-400">Creov</span>
            </h1>
            <p className="text-slate-400 text-lg font-light max-w-xl mx-auto">
              Learn how to get the most out of our AI engine to generate stunning websites in seconds.
            </p>
          </div>

          <div className="space-y-12">
            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">Writing the Perfect Prompt</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                The key to getting a great website is being specific about your brand's vibe, industry, and the content you want on the page. 
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400">
                <li><strong className="text-white">Be descriptive:</strong> "A dark-themed portfolio for a 3D artist with neon green accents."</li>
                <li><strong className="text-white">Include sections:</strong> "Make sure to include an About Me, Services, and Contact section."</li>
                <li><strong className="text-white">Specify style:</strong> Mention keywords like "minimalist", "brutalism", "glassmorphism", or "corporate".</li>
              </ul>
            </section>

            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">Refining Your Design</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                If the first generation isn't perfect, don't worry! Use the Refine feature to tell the AI exactly what to change.
              </p>
              <div className="bg-[#0a0f24] p-4 rounded-xl border border-white/10 font-mono text-sm text-cyan-300">
                Example: "Make the hero text larger, change the background to a lighter shade of blue, and add rounded corners to the buttons."
              </div>
            </section>

            <section className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-4">Publishing & Exporting</h2>
              <p className="text-slate-400 leading-relaxed">
                Once you are happy with your generated site, you can instantly publish it to a public URL on the Creov domain, or export the raw HTML/CSS files to host it anywhere you like. You can manage all your sites from the Dashboard.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
