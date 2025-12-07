"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Bell, Settings } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Announcements", icon: Bell, href: "/dashboard/announcements" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      role="navigation"
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex justify-around py-4 safe-area-inset-bottom"
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
