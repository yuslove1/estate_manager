"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminTopBar() {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-neutral-900 dark:text-white" />
          </button>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
            Admin Dashboard
          </h1>
        </div>
      </div>
    </div>
  );
}
