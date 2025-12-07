"use client";

import { Shield, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopAppBar() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="bg-blue-500 rounded-lg p-2">
          <Shield size={28} className="text-white" />
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition flex items-center gap-2"
          aria-label="Admin Panel"
        >
          <Lock size={20} className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </div>
    </div>
  );
}
