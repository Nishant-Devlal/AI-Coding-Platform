"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topics: string;
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/problems"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }

        const data = await response.json();

        setProblems(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load problems.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="text-3xl font-bold">
          Loading problems...
        </h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="text-3xl font-bold text-red-400">
          {error}
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">
          Coding Problems
        </h1>

        <p className="mt-3 text-slate-400">
          Practice problems and improve your programming skills.
        </p>

        <div className="mt-10 space-y-4">
          {problems.map((problem) => (
            <Link
              href={`/problems/${problem.id}`}
              key={problem.id}
              className="block rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-600 hover:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {problem.id}. {problem.title}
                </h2>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
                  {problem.difficulty}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                {problem.topics.split(",").map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300"
                  >
                    {topic.trim()}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}