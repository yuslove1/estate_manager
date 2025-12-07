"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { setCookie } from "cookies-next";
import toast from "react-hot-toast";

export default function VerifyPhone() {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    if (!phone || !isPossiblePhoneNumber(phone)) {
      toast.error("Enter a valid Nigerian number");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Code sent!");
      setStep("otp");
    } else {
      toast.error(data.error || "Failed. Is your number in the estate list?");
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();

    if (data.success) {
      setCookie("verified_phone", phone, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      toast.success("Welcome to Brentfield!");
      window.location.href = "/dashboard";
    } else {
      toast.error(data.error || "Invalid code");
    }
    setLoading(false);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-4">Brentfield Estate</h1>
      <p className="text-[var(--text-light)] mb-8">
        {step === "phone"
          ? "Enter your estate number to continue"
          : `Enter the code sent to ${phone}`}
      </p>

      {step === "phone" ? (
        <>
          <PhoneInput
            international
            defaultCountry="NG"
            value={phone}
            onChange={(v) => setPhone(v || "")}
            className="mb-6 [&_input]:bg-white [&_input]:border-[var(--border-light)] [&_input]:rounded-xl [&_input]:p-4 [&_input]:text-lg [&_input]:placeholder-[var(--text-light)]"
          />
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full py-4 bg-[var(--accent-turquoise)] text-white rounded-xl font-bold text-lg hover:bg-blue-500 disabled:opacity-50 transition"
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="w-full text-center text-4xl font-bold tracking-widest bg-white border-[var(--border-light)] p-6 rounded-xl text-[var(--text-dark)] placeholder-[var(--text-light)] focus:ring-4 focus:ring-[var(--accent-turquoise)]/30"
              maxLength={6}
            />
          </div>
          <button
            onClick={verifyOTP}
            disabled={loading}
            className="w-full py-4 bg-[var(--accent-green)] text-white rounded-xl font-bold text-lg hover:bg-green-500 disabled:opacity-50 transition"
          >
            {loading ? "Verifying..." : "Verify & Enter"}
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}