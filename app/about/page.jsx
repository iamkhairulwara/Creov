'use client'
import Link from "next/link"
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'

const CpuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
)

const PenToolIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
)

const ZapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const values = [
  {
    title: "AI-Powered Innovation",
    description:
      "We leverage artificial intelligence to simplify website creation and help anyone build professional websites in minutes.",
    icon: <CpuIcon />,
  },
  {
    title: "User-Centered Design",
    description:
      "Every feature is designed to make website building intuitive, accessible, and enjoyable for everyone.",
    icon: <PenToolIcon />,
  },
  {
    title: "Speed & Simplicity",
    description:
      "From AI-powered generation and visual editing to seamless deployment, Creov delivers a fast, efficient, and intuitive website-building experience.",
    icon: <ZapIcon />,
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 text-sm text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            About Creov
          </span>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Building the Future of
            <span className="text-cyan-400"> Website Creation</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400 leading-relaxed font-light">
            Creov is an AI-powered website builder that transforms simple
            text prompts into beautiful, responsive, and customizable
            websites. From AI-powered generation and intuitive visual
            editing to seamless deployment, Creov provides an end-to-end
            platform for creating and publishing websites with ease. Our
            mission is to make professional web development accessible to
            everyone by combining the power of artificial intelligence with
            a user-friendly editing experience, eliminating the need for
            extensive coding knowledge.
          </p>
        </section>

        {/* Our Story */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-10 md:p-14">
            <h2 className="text-4xl font-bold mb-6 tracking-tight font-[family-name:var(--font-space-grotesk)]">Our Story</h2>

            <p className="text-slate-400 leading-8 font-light">
              Creov was created with a simple goal: to remove the complexity
              of website development. Instead of spending hours designing
              layouts and writing code, users can simply describe the
              website they want, and Creov generates a professional,
              responsive website in seconds using AI. After generation,
              users can customize every aspect of their website through an
              intuitive visual editor and deploy it with ease, making the
              journey from idea to a live website fast, efficient, and
              accessible.
            </p>

            <p className="mt-6 text-slate-400 leading-8 font-light">
              Whether you're creating a portfolio, business website,
              landing page, or e-commerce site, Creov provides everything
              you need in one platform — from AI-powered generation and
              visual customization to deployment — helping you build and
              launch professional websites with confidence.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <h2 className="text-4xl font-bold text-center mb-12 tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Our Core Values
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-shadow">
                  {value.icon}
                </div>

                <h3 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">{value.title}</h3>

                <p className="mt-4 text-slate-400 leading-relaxed font-light text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-center tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Our Mission
              </h2>

              <p className="mt-6 text-center text-lg text-slate-300 max-w-3xl mx-auto leading-8 font-light">
                We believe everyone should be able to create, customize, and
                deploy professional websites without needing extensive
                technical knowledge. By combining artificial intelligence, a
                powerful visual editor, and seamless deployment, Creov
                empowers creators, businesses, students, and entrepreneurs
                to bring their ideas online faster, smarter, and with
                complete creative freedom.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
              Ready to Build Your Website?
            </h2>

            <p className="mt-5 text-slate-400 font-light">
              Start creating, customizing, and deploying beautiful websites
              with Creov's AI-powered platform.
            </p>

            <Link
              href="/generate"
              className="inline-flex items-center justify-center mt-8 rounded-xl bg-cyan-500 px-8 py-3.5 font-semibold text-[#030712] hover:bg-cyan-400 transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] font-[family-name:var(--font-space-grotesk)]"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}