"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Submission {
  id: number;
  problem_id: number;
  problem_title: string;
  language: string;
  code: string;
  status: string;
  passed: number;
  total: number;
  runtime: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/submissions"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();

      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Accepted") {
      return "text-green-400";
    }

    if (status === "Wrong Answer") {
      return "text-red-400";
    }

    if (status === "Runtime Error") {
      return "text-orange-400";
    }

    if (status === "Time Limit Exceeded") {
      return "text-yellow-400";
    }

    return "text-slate-400";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Accepted") return "✓";
    if (status === "Wrong Answer") return "✕";
    if (status === "Runtime Error") return "⚠";
    if (status === "Time Limit Exceeded") return "⏱";

    return "•";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">

          <h1 className="text-3xl font-bold">
            Submission History
          </h1>

          <p className="mt-2 text-slate-400">
            Loading your submissions...
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Submission History
          </h1>

          <p className="mt-2 text-slate-400">
            View your previous code submissions and results.
          </p>

        </div>

        {/* Empty State */}
        {submissions.length === 0 ? (

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

            <div className="mb-4 text-4xl">
              📝
            </div>

            <h2 className="text-xl font-semibold">
              No submissions yet
            </h2>

            <p className="mt-2 text-slate-400">
              Solve a problem and submit your code to see
              your submission history here.
            </p>

          </div>

        ) : (

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            {/* Table Header */}
            <div className="hidden grid-cols-6 border-b border-slate-800 bg-slate-950 px-6 py-4 text-sm font-medium text-slate-400 md:grid">

              <div className="col-span-2">
                Problem
              </div>

              <div>
                Language
              </div>

              <div>
                Status
              </div>

              <div>
                Tests
              </div>

              <div>
                Runtime
              </div>

            </div>

            {/* Submissions */}
            {submissions.map((submission) => (

              <Link
                key={submission.id}
                href={`/submissions/${submission.id}`}
                className="block border-b border-slate-800 px-6 py-5 transition hover:bg-slate-800/40"
              >

                <div className="grid gap-4 md:grid-cols-6 md:items-center">

                  {/* Problem */}
                  <div className="md:col-span-2">

                    <p className="font-semibold text-white">
                      {submission.problem_title ||
                        `Problem #${submission.problem_id}`}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Submission #{submission.id}
                    </p>

                  </div>

                  {/* Language */}
                  <div>

                    <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {submission.language}
                    </span>

                  </div>

                  {/* Status */}
                  <div>

                    <span
                      className={`font-semibold ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {getStatusIcon(submission.status)}{" "}
                      {submission.status}
                    </span>

                  </div>

                  {/* Tests */}
                  <div>

                    <p className="text-sm text-slate-300">
                      {submission.passed} /{" "}
                      {submission.total}
                    </p>

                    <p className="text-xs text-slate-500">
                      test cases
                    </p>

                  </div>

                  {/* Runtime */}
                  <div>

                    <p className="text-sm text-slate-300">
                      {submission.runtime}
                    </p>

                    <p className="text-xs text-slate-500">
                      {new Date(
                        submission.created_at
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}