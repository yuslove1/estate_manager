"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PhoneInput from "@/components/auth/PhoneInput";

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Code sent!");
        router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
      } else {
        toast.error(data.error || "Failed to send code. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col justify-center px-6 transition-colors -bg">

        {/* Main Content */}
        <div className="max-w-md mx-auto w-full pt-8">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white text-center mb-2">
            Enter your Phone Number
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8">
            We will send a verification code to Brentfield Estate
          </p>

          <PhoneInput onPhoneSubmit={handlePhoneSubmit} isLoading={isLoading} />

          {/* Dark Mode Toggle */}
          <div className="flex justify-center mt-8 text-sm">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>

        {/* Watermark */}
        <div className="fixed bottom-4 left-0 right-0 text-center text-xs text-neutral-400 dark:text-neutral-600">
          Made with Visily
        </div>
      </div>
    </div>
  );
}
