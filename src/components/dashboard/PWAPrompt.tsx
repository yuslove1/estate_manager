"use client";

import { Download, X } from "lucide-react";
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 flex items-start gap-3">
      <Download className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" size={20} />

      <div className="flex-1">
        <h3 className="font-bold text-blue-900 dark:text-blue-100">
          Add to Home Screen
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Get full app experience and offline access.
        </p>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleInstall}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 p-1 rounded transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
