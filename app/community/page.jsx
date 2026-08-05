import Link from "next/link";


export const metadata = {
  title: "Community | Creov",
  description: "Join the Creov community to learn, share, and grow.",
};

const communityCards = [
  {
    title: "Discord Community",
    description:
      "Chat with other creators, ask questions, and get support from the community.",
    icon: "💬",
    href: "#",
  },
  {
    title: "GitHub",
    description:
      "Explore the project, report bugs, and contribute to Creov's development.",
    icon: "💻",
    href: "#",
  },
  {
    title: "Feature Requests",
    description:
      "Have an idea? Share your feature requests .",
    icon: "💡",
   
    href: "#",
  },
];

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          Community
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold">
          Build Together with{" "}
          <span className="text-cyan-400">Creov</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400">
          Connect with designers, developers, and creators using Creov.
          Share ideas, get support, and help shape the future of AI-powered
          website building.
        </p>
      </section>

      {/* Community Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {communityCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-cyan-500/30 hover:-translate-y-1 transition"
            >
              <div className="text-5xl mb-6">{card.icon}</div>

              <h2 className="text-2xl font-bold">{card.title}</h2>

              <p className="mt-4 text-slate-400 leading-relaxed">
                {card.description}
              </p>

              
                
            </div>
          ))}
        </div>
      </section>

      {/* Why Join */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12">
          <h2 className="text-4xl font-bold text-center">
            Why Join Our Community?
          </h2>

          <div className="grid gap-8 md:grid-cols-3 mt-12">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400">
                Learn
              </h3>
              <p className="mt-3 text-slate-400">
                Access tutorials, guides, and best practices for building
                modern websites with AI.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-400">
                Collaborate
              </h3>
              <p className="mt-3 text-slate-400">
                Meet developers and designers, exchange ideas, and work
                together on exciting projects.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-400">
                Grow
              </h3>
              <p className="mt-3 text-slate-400">
                Stay updated with new features, releases, and opportunities
                to improve your workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-12 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Join?
          </h2>

          <p className="mt-5 text-slate-300">
            Become part of the Creov community and help shape the future of
            AI-powered website creation.
          </p>

          <Link
            href="/generate"
            className="inline-block mt-8 rounded-full bg-cyan-500 px-8 py-4 font-semibold text-black hover:bg-cyan-400 transition"
          >
            Start Building
          </Link>
        </div>
      </section>
    </main>
  );
}