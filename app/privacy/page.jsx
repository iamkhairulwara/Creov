export const metadata = {
  title: "Privacy Policy | Creov",
  description: "Learn how Creov collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
          Privacy Policy
        </span>

        <h1 className="mt-6 text-5xl md:text-6xl font-bold">
          Your Privacy Matters
        </h1>

        <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
          At Creov, we are committed to protecting your personal information
          and ensuring transparency about how your data is collected, used,
          and secured.
        </p>
      </section>

      {/* Policy Content */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 space-y-10">

          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              1. Information We Collect
            </h2>
            <p className="mt-4 text-slate-400 leading-8">
              We may collect information such as your name, email address,
              account details, website content, and usage data when you use
              Creov's AI website builder and related services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              2. How We Use Your Information
            </h2>
            <p className="mt-4 text-slate-400 leading-8">
              Your information is used to provide AI-powered website
              generation, enable visual editing, support website deployment,
              improve platform performance, respond to support requests, and
              enhance your overall experience.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              3. Data Security
            </h2>
            <p className="mt-4 text-slate-400 leading-8">
              We implement reasonable security measures to protect your data
              from unauthorized access, disclosure, or misuse. While we
              strive to keep your information secure, no online service can
              guarantee absolute security.
            </p>
          </div>

          
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              4. Your Rights
            </h2>
            <p className="mt-4 text-slate-400 leading-8">
              You have the right to access, update, or request deletion of
              your personal information where applicable. You may also
              contact us with any questions regarding your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              5. Updates to This Policy
            </h2>
            <p className="mt-4 text-slate-400 leading-8">
              This Privacy Policy may be updated periodically to reflect
              improvements to Creov or changes in legal requirements. Any
              updates will be published on this page.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}