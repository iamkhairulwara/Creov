import Link from "next/link";

const values = [
  {
    title: "AI-Powered Innovation",
    description:
      "We leverage artificial intelligence to simplify website creation and help anyone build professional websites in minutes.",
    icon: "🤖",
  },
  {
    title: "User-Centered Design",
    description:
      "Every feature is designed to make website building intuitive, accessible, and enjoyable for everyone.",
    icon: "🎨",
  },
  {
    title: "Speed & Simplicity",
    description:
      "From AI-powered generation and visual editing to seamless deployment, Creov delivers a fast, efficient, and intuitive website-building experience.",
    icon: "⚡",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          About Creov
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold">
          Building the Future of
          <span className="text-cyan-400"> Website Creation</span>
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-400 leading-relaxed">
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
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-14">
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>

          <p className="text-slate-400 leading-8">
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

          <p className="mt-6 text-slate-400 leading-8">
            Whether you're creating a portfolio, business website,
            landing page, or e-commerce site, Creov provides everything
            you need in one platform—from AI-powered generation and
            visual customization to deployment—helping you build and
            launch professional websites with confidence.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Core Values
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-cyan-500/30 hover:-translate-y-1 transition"
            >
              <div className="text-5xl mb-6">{value.icon}</div>

              <h3 className="text-2xl font-bold">{value.title}</h3>

              <p className="mt-4 text-slate-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-12">
          <h2 className="text-4xl font-bold text-center">
            Our Mission
          </h2>

          <p className="mt-6 text-center text-lg text-slate-300 max-w-3xl mx-auto leading-8">
            We believe everyone should be able to create, customize, and
            deploy professional websites without needing extensive
            technical knowledge. By combining artificial intelligence, a
            powerful visual editor, and seamless deployment, Creov
            empowers creators, businesses, students, and entrepreneurs
            to bring their ideas online faster, smarter, and with
            complete creative freedom.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Build Your Website?
          </h2>

          <p className="mt-5 text-slate-400">
            Start creating, customizing, and deploying beautiful websites
            with Creov's AI-powered platform.
          </p>

          <Link
            href="/generate"
            className="inline-block mt-8 rounded-full bg-cyan-500 px-8 py-4 font-semibold text-black hover:bg-cyan-400 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}