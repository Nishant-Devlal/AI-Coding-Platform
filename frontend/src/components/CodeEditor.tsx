"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function CodeEditor() {
  const [language, setLanguage] = useState("cpp");

  const [code, setCode] = useState(`#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}`);

  const handleRun = () => {
    console.log("Run clicked");
    console.log(code);
  };

  const handleSubmit = () => {
    console.log("Submit clicked");
    console.log(code);
  };

  const starterCode = {
    cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}`,

    python: `def solution():
    # Write your solution here
    pass


solution()
`,
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage as keyof typeof starterCode]);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>

        <span className="text-sm text-slate-400">
          Ready
        </span>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: {
              enabled: false,
            },
            fontSize: 15,
            automaticLayout: true,
            padding: {
              top: 15,
            },
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className="flex justify-end gap-3 border-t border-slate-800 bg-slate-900 p-3">
        <button
          onClick={handleRun}
          className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Run
        </button>

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}