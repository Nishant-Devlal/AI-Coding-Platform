"use client";

import { useEffect, useState } from "react";

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading submissions...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-2 text-3xl font-bold">
          Submission History
        </h1>

        <p className="mb-8 text-slate-400">
          View your previous code submissions.
        </p>

        {submissions.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-400">
              No submissions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {submissions.map((submission) => (

              <div
                key={submission.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-5"
              >

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="font-semibold">
                      {submission.problem_title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {submission.language}
                    </p>
                  </div>

                  <span
                    className={
                      submission.status === "Accepted"
                        ? "font-semibold text-green-400"
                        : "font-semibold text-red-400"
                    }
                  >
                    {submission.status === "Accepted"
                      ? "✅ Accepted"
                      : `❌ ${submission.status}`}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-800 pt-4">

                  <div>
                    <p className="text-xs text-slate-500">
                      Test Cases
                    </p>

                    <p className="mt-1 text-sm">
                      {submission.passed} / {submission.total}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Runtime
                    </p>

                    <p className="mt-1 text-sm">
                      {submission.runtime}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Submitted
                    </p>

                    <p className="mt-1 text-sm">
                      {new Date(
                        submission.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}