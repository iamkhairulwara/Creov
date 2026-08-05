'use client'
import Link from "next/link"
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'

const RocketIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

const BotIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
)

const PaletteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
)

const LayoutTemplateIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const WrenchIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const helpCards = [
  {
    title: "Getting Started",
    description:
      "Learn how to create your first AI-generated website with Creov.",
    icon: <RocketIcon />,
  },
  {
    title: "AI Generator",
    description:
      "Understand how prompts work and generate professional websites effortlessly.",
    icon: <BotIcon />,
  },
  {
    title: "Visual Editor",
    description:
      "Customize layouts, colors, typography, and components using the visual editor.",
    icon: <PaletteIcon />,
  },
  {
    title: "Templates",
    description:
      "Browse and customize professionally designed website templates.",
    icon: <LayoutTemplateIcon />,
  },
  {
    title: "Publishing",
    description:
      "Export and deploy your website with confidence using Creov.",
    icon: <GlobeIcon />,
  },
  {
    title: "Troubleshooting",
    description:
      "Find solutions to common issues and frequently asked questions.",
    icon: <WrenchIcon />,
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 text-sm text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Help Center
          </span>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
            How Can We <span className="text-cyan-400">Help?</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400 font-light">
            Browse our guides, tutorials, and FAQs to get the most out of
            Creov's AI website builder.
          </p>
        </section>

        {/* Help Topics */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <h2 className="text-4xl font-bold mb-10 text-center tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Popular Topics
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {helpCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-shadow">
                  {card.icon}
                </div>

                <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">{card.title}</h3>

                <p className="mt-4 text-slate-400 leading-relaxed font-light text-sm">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 md:p-14">
            <h2 className="text-3xl font-bold text-center mb-10 tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div className="border-b border-white/5 pb-8">
                <h3 className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)]">
                  Do I need coding experience?
                </h3>
                <p className="mt-3 text-slate-400 font-light leading-relaxed text-sm">
                  No. Creov generates websites from simple text prompts, and you
                  can customize everything using the visual editor.
                </p>
              </div>

              <div className="border-b border-white/5 pb-8">
                <h3 className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)]">
                  Can I edit my website after generation?
                </h3>
                <p className="mt-3 text-slate-400 font-light leading-relaxed text-sm">
                  Yes. You can modify layouts, text, colors, images, and other
                  elements using the built-in editor.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)]">
                  Can I export my website?
                </h3>
                <p className="mt-3 text-slate-400 font-light leading-relaxed text-sm">
                  Yes. Creov allows you to export your website so you can host it
                  wherever you like.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Still Need Help?
              </h2>

              <p className="mt-5 text-slate-300 font-light">
                If you couldn't find the answer you're looking for, our team is
                here to help.
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center mt-8 rounded-xl bg-cyan-500 px-8 py-3.5 font-semibold text-[#030712] hover:bg-cyan-400 transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] font-[family-name:var(--font-space-grotesk)]"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}