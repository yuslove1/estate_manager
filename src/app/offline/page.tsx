"use client";

import { useState, useEffect } from "react";
import { Wifi, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await fetch("/manifest.json", {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

export default function OfflinePage() {
  const router = useRouter();
  const [lastCode, setLastCode] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("last_gate_code")
      : null
  );
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const isOnline = await checkNetworkConnectivity();
      if (isOnline) {
        router.push("/dashboard");
      } else {
        setIsRetrying(false);
      }
    } catch {
      setIsRetrying(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center max-w-md backdrop-blur-md rounded-2xl p-8 border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.95)" }}>
        <div className="mb-6 flex justify-center">
          <div className="rounded-full p-4 backdrop-blur-sm" style={{ background: "rgba(254, 226, 226, 0.9)" }}>
            <Wifi size={48} className="text-red-600" strokeWidth={1} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-red-600 mb-4">
          No Internet Connection
        </h1>

        {lastCode ? (
          <>
            <p className="text-neutral-700 text-sm mb-4">
              Internet is down. Last code saved:
            </p>

            <div className="rounded-2xl p-8 mb-8 border-2 border-green-300 backdrop-blur-sm" style={{ background: "rgba(220, 252, 231, 0.9)" }}>
              <div className="text-6xl font-bold tracking-widest text-green-700 mb-2">
                {lastCode}
              </div>
              <p className="text-xs text-green-700">Last saved code</p>
            </div>
          </>
        ) : (
          <div className="rounded-2xl p-6 mb-8 border border-yellow-300 backdrop-blur-sm" style={{ background: "rgba(254, 252, 232, 0.9)" }}>
            <p className="text-neutral-700 text-sm">
              No cached gate code available. Please restore internet connection to load the code.
            </p>
          </div>
        )}

        <p className="text-neutral-700 text-sm mb-8">
          You can view cached announcements when internet is restored.
        </p>

        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full text-white font-bold py-3 px-6 rounded-full transition backdrop-blur-md border border-blue-400 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: "rgba(59, 130, 246, 0.9)" }}
        >
          {isRetrying && <Loader size={20} className="animate-spin" />}
          {isRetrying ? "Checking Connection..." : "Retry Connection"}
        </button>
      </div>
    </main>
  );
}
