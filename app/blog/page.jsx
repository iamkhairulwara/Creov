import Link from "next/link";

const featuredPost = {
  title: "How AI Can Build a Professional Website in Minutes",
  description:
    "Discover how Creov transforms simple text prompts into beautiful, responsive websites without writing a single line of code.",
  category: "Featured",
  date: "August 2026",
  readTime: "5 min read",
};

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
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          Creov Blog
        </span>

        <h1 className="mt-8 text-5xl md:text-7xl font-bold leading-tight">
          Insights for
          <span className="text-cyan-400"> Modern Website Builders</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg">
          Explore tutorials, AI website creation tips, design inspiration,
          development guides, and product updates from the Creov team.
        </p>
      </section>

      {/* Featured Article */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden md:grid md:grid-cols-2">

          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 flex items-center justify-center min-h-[320px]">
            <span className="text-7xl">🚀</span>
          </div>

          <div className="p-10 flex flex-col justify-center">
            <span className="text-cyan-400 text-sm uppercase tracking-wider">
              {featuredPost.category}
            </span>

            <h2 className="mt-4 text-4xl font-bold">
              {featuredPost.title}
            </h2>

            <p className="mt-6 text-slate-400 leading-relaxed">
              {featuredPost.description}
            </p>

            <div className="mt-6 text-sm text-slate-500">
              {featuredPost.date} • {featuredPost.readTime}
            </div>

            <Link
              href="#"
              className="mt-8 w-fit rounded-full bg-cyan-500 px-6 py-3 font-medium text-black hover:bg-cyan-400 transition"
            >
              Read Article
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold">Latest Articles</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-cyan-500/40 hover:-translate-y-1 transition duration-300"
            >
              <div className="h-40 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/10 mb-6 flex items-center justify-center text-4xl">
                📄
              </div>

              <span className="text-cyan-400 text-sm">
                {post.category}
              </span>

              <h3 className="mt-3 text-xl font-semibold">
                {post.title}
              </h3>

              <p className="mt-4 text-slate-400 text-sm">
                Learn practical tips and best practices to create better
                websites with AI and modern web technologies.
              </p>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {post.readTime}
                </span>

                <Link
                  href="#"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-4xl font-bold mb-10">
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
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 hover:bg-cyan-500 hover:text-black transition"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-12 text-center">
          <h2 className="text-4xl font-bold">
            Stay Updated
          </h2>

          <p className="mt-5 text-slate-300 max-w-2xl mx-auto">
            Get the latest AI website building tips, tutorials,
            design inspiration, and product updates directly in
            your inbox.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full bg-[#0F172A] border border-white/10 px-6 py-4 text-white outline-none focus:border-cyan-500 w-full sm:w-96"
            />

            <button className="rounded-full bg-cyan-500 px-8 py-4 text-black font-semibold hover:bg-cyan-400 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}