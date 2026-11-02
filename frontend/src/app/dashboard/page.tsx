"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  total_submissions: number;
  accepted_submissions: number;
  problems_solved: number;
  acceptance_rate: number;
}

interface DifficultyStats {
  Easy: number;
  Medium: number;
  Hard: number;
}

interface RecentSubmission {
  id: number;
  problem_id: number;
  problem_title: string;
  language: string;
  status: string;
  passed: number;
  total: number;
  runtime: string;
  created_at: string;
}

interface DashboardData {
  user_name: string;
  stats: DashboardStats;
  difficulty_stats: DifficultyStats;
  recent_submissions: RecentSubmission[];
}

export default function DashboardPage() {
  const [dashboard, setDashboard] =useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Please log in to view your dashboard.");
          return;
        }
        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard/",
          {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json",},
          }
        );
        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load dashboard.");
        }
        const data: DashboardData = await response.json();
        setDashboard(data);
      } 
      catch (error) {
        console.error("Dashboard error:", error);
        setError("Unable to load dashboard data.");
      } 
      finally {
        setLoading(false);
      }
    };

    fetchDashboard();

  }, []);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <p className="text-slate-400">
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-slate-950 p-10 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="mt-4 text-red-400">
            {error || "Dashboard data is unavailable."}
          </p>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-md bg-blue-600 px-4 py-2 hover:bg-blue-500"
          >
            Go to Login
          </Link>
        </div>

      </main>
    );
  }

  const statCards = [
    {
      title: "Problems Solved",
      value: dashboard.stats.problems_solved,
      icon: "✓",
      color: "text-green-400",
    },

    {
      title: "Total Submissions",
      value: dashboard.stats.total_submissions,
      icon: "⌘",
      color: "text-blue-400",
    },

    {
      title: "Accepted Submissions",
      value: dashboard.stats.accepted_submissions,
      icon: "★",
      color: "text-purple-400",
    },

    {
      title: "Acceptance Rate",
      value: `${dashboard.stats.acceptance_rate}%`,
      icon: "%",
      color: "text-yellow-400",
    },

  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome back, {dashboard.user_name}!
          </h1>

          <p className="mt-3 text-slate-400">
            Track your coding progress and keep improving.
          </p>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-400"> {card.title}</p>
                    <span className={`text-2xl ${card.color}`}>{card.icon}</span>
                </div>
                <h2 className="text-3xl font-bold">{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="mb-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-6 text-xl font-semibold">Problems Solved by Difficulty</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-950 p-5">
              <p className="text-sm text-green-400">Easy</p>
              <p className="mt-2 text-3xl font-bold">{dashboard.difficulty_stats.Easy}</p>
            </div>

            <div className="rounded-lg bg-slate-950 p-5">
              <p className="text-sm text-yellow-400">Medium</p>
              <p className="mt-2 text-3xl font-bold">{dashboard.difficulty_stats.Medium}</p>
            </div>

            <div className="rounded-lg bg-slate-950 p-5">
              <p className="text-sm text-red-400">Hard</p>
              <p className="mt-2 text-3xl font-bold">{dashboard.difficulty_stats.Hard}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 p-6">
            <h2 className="text-xl font-semibold">Recent Submissions</h2>
            <Link
              href="/submissions"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View All
            </Link>
          </div>

          {dashboard.recent_submissions.length === 0 ? (

            <div className="p-8 text-center">
              <p className="text-slate-400">
                You haven't submitted any solutions yet.
              </p>

              <Link
                href="/problems"
                className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
              >
                Start Solving
              </Link>

            </div>

          ) : (

            <div>
              {dashboard.recent_submissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/submissions/${submission.id}`}
                  className="flex flex-col justify-between gap-3 border-b border-slate-800 px-6 py-5 transition hover:bg-slate-800/40 sm:flex-row sm:items-center"
                >

                  <div>
                    <p className="font-semibold">
                      {submission.problem_title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {submission.language} ·{" "}
                      {new Date(submission.created_at).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-5">
                    <span className="text-sm text-slate-400">
                      {submission.passed}/{submission.total} tests
                    </span>

                    <span
                      className={`text-sm font-semibold ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  
                </Link>
              ))}
            </div>

          )}
        </div>


        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/problems"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-medium hover:bg-blue-500"
          >
            Solve Problems
          </Link>

          <Link
            href="/submissions"
            className="rounded-md border border-slate-700 px-5 py-3 text-sm font-medium hover:bg-slate-800"
          >
            View Submission History
          </Link>
        </div>
      </div>
    </main>
  );

}