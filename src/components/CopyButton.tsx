"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold hover:bg-emerald-500 transition"
    >
      <Copy className="w-5 h-5" />
      {copied ? "Copied!" : "Copy Code"}
    </button>
  );
}