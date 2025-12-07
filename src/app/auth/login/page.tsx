"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";
import PhoneInputField from "@/components/auth/PhoneInputField";
import Image from "next/image";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setIsDarkMode(savedTheme === "dark");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 py-8 transition-colors duration-200"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/images/estate1.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* App Icon */}
      <div className="mb-6 mt-8">
        <div className="bg-teal-500 rounded-3xl p-4 shadow-lg">
          <Shield size={56} className="text-white" />
        </div>
      </div>

      {/* Main White Card */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-8 transition-colors">
        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Enter your Phone Number
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            We will send a verification code to your phone.
          </p>
        </div>

        {/* Phone Input */}
        <PhoneInputField value={phone} onChange={setPhone} />

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          disabled={isLoading || !phone}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-lg"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </div>

      {/* Bottom Section */}
      <div className="mt-16 text-center space-y-6 w-full max-w-md">
        <p className="text-neutral-800 dark:text-neutral-200 font-semibold text-lg">
          Welcome to Brentfield Estate
        </p>

        {/* Images */}
        <div className="flex justify-center gap-6">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/appIcon1.png"
              alt="Estate"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/appIcon2.png"
              alt="Estate"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/estate2.jpg"
              alt="Estate"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              isDarkMode ? "bg-neutral-700" : "bg-neutral-300"
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isDarkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            Dark Mode
          </span>
        </div>
      </div>
    </div>
  );
}
