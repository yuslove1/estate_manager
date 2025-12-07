"use client";

import { useState } from "react";
import { WifiOff } from "lucide-react";

interface NoConnectionProps {
  lastCodeLoadedTime?: string;
}

export default function NoConnection({ lastCodeLoadedTime }: NoConnectionProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col items-center justify-center px-6">
      {/* Content */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 pt-12">
        {/* WiFi Icon */}
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-full p-6">
          <WifiOff size={48} className="text-neutral-600 dark:text-neutral-400" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            No Internet Connection
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {lastCodeLoadedTime
              ? `Last code loaded: ${lastCodeLoadedTime}`
              : "Please check your network connection"}
          </p>
        </div>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-8 rounded-lg font-semibold transition active:scale-95"
        >
          {isRetrying ? "Retrying..." : "Retry Connection"}
        </button>

        {/* Info Text */}
        <p className="text-xs text-neutral-500 dark:text-neutral-500 max-w-xs">
          Your last gate code is still available offline. Try connecting to WiFi or mobile data to refresh.
        </p>
      </div>
    </div>
  );
}
