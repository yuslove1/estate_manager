"use client";

import { useState, useEffect } from "react";
import { Wifi } from "lucide-react";

export default function OfflinePage() {
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem("last_gate_code");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastCode(savedCode);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md backdrop-blur-md rounded-xl p-6" style={{ background: "rgba(255, 255, 255, 0.9)" }}>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </main>
    );
  }

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
          onClick={() => window.location.reload()}
          className="w-full text-white font-bold py-3 px-6 rounded-full transition backdrop-blur-md border border-blue-400"
          style={{ background: "rgba(59, 130, 246, 0.9)" }}
        >
          Retry Connection
        </button>
      </div>
    </main>
  );
}
