"use client";

import { useState } from "react";

interface CodeEditorProps {
  starterCode: string;
  problemId: number;
}

const defaultCode: Record<string, string> = {
  Python: `def solution():
    # Write your solution here
    pass`,

  "C++": `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    // Write your solution here

    return 0;
}`,
};

export default function CodeEditor({
  starterCode,
  problemId,
}: CodeEditorProps) {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(starterCode || defaultCode.Python);
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState<any>(null);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value;

    setLanguage(newLanguage);
    setCode(defaultCode[newLanguage]);
    setOutput(null);
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/run", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
          problem_id: problemId,
          language: language,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error("Execution request failed.");
      }
      const data = await response.json();
      setOutput(data);
    } 

    catch (error) {
      console.error(error);
      setOutput({
        success: false,
        error: "Could not connect to execution server.",
      });
    } 

    finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmission(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/submit",
        {
          method: "POST",
          headers: {"Content-Type": "application/json",},
          body: JSON.stringify({
            problem_id: problemId,
            language: language,
            code: code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed.");
      }
      const data = await response.json();
      setSubmission(data);
    } 

    catch (error) {
      console.error(error);
      setSubmission({
        success: false,
        status: "Submission Error",
        passed: 0,
        total: 0,
        runtime: 0,
      });
    } 

    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">

        <select
          value={language}
          onChange={handleLanguageChange}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="Python">Python</option>
          <option value="C++">C++</option>
        </select>

        <div className="flex gap-2">

          <button
            onClick={handleRun}
            disabled={running}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? "Running..." : "Run"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting || running}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

        </div>
      </div>

      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
        className="min-h-[450px] flex-1 resize-none bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none"
      />

      {output && (
        <div className="border-t border-slate-800 bg-slate-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Test Results
          </h3>

          {output.error ? (
            <div className="rounded-md bg-red-950/40 p-3 text-sm text-red-400">
              {output.error}
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-slate-400">
                  {output.passed} / {output.total} tests passed
                </p>

                {output.success ? (
                  <span className="font-semibold text-green-400">
                    Accepted
                  </span>
                ) : (
                  <span className="font-semibold text-red-400">
                    Failed
                  </span>
                )}

              </div>

              <div className="space-y-2">

                {output.results?.map((result: any) => (
                  <div
                    key={result.test_case}
                    className="rounded-md bg-slate-950 p-3 text-sm"
                  >

                    <div className="font-medium text-slate-200">
                      {result.passed ? "✅" : "❌"} Test Case{" "}
                      {result.test_case}
                    </div>

                    {result.expected_output != null && (
                      <div className="mt-2 text-slate-500">
                        Expected:{" "}
                        <span className="text-slate-300">
                          {result.expected_output}
                        </span>
                      </div>
                    )}

                    {result.actual_output != null && (
                      <div className="text-slate-500">
                        Actual:{" "}
                        <span className="text-slate-300">
                          {result.actual_output}
                        </span>
                      </div>
                    )}

                  </div>
                ))}

              </div>
            </>
          )}
        </div>
      )}

      {submission && (
        <div className="border-t border-slate-800 bg-slate-900 p-4">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Submission Result
          </h3>
          <div className="rounded-lg bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between">
              
              <span className="text-sm text-slate-400">
                Status
              </span>

              <span
                className={
                  submission.success
                    ? "font-semibold text-green-400"
                    : "font-semibold text-red-400"
                }
              >
                {submission.success
                  ? "✅ Accepted"
                  : `❌ ${submission.status}`}
              </span>

            </div>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Test Cases
              </span>

              <span className="text-sm text-slate-200">
                {submission.passed} / {submission.total}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Runtime
              </span>

              <span className="text-sm text-slate-200">
                {submission.runtime}s
              </span>

            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}