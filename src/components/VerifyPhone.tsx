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
      setError(data.error || "Number not in estate list");
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
      // ONE-TIME LOGIN — lasts 1 year
      setCookie("verified_phone", phone, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });

      window.location.href = "/gate";
    } else {
      setError(data.error || "Wrong code");
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
            ? "Enter your estate number to continue"
            : `Enter the code sent to ${phone}`}
        </p>

        {step === "phone" ? (
          <>
            <div className="relative mb-6">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="NG"
                value={phone}
                onChange={(v) => setPhone(v || "")}
                placeholder="Enter phone number"
                className="custom-phone-input"
              />
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || !phone}
              className="w-full py-4 bg-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="------"
              className="w-full text-center text-5xl md:text-6xl font-bold tracking-widest 
             bg-slate-800/90 border-2 border-slate-700 rounded-2xl py-8 mb-6
             text-white placeholder-slate-500
             focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/30
             transition-all"
            />
            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full py-4 bg-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Enter Gate"}
            </button>
          </>
        )}

        {error && <p className="text-red-400 mt-6">{error}</p>}
      </div>
    </div>
  );
}