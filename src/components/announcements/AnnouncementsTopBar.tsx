"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnnouncementsTopBar() {
  const router = useRouter();

  return (
    <div className="bg-blue-100 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-neutral-900 dark:text-white" />
        </button>
        <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
          Announcements
        </h1>
      </div>
    </div>
  );
}
