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
};

export default function CodeEditor({
  starterCode,
  problemId,
}: CodeEditorProps) {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(starterCode || defaultCode.Python);
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);

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

        headers: {
          "Content-Type": "application/json",
        },

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
    } catch (error) {
      console.error(error);

      setOutput({
        success: false,
        error: "Could not connect to execution server.",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">

        {/* Language Selector */}
        <select
          value={language}
          onChange={handleLanguageChange}
          className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="Python">Python</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-2">

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={running}
            className="rounded-md bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? "Running..." : "Run"}
          </button>

          {/* Submit - not implemented yet */}
          <button
            disabled
            className="cursor-not-allowed rounded-md bg-blue-600 px-4 py-2 text-sm text-white opacity-50"
          >
            Submit
          </button>

        </div>
      </div>

      {/* Code Editor */}
      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
        className="min-h-[450px] flex-1 resize-none bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none"
      />

      {/* Test Results */}
      {output && (
        <div className="border-t border-slate-800 bg-slate-900 p-4">

          <h3 className="mb-3 text-sm font-semibold text-white">
            Test Results
          </h3>

          {/* Connection / Server Error */}
          {output.error ? (
            <div className="rounded-md bg-red-950/40 p-3 text-sm text-red-400">
              {output.error}
            </div>
          ) : (
            <>
              {/* Overall Result */}
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

              {/* Individual Test Cases */}
              <div className="space-y-2">

                {output.results?.map((result: any) => (
                  <div
                    key={result.test_case}
                    className="rounded-md bg-slate-950 p-3 text-sm"
                  >

                    {/* Test Case Status */}
                    <div className="font-medium text-slate-200">
                      {result.passed ? "✅" : "❌"} Test Case{" "}
                      {result.test_case}
                    </div>

                    {/* Only show details if backend provides them */}
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

    </div>
  );
}