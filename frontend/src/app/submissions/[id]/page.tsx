"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function SubmissionDetailPage() {
  const params = useParams();
  const id = params.id;
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/submissions/${id}`
        );
        if (!response.ok) {
          throw new Error("Submission not found");
        }
        const data = await response.json();
        setSubmission(data);
      } 

      catch (error) {
        console.error(error);

      } 
      
      finally {
        setLoading(false);

      }
    };

    if (id) {
      fetchSubmission();
    }

  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-slate-400">
            Loading submission...
          </p>
        </div>
      </main>
    );

  }

  if (!submission) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-2xl font-bold">
            Submission not found
          </h1>
          <Link
            href="/submissions"
            className="mt-6 inline-block text-blue-400 hover:text-blue-300"
          >
            ← Back to submissions
          </Link>
        </div>
      </main>
    );

  }

  const accepted =
    submission.status === "Accepted";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Back */}
        <Link
          href="/submissions"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Submission History
        </Link>

        {/* Header */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            {submission.problem_title}
          </h1>

          <p className="mt-2 text-slate-400">
            Submission #{submission.id}
          </p>
        </div>

        {/* Submission information */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">

          {/* Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">
              Status
            </p>

            <p
              className={`mt-2 text-lg font-semibold ${
                accepted
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {accepted ? "✓ Accepted" : `✕ ${submission.status}`}
            </p>

          </div>

          {/* Language */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Language</p>
            <p className="mt-2 text-lg font-semibold">{submission.language}</p>
          </div>

          {/* Tests */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Test Cases</p>
            <p className="mt-2 text-lg font-semibold">{submission.passed} / {submission.total}</p>
          </div>

          {/* Runtime */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Runtime</p>
            <p className="mt-2 text-lg font-semibold">{submission.runtime}</p>
          </div>

        </div>

        {/* Code */}
        <div className="mt-8">

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Submitted Code</h2>
            <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
              {submission.language}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800">

            <pre className="overflow-x-auto bg-slate-950 p-6 text-sm leading-7 text-slate-300">

              <code>
                {submission.code}
              </code>

            </pre>

          </div>

        </div>

        {/* Date */}
        <div className="mt-6 text-sm text-slate-500">

          Submitted on{" "}
          {new Date(
            submission.created_at
          ).toLocaleString()}

        </div>

      </div>

    </main>
  );
}