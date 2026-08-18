import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
        <div className="text-2xl font-bold">
          Code<span className="text-blue-500">AI</span>
        </div>

        <div className="hidden gap-8 md:flex">
          <Link
            href="/problems"
            className="text-slate-300 transition hover:text-white"
          >
            Problems
          </Link>

          <Link
            href="/contests"
            className="text-slate-300 transition hover:text-white"
          >
            Contests
          </Link>

          <Link
            href="/about"
            className="text-slate-300 transition hover:text-white"
          >
            About
          </Link>
        </div>

        <div className="flex gap-3">
          <button className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          🚀 AI-powered coding practice
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Master Coding with{" "}
          <span className="text-blue-500">AI</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Practice coding problems, write and execute code, receive
          AI-powered hints, analyze your solutions, and build your
          programming skills.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/problems"
            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-700"
          >
            Start Coding →
          </Link>

          <button className="rounded-lg border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:bg-slate-900">
            Explore Features
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        <FeatureCard
          icon="💻"
          title="Practice Problems"
          description="Solve problems ranging from beginner to advanced across different DSA topics."
        />

        <FeatureCard
          icon="🤖"
          title="AI Coding Tutor"
          description="Get intelligent hints, code explanations, debugging help, and personalized feedback."
        />

        <FeatureCard
          icon="📊"
          title="Track Progress"
          description="Monitor your submissions, coding streaks, strengths, weaknesses, and improvement."
        />
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-800 bg-slate-900/50 px-6 py-20 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to become a better programmer?
        </h2>

        <p className="mt-4 text-slate-400">
          Start solving problems and let AI help you learn.
        </p>

        <Link
          href="/problems"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700"
        >
          Start Practicing
        </Link>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-700">
      <div className="mb-4 text-3xl">{icon}</div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </div>
  );
}