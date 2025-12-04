"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import { setCookie } from "cookies-next";

export default function VerifyPhone() {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    if (!phone || !isPossiblePhoneNumber(phone)) {
      setError("Enter a valid Nigerian number");
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
      setStep("otp");
    } else {
      setError(data.error || "Failed. Is your number in the estate list?");
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
      // ONE-TIME LOGIN — lasts 1 year, production-safe
      setCookie("verified_phone", phone, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",  // Secure in production
      });

      window.location.href = "/gate";
    } else {
      setError(data.error || "Invalid code");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-4">
          Brentfield Estate
        </h1>
        <p className="text-slate-300 mb-12">
          {step === "phone"
            ? "Enter your estate WhatsApp number to continue"
            : `Enter the code sent to ${phone}`}
        </p>

        {step === "phone" ? (
          <>
            <PhoneInput
              international
              defaultCountry="NG"
              value={phone}
              onChange={(v) => setPhone(v || "")}
              className="mb-6"
              placeholder="0801 234 5678"
            />
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Code via WhatsApp"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full text-center text-4xl tracking-widest bg-slate-800 py-6 rounded-xl mb-6 text-white placeholder-slate-400"
              maxLength={6}
            />
            <button
              onClick={verifyOTP}
              className="w-full py-4 bg-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-500"
            >
              Verify & Enter
            </button>
          </>
        )}

        {error && <p className="text-red-400 mt-6">{error}</p>}
      </div>
    </div>
  );
}