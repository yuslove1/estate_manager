"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export default function CopyGateCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl transition mb-4 backdrop-blur-md border border-blue-400"
      style={{ background: "rgba(59, 130, 246, 0.9)" }}
    >
      <Copy size={20} />
      {copied ? "✓ Copied!" : "Copy Gate Code"}
    </button>
  );
}
