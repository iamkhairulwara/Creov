'use client'
import Link from "next/link"
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'

const MessageCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const CodeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const LightbulbIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5C8.26 12.26 8.72 13.02 8.91 14" />
  </svg>
)

const communityCards = [
  {
    title: "Discord Community",
    description:
      "Chat with other creators, ask questions, and get support from the community.",
    icon: <MessageCircleIcon />,
    href: "#",
  },
  {
    title: "GitHub",
    description:
      "Explore the project, report bugs, and contribute to Creov's development.",
    icon: <CodeIcon />,
    href: "https://github.com/iamkhairulwara/Creov/tree/master",
  },
  {
    title: "Feature Requests",
    description:
      "Have an idea? Share your feature requests and help shape the platform.",
    icon: <LightbulbIcon />,
    href: "#",
  },
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 text-sm text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Community
          </span>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Build Together with{" "}
            <span className="text-cyan-400">Creov</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400 font-light">
            Connect with designers, developers, and creators using Creov.
            Share ideas, get support, and help shape the future of AI-powered
            website building.
          </p>
        </section>

        {/* Community Cards */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="grid gap-8 md:grid-cols-3">
            {communityCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 group block"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-shadow">
                  {card.icon}
                </div>

                <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">{card.title}</h2>

                <p className="mt-4 text-slate-400 leading-relaxed font-light text-sm">
                  {card.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Why Join */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12">
            <h2 className="text-4xl font-bold text-center tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Why Join Our Community?
            </h2>

            <div className="grid gap-8 md:grid-cols-3 mt-12">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 font-[family-name:var(--font-space-grotesk)]">
                  Learn
                </h3>
                <p className="mt-3 text-slate-400 font-light text-sm leading-relaxed">
                  Access tutorials, guides, and best practices for building
                  modern websites with AI.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 font-[family-name:var(--font-space-grotesk)]">
                  Collaborate
                </h3>
                <p className="mt-3 text-slate-400 font-light text-sm leading-relaxed">
                  Meet developers and designers, exchange ideas, and work
                  together on exciting projects.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-cyan-400 font-[family-name:var(--font-space-grotesk)]">
                  Grow
                </h3>
                <p className="mt-3 text-slate-400 font-light text-sm leading-relaxed">
                  Stay updated with new features, releases, and opportunities
                  to improve your workflow.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Ready to Join?
              </h2>

              <p className="mt-5 text-slate-300 font-light">
                Become part of the Creov community and help shape the future of
                AI-powered website creation.
              </p>

              <Link
                href="/generate"
                className="inline-flex items-center justify-center mt-8 rounded-xl bg-cyan-500 px-8 py-3.5 font-semibold text-[#030712] hover:bg-cyan-400 transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] font-[family-name:var(--font-space-grotesk)]"
              >
                Start Building
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}