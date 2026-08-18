import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Code<span className="text-blue-500">AI</span>
        </Link>

        <Link
          href="/problems"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← All Problems
        </Link>
      </nav>

      {/* Main Layout */}
      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
        {/* Problem Section */}
        <section className="overflow-y-auto border-r border-slate-800 p-8">
          <div className="mx-auto max-w-2xl">
            {/* Problem Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  Problem {id}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Two Sum
                </h1>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                Easy
              </span>
            </div>

            {/* Topics */}
            <div className="mt-5 flex gap-2">
              <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300">
                Array
              </span>

              <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300">
                Hash Map
              </span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold">
                Description
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Given an array of integers{" "}
                <code className="rounded bg-slate-800 px-1 text-blue-400">
                  nums
                </code>{" "}
                and an integer{" "}
                <code className="rounded bg-slate-800 px-1 text-blue-400">
                  target
                </code>
                , return the indices of the two numbers such
                that they add up to target.
              </p>

              <p className="mt-4 leading-7 text-slate-300">
                You may assume that each input has exactly one
                solution, and you may not use the same element
                twice.
              </p>
            </div>

            {/* Example */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold">
                Example
              </h2>

              <div className="mt-4 rounded-lg bg-slate-900 p-5">
                <p className="text-sm text-slate-400">
                  Input
                </p>

                <pre className="mt-2 text-sm text-slate-200">
                  nums = [2, 7, 11, 15]
                  {"\n"}
                  target = 9
                </pre>

                <p className="mt-5 text-sm text-slate-400">
                  Output
                </p>

                <pre className="mt-2 text-sm text-slate-200">
                  [0, 1]
                </pre>

                <p className="mt-5 text-sm text-slate-400">
                  Explanation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  nums[0] + nums[1] = 2 + 7 = 9.
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold">
                Constraints
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                <li>2 ≤ nums.length ≤ 10⁴</li>
                <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>-10⁹ ≤ target ≤ 10⁹</li>
                <li>Exactly one solution exists.</li>
              </ul>
            </div>

            {/* AI Button */}
            <div className="mt-10 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
              <h3 className="font-semibold">
                🤖 Need help?
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Ask the AI tutor for a hint without revealing
                the complete solution.
              </p>

              <button className="mt-4 rounded-lg border border-blue-500/40 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10">
                Get a Hint
              </button>
            </div>
          </div>
        </section>

        {/* Editor Section */}
        <section className="min-h-[600px] p-4">
          <CodeEditor />
        </section>
      </div>
    </main>
  );
}