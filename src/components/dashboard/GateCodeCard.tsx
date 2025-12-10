"use client";

import { useEffect } from "react";

interface GateCodeCardProps {
  code: string;
}

export default function GateCodeCard({ code }: GateCodeCardProps) {
  useEffect(() => {
    if (code && code !== "No code yet") {
      localStorage.setItem("last_gate_code", code);
    }
  }, [code]);

  return (
    <div className="rounded-2xl p-8 text-center mb-6 backdrop-blur-md border-2 border-teal-300 dark:border-teal-600" style={{ background: "rgba(0, 128, 128, 0.1)" }}>
      <div className="text-6xl font-bold tracking-widest text-teal-700 dark:text-teal-300 mb-3">
        {code}
      </div>

      <p className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">
        Valid until midnight
      </p>
    </div>
  );
}
