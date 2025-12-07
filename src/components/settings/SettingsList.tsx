"use client";

import { Moon, Sun, Bell, LogOut } from "lucide-react";
import { useState } from "react";

interface SettingsListProps {
  onLogout: () => void;
  isLoading?: boolean;
}

export default function SettingsList({ onLogout, isLoading }: SettingsListProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="space-y-0">
      {/* Theme Setting */}
      <div className="flex justify-between items-center py-4 border-b border-neutral-200 dark:border-neutral-700 text-sm">
        <div className="flex items-center gap-3">
          {isDarkMode ? (
            <Moon className="text-neutral-600 dark:text-neutral-400" size={20} />
          ) : (
            <Sun className="text-neutral-600 dark:text-neutral-400" size={20} />
          )}
          <span className="font-medium text-neutral-900 dark:text-white">Theme</span>
        </div>
        <button
          onClick={handleThemeToggle}
          className="px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white transition"
        >
          {isDarkMode ? "Dark" : "Light"}
        </button>
      </div>

      {/* Notifications Setting */}
      <div className="flex justify-between items-center py-4 border-b border-neutral-200 dark:border-neutral-700 text-sm">
        <div className="flex items-center gap-3">
          <Bell className="text-neutral-600 dark:text-neutral-400" size={20} />
          <span className="font-medium text-neutral-900 dark:text-white">Notifications</span>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">On</span>
        </label>
      </div>

      {/* Logout Setting */}
      <button
        onClick={onLogout}
        disabled={isLoading}
        className="w-full flex justify-between items-center py-4 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          <LogOut className="text-red-600 dark:text-red-400" size={20} />
          <span className="font-medium text-red-600 dark:text-red-400">
            {isLoading ? "Logging out..." : "Logout"}
          </span>
        </div>
      </button>
    </div>
  );
}
