"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TopAppBar() {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-40 backdrop-blur-md border-b dark:bg-neutral-900/80 dark:border-neutral-800/50"
      style={{
        background: "rgba(255, 255, 255, 0.9)",
        borderColor: "rgba(229, 231, 235, 0.5)",
      }}
    >
      <div className="max-w-2xl container mx-auto px-4 py-3 flex items-center justify-between">
        {/* <Image src="/images/NavLogo.png" alt="Brentfield Estate" width={60} height={60} className="rounded-lg" /> */}
        <div className="max-w-1/3">
          <img
            src="/images/NavLogo.png"
            alt="Brentfield Estate Logo"
            className="w-full h-[60px] object-contain border-none"
          />
        </div>

        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition font-semibold text-neutral-700 dark:text-neutral-300"
          aria-label="Admin Panel"
          title="Go to Admin Panel"
        >
          <Lock size={20} />
          <span className="hidden sm:inline text-sm">Admin</span>
        </button>
      </div>
    </div>
  );
}
