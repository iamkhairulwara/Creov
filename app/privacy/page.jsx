'use client'
import Navbar from '@/components/ui/NAVBAR'
import Footer from '@/components/ui/FOOTER'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-36 pb-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 text-sm text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Privacy Policy
          </span>

          <h1 className="mt-8 text-5xl md:text-6xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)]">
            Your Privacy Matters
          </h1>

          <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto font-light">
            At Creov, we are committed to protecting your personal information
            and ensuring transparency about how your data is collected, used,
            and secured.
          </p>
        </section>

        {/* Policy Content */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 md:p-14 space-y-12">

            <div className="border-b border-white/5 pb-8">
              <h2 className="text-2xl font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)] flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">1</span>
                Information We Collect
              </h2>
              <p className="mt-4 text-slate-400 leading-8 font-light text-sm ml-12">
                We may collect information such as your name, email address,
                account details, website content, and usage data when you use
                Creov's AI website builder and related services.
              </p>
            </div>

            <div className="border-b border-white/5 pb-8">
              <h2 className="text-2xl font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)] flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">2</span>
                How We Use Your Information
              </h2>
              <p className="mt-4 text-slate-400 leading-8 font-light text-sm ml-12">
                Your information is used to provide AI-powered website
                generation, enable visual editing, support website deployment,
                improve platform performance, respond to support requests, and
                enhance your overall experience.
              </p>
            </div>

            <div className="border-b border-white/5 pb-8">
              <h2 className="text-2xl font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)] flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">3</span>
                Data Security
              </h2>
              <p className="mt-4 text-slate-400 leading-8 font-light text-sm ml-12">
                We implement reasonable security measures to protect your data
                from unauthorized access, disclosure, or misuse. While we
                strive to keep your information secure, no online service can
                guarantee absolute security.
              </p>
            </div>

            <div className="border-b border-white/5 pb-8">
              <h2 className="text-2xl font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)] flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">4</span>
                Your Rights
              </h2>
              <p className="mt-4 text-slate-400 leading-8 font-light text-sm ml-12">
                You have the right to access, update, or request deletion of
                your personal information where applicable. You may also
                contact us with any questions regarding your data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-cyan-400 font-[family-name:var(--font-space-grotesk)] flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm">5</span>
                Updates to This Policy
              </h2>
              <p className="mt-4 text-slate-400 leading-8 font-light text-sm ml-12">
                This Privacy Policy may be updated periodically to reflect
                improvements to Creov or changes in legal requirements. Any
                updates will be published on this page.
              </p>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}