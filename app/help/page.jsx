import Link from "next/link";

const helpCards = [
  {
    title: "Getting Started",
    description:
      "Learn how to create your first AI-generated website with Creov.",
    icon: "🚀",
  },
  {
    title: "AI Generator",
    description:
      "Understand how prompts work and generate professional websites effortlessly.",
    icon: "🤖",
  },
  {
    title: "Visual Editor",
    description:
      "Customize layouts, colors, typography, and components using the visual editor.",
    icon: "🎨",
  },
  {
    title: "Templates",
    description:
      "Browse and customize professionally designed website templates.",
    icon: "📄",
  },
  {
    title: "Publishing",
    description:
      "Export and deploy your website with confidence using Creov.",
    icon: "🌐",
  },
  {
    title: "Troubleshooting",
    description:
      "Find solutions to common issues and frequently asked questions.",
    icon: "🛠️",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          Help Center
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold">
          How Can We <span className="text-cyan-400">Help?</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400">
          Browse our guides, tutorials, and FAQs to get the most out of
          Creov's AI website builder.
        </p>

       
      </section>

      {/* Help Topics */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold mb-10 text-center">
          Popular Topics
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {helpCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-cyan-500/30 hover:-translate-y-1 transition"
            >
              <div className="text-5xl mb-6">{card.icon}</div>

              <h3 className="text-2xl font-bold">{card.title}</h3>

              <p className="mt-4 text-slate-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <h2 className="text-4xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400">
                Do I need coding experience?
              </h3>
              <p className="mt-2 text-slate-400">
                No. Creov generates websites from simple text prompts, and you
                can customize everything using the visual editor.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-400">
                Can I edit my website after generation?
              </h3>
              <p className="mt-2 text-slate-400">
                Yes. You can modify layouts, text, colors, images, and other
                elements using the built-in editor.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-cyan-400">
                Can I export my website?
              </h3>
              <p className="mt-2 text-slate-400">
                Yes. Creov allows you to export your website so you can host it
                wherever you like.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-12 text-center">
          <h2 className="text-4xl font-bold">
            Still Need Help?
          </h2>

          <p className="mt-5 text-slate-300">
            If you couldn't find the answer you're looking for, our team is
            here to help.
          </p>

          <Link
            href="/contact"
            className="inline-block mt-8 rounded-full bg-cyan-500 px-8 py-4 font-semibold text-black hover:bg-cyan-400 transition"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}