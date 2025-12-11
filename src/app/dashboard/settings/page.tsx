"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Moon, Bell, Accessibility, Images, ChevronRight, Shield, Download, LogOut } from "lucide-react";
import { deleteCookie } from "cookies-next";
import toast from "react-hot-toast";
import SettingsTopBar from "@/components/settings/SettingsTopBar";
import Toggle from "@/components/settings/Toggle";
import { useUser } from "@/context/UserContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function PWAInstallSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <div className="rounded-xl p-6 backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
      <div className="flex items-start gap-3 mb-4">
        <Download size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
            Add Brentfield to Home Screen
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Install the Brentfield Estate Gate Pass App for quick access and offline functionality.
          </p>
        </div>
      </div>
      {showInstallButton && deferredPrompt ? (
        <button
          onClick={handleInstall}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
        >
          Add to Home Screen
        </button>
      ) : (
        <button
          disabled
          className="w-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 font-bold py-3 rounded-lg cursor-not-allowed"
        >
          Available on supported browsers
        </button>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, darkMode, setDarkMode, annNotif, setAnnNotif, gateNotif, setGateNotif, textSize, setTextSize, keyboardNav, setKeyboardNav } = useUser();

  const handleLogout = () => {
    try {
      deleteCookie("verified_phone");
      toast.success("Logged out successfully");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <>
      <SettingsTopBar />
      <main className="min-h-screen bg-transparent">
        <div className="container max-w-2xl mx-auto px-4 pt-6 pb-24 backdrop-blur-sm min-h-screen" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
          {/* Profile Card */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {user?.full_name || "Brentfield Resident"}
              </h2>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {user?.phone || "Not available"}
                </p>
                {user?.house_number && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    House {user.house_number}
                  </p>
                )}
                {user?.is_admin && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Admin</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PREFERENCES Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide">
              Preferences
            </h3>

            {/* Dark Mode */}
            <div className="rounded-xl p-4 mb-3 flex items-start justify-between backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
              <div className="flex items-start gap-3">
                <Moon size={20} className="text-neutral-700 dark:text-neutral-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">
                    Dark Mode
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Toggle between light and dark themes.
                  </p>
                </div>
              </div>
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
              />
            </div>

            {/* Announcements Notifications */}
            <div className="rounded-xl p-4 mb-3 flex items-start justify-between backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
              <div className="flex items-start gap-3">
                <Bell size={20} className="text-neutral-700 dark:text-neutral-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">
                    Announcements
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Receive alerts for new estate announcements.
                  </p>
                </div>
              </div>
              <Toggle
                checked={annNotif}
                onChange={setAnnNotif}
              />
            </div>

            {/* Daily Gate Code Notifications */}
            <div className="rounded-xl p-4 flex items-start justify-between backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
              <div className="flex items-start gap-3">
                <Bell size={20} className="text-neutral-700 dark:text-neutral-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">
                    Daily Gate Code
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Get a notification for the new daily gate code.
                  </p>
                </div>
              </div>
              <Toggle
                checked={gateNotif}
                onChange={setGateNotif}
              />
            </div>
          </div>

          {/* PROGRESSIVE WEB APP Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide">
              Progressive Web App (PWA)
            </h3>

            <PWAInstallSection />
          </div>

          {/* ACCESSIBILITY Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide">
              Accessibility
            </h3>

            {/* Text Size */}
            <div className="rounded-xl p-4 mb-3 backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Accessibility size={20} className="text-neutral-700 dark:text-neutral-300 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white">
                      Text Size
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Adjust font size for better readability.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="12"
                  max="20"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="flex-1 h-2 bg-blue-200 dark:bg-blue-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {textSize}px
                </span>
              </div>
            </div>

            {/* Keyboard Navigation */}
            <div className="rounded-xl p-4 flex items-start justify-between backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
              <div className="flex items-start gap-3">
                <Accessibility size={20} className="text-neutral-700 dark:text-neutral-300 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white">
                    Keyboard Navigation
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Enable enhanced keyboard controls for easier navigation.
                  </p>
                </div>
              </div>
              <Toggle
                checked={keyboardNav}
                onChange={setKeyboardNav}
              />
            </div>
          </div>

          {/* ESTATE MANAGEMENT Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide">
              Estate Management
            </h3>

            <button className="w-full rounded-xl p-4 flex items-center justify-between transition backdrop-blur-md border border-neutral-200 hover:border-neutral-300" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
              <div className="flex items-center gap-3">
                <Images size={20} className="text-neutral-700 dark:text-neutral-300 flex-shrink-0" />
                <h4 className="font-bold text-neutral-900 dark:text-white">
                  Manage Estate Photos
                </h4>
              </div>
              <ChevronRight size={20} className="text-neutral-400 dark:text-neutral-600 flex-shrink-0" />
            </button>
          </div>

          {/* ACCOUNT Section */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-4 tracking-wide">
              Account
            </h3>

            <button
              onClick={handleLogout}
              className="w-full rounded-xl p-4 flex items-center gap-3 transition backdrop-blur-md border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
              style={{ background: "rgba(255, 255, 255, 0.85)" }}
            >
              <LogOut size={20} className="flex-shrink-0" />
              <h4 className="font-bold">Logout</h4>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
