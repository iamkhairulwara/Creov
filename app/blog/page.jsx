'use client'
import Link from "next/link"
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'

const RocketIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

const FileTextIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const categoryColors = {
  'AI': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Tutorial': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Design': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Development': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Marketing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Updates': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Featured': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

const featuredPost = {
  title: "How AI Can Build a Professional Website in Minutes",
  description:
    "Discover how Creov transforms simple text prompts into beautiful, responsive websites without writing a single line of code.",
  category: "Featured",
  date: "August 2026",
  readTime: "5 min read",
}

const posts = [
  {
    title: "10 AI Prompts for Better Website Designs",
    category: "AI",
    readTime: "4 min read",
  },
  {
    title: "Build Your Portfolio Website with Creov",
    category: "Tutorial",
    readTime: "6 min read",
  },
  {
    title: "Top Web Design Trends of 2026",
    category: "Design",
    readTime: "5 min read",
  },
  {
    title: "Export Your Website Like a Pro",
    category: "Development",
    readTime: "7 min read",
  },
  {
    title: "Improve Landing Page Conversions",
    category: "Marketing",
    readTime: "5 min read",
  },
  {
    title: "What's New in Creov",
    category: "Updates",
    readTime: "3 min read",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-36 pb-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 text-sm text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Creov Blog
          </span>

          <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-tight tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Insights for
            <span className="text-cyan-400"> Modern Website Builders</span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg font-light">
            Explore tutorials, AI website creation tips, design inspiration,
            development guides, and product updates from the Creov team.
          </p>
        </section>

        {/* Featured Article */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden md:grid md:grid-cols-2 group hover:border-cyan-500/20 transition-colors duration-300">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/5 flex items-center justify-center min-h-[320px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08)_0%,transparent_70%)]" />
              <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.15)] group-hover:scale-110 transition-transform duration-500">
                <RocketIcon className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <div className="p-10 flex flex-col justify-center">
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border w-fit ${categoryColors[featuredPost.category]}`}>
                {featuredPost.category}
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                {featuredPost.title}
              </h2>

              <p className="mt-6 text-slate-400 leading-relaxed font-light">
                {featuredPost.description}
              </p>

              <div className="mt-6 text-sm text-slate-500 font-mono text-xs">
                {featuredPost.date} &middot; {featuredPost.readTime}
              </div>

              <Link
                href="#"
                className="mt-8 w-fit rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-[#030712] hover:bg-cyan-400 transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:scale-[1.02] text-sm font-[family-name:var(--font-space-grotesk)]"
              >
                Read Article
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">Latest Articles</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-cyan-500/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-40 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 mb-6 flex items-center justify-center group-hover:border-cyan-500/10 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                    <FileTextIcon className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${categoryColors[post.category] || 'bg-white/5 text-slate-400 border-white/10'}`}>
                  {post.category}
                </span>

                <h3 className="mt-3 text-lg font-bold font-[family-name:var(--font-space-grotesk)]">
                  {post.title}
                </h3>

                <p className="mt-4 text-slate-400 text-sm font-light leading-relaxed">
                  Learn practical tips and best practices to create better
                  websites with AI and modern web technologies.
                </p>

                <div className="mt-6 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                    {post.readTime}
                  </span>

                  <Link
                    href="#"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
          <h2 className="text-4xl font-bold mb-10 tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Explore Categories
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "AI",
              "Tutorials",
              "Design",
              "Development",
              "Updates",
              "Business",
            ].map((item) => (
              <button
                key={item}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-6 py-3 text-sm font-semibold hover:bg-cyan-500 hover:text-[#030712] hover:border-transparent transition-all duration-300"
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
                Stay Updated
              </h2>

              <p className="mt-5 text-slate-300 max-w-2xl mx-auto font-light">
                Get the latest AI website building tips, tutorials,
                design inspiration, and product updates directly in
                your inbox.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-xl bg-[#0a0f1a] border border-white/10 px-6 py-4 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 w-full sm:w-96 transition-all text-sm"
                />

                <button className="rounded-xl bg-cyan-500 px-8 py-4 text-[#030712] font-semibold hover:bg-cyan-400 transition-all duration-300 shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:scale-[1.02] font-[family-name:var(--font-space-grotesk)]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}