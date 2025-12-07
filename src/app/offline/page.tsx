import { Wifi } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
            <Wifi size={48} className="text-red-600 dark:text-red-400" strokeWidth={1} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
          No Internet Connection
        </h1>

        <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-6">
          Last code loaded:
        </p>

        <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-8 mb-8">
          <div className="text-5xl font-bold text-green-700 dark:text-green-400">
            123456
          </div>
        </div>

        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-8">
          You can still view cached codes and announcements.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition mb-8"
        >
          Retry Connection
        </button>
      </div>
    </main>
  );
}
