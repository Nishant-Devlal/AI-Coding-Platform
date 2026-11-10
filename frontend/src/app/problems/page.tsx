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
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/problems/topics");
        if (!response.ok) {
          throw new Error("Failed to fetch topics");
        }
        const data = await response.json();
        setTopics(data);
      } 
      catch (error) {
        console.error("Topic fetching error:", error);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams();
        if (selectedTopic) {
          params.append("topic", selectedTopic);
        }
        if (selectedDifficulty) {
          params.append("difficulty", selectedDifficulty);
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        const response = await fetch(`http://localhost:8000/api/problems/?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
      } 
      catch (error) {
        console.error(error);
        setError("Unable to load problems.");
      } 
      finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [selectedTopic, selectedDifficulty, searchQuery]);

  const clearFilters = () => {
    setSelectedTopic("");
    setSelectedDifficulty("");
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold">
          Coding Problems
        </h1>

        <p className="mt-3 text-slate-400">
          Practice problems and improve your programming skills.
        </p>

        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-lg font-semibold">
            Filter Problems
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="">
                All Topics
              </option>

              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="">
                All Difficulties
              </option>

              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={clearFilters}
              className="rounded-lg bg-slate-800 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              Clear Filters
            </button>
          </div>

        </div>

        <div className="mt-8 mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Problems
          </h2>

          <span className="text-sm text-slate-400">
            {problems.length} problems found
          </span>
        </div>

        {loading && (
          <p className="py-10 text-center text-slate-400">
            Loading problems...
          </p>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && problems.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No problems found
            </h2>

            <p className="mt-2 text-slate-400">
              Try changing your filters or search query.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-500">
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && problems.length > 0 && (
          <div className="space-y-4">
            {problems.map((problem) => (
              <Link
                href={`/problems/${problem.id}`}
                key={problem.id}
                className="block rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-600 hover:bg-slate-800">

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {problem.id}. {problem.title}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {(problem.topics || "")
                    .split(",")
                    .filter((topic) => topic.trim())
                    .map((topic) => (
                      <span
                        key={topic.trim()}
                        className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300"
                      >
                        {topic.trim()}
                      </span>
                    ))}
                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}