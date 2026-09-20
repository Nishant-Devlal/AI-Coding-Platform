"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password"
        );
      }

      // Store JWT
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Redirect to homepage
      router.push("/");

    } catch (error) {

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold"
          >
            Code<span className="text-blue-500">AI</span>
          </Link>

          <p className="mt-3 text-slate-400">
            Welcome back to CodeAI
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h1 className="text-2xl font-bold">
            Login
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Login to continue solving problems.
          </p>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="mt-6 space-y-5"
          >

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

            {/* Password */}
            <div>

              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-slate-400">
            
            Don't have an account?{" "}

            <Link
              href="/signup"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}