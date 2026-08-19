"use client";

import { useState } from "react";

interface CodeEditorProps {
  starterCode: string;
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
}: CodeEditorProps) {
  const [language, setLanguage] = useState("Python");

  const [code, setCode] = useState(
    starterCode || defaultCode.Python
  );

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLanguage = event.target.value;

    setLanguage(newLanguage);

    setCode(defaultCode[newLanguage]);
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
            className="rounded-md bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
          >
            Run
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

    </div>
  );
}