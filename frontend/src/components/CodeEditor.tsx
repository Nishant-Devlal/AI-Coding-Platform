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

  "C++": `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}`,

  Java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,

  JavaScript: `function solution() {
    // Write your solution here
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
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value;

    setLanguage(newLanguage);

    setCode(defaultCode[newLanguage]);
  };

  const handleRun = async () => {
  setRunning(true);
  setOutput(null);

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/run",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          problem_id: problemId,
          language: language,
          code: code,
        }),
      }
    );

    const data = await response.json();

    setOutput(data);

  } catch (error) {
    console.error(error);

    setOutput({
      success: false,
      error: "Could not connect to execution server."
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
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-2">

          <button
          onClick={handleRun}
          disabled={running}
          className="rounded-md bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700 disabled:opacity-50"
          >
          {running ? "Running..." : "Run"}
          </button>

          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
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
        className="flex-1 resize-none bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none"
      />

      {output && (
  <div className="border-t border-slate-800 bg-slate-900 p-4">

    <h3 className="mb-3 text-sm font-semibold">
      Test Results
    </h3>

    {output.error ? (
      <p className="text-red-400">
        {output.error}
      </p>
    ) : (
      <>
        <p className="mb-3 text-sm text-slate-400">
          {output.passed} / {output.total} tests passed
        </p>

        <div className="space-y-2">

          {output.results?.map((result: any) => (
            <div
              key={result.test_case}
              className="rounded-md bg-slate-950 p-3 text-sm"
            >

              <div>
                {result.passed ? "✅" : "❌"}{" "}
                Test Case {result.test_case}
              </div>

              <div className="mt-2 text-slate-500">
                Expected: {result.expected_output}
              </div>

              <div className="text-slate-500">
                Actual: {result.actual_output}
              </div>

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