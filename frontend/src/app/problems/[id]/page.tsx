import Link from "next/link";
import CodeEditor from "@/components/CodeEditor";

interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topics: string | null;
  constraints: string | null;
  input_format: string | null;
  output_format: string | null;
  examples: ProblemExample[] | null;
  starter_code: string | null;
}

async function getProblem(id: string): Promise<Problem> {
  const response = await fetch(
  `http://127.0.0.1:8000/api/problems/${id}`,
  {
    cache: "no-store",
  }
);

  if (!response.ok) {
    throw new Error("Problem not found");
  }

  return response.json();
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const problem = await getProblem(id);

  return (
  <main className="min-h-screen bg-slate-950 text-white">

    {/* Navbar */}
    <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <Link
        href="/"
        className="text-xl font-bold"
      >
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

      {/* ================= PROBLEM ================= */}

      <section className="overflow-y-auto border-r border-slate-800 p-8">

        <div className="mx-auto max-w-2xl">

          {/* Problem Header */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <p className="text-sm text-slate-500">
                Problem {problem.id}
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                {problem.title}
              </h1>

            </div>


            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                problem.difficulty === "Easy"
                  ? "bg-green-500/10 text-green-400"
                  : problem.difficulty === "Medium"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {problem.difficulty}
            </span>

          </div>


          {/* Topics */}

          {problem.topics && (
            <div className="mt-5 flex flex-wrap gap-2">

              {problem.topics
                .split(",")
                .map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300"
                  >
                    {topic.trim()}
                  </span>
                ))}

            </div>
          )}


          {/* Description */}

          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Description
            </h2>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
              {problem.description}
            </p>

          </div>


          {/* Constraints */}

          {problem.constraints && (
            <div className="mt-8">

              <h2 className="text-xl font-semibold">
                Constraints
              </h2>

              <div className="mt-4 rounded-lg bg-slate-900 p-4">

                <p className="whitespace-pre-line text-sm leading-7 text-slate-300">
                  {problem.constraints}
                </p>

              </div>

            </div>
          )}


          {/* Input Format */}

          {problem.input_format && (
            <div className="mt-8">

              <h2 className="text-xl font-semibold">
                Input
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                {problem.input_format}
              </p>

            </div>
          )}


          {/* Output Format */}

          {problem.output_format && (
            <div className="mt-8">

              <h2 className="text-xl font-semibold">
                Output
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                {problem.output_format}
              </p>

            </div>
          )}


          {/* Examples */}

          {problem.examples && problem.examples.length > 0 && (
            <div className="mt-8">

              <h2 className="text-xl font-semibold">
                Examples
              </h2>


              <div className="mt-4 space-y-5">

                {problem.examples.map((example, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                  >

                    <p className="mb-3 font-semibold">
                      Example {index + 1}
                    </p>


                    <div className="space-y-3 text-sm">

                      <div>
                        <span className="text-slate-500">
                          Input:
                        </span>

                        <pre className="mt-1 whitespace-pre-wrap rounded-md bg-slate-950 p-3 text-slate-300">
                          {example.input}
                        </pre>
                      </div>


                      <div>
                        <span className="text-slate-500">
                          Output:
                        </span>

                        <pre className="mt-1 whitespace-pre-wrap rounded-md bg-slate-950 p-3 text-slate-300">
                          {example.output}
                        </pre>
                      </div>


                      {example.explanation && (
                        <div>

                          <span className="text-slate-500">
                            Explanation:
                          </span>

                          <p className="mt-1 leading-6 text-slate-300">
                            {example.explanation}
                          </p>

                        </div>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}


          {/* AI Tutor */}

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


      {/* ================= CODE EDITOR ================= */}

      <section className="min-h-[600px] p-4">

        <CodeEditor
        problemId={problem.id}
        starterCode={problem.starter_code ?? ""}
        />

      </section>

    </div>

  </main>
);
}