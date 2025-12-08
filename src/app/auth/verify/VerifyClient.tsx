"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { setCookie } from "cookies-next";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useUser } from "@/context/UserContext";

export default function VerifyClient() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const { confirmationResult } = useUser();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter 6-digit code");
      return;
    }

    if (!confirmationResult) {
      console.error("No confirmation result in context");
      toast.error("Session expired — resend code");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Confirming OTP...");
      const result = await confirmationResult.confirm(otp);
      console.log("OTP confirmed successfully:", result.user.uid);

      if (!phone) {
        throw new Error("Phone number missing from URL");
      }

      console.log("Setting cookie for phone:", phone);
      setCookie("verified_phone", phone, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      toast.success("Welcome to Brentfield!");
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Verify error code:", error?.code);
      console.error("Verify error message:", error?.message);
      
      if (error?.code === "auth/invalid-verification-code") {
        toast.error("Wrong code — try again");
      } else if (error?.code === "auth/code-expired") {
        toast.error("Code expired — resend a new one");
        router.push("/auth/login");
      } else if (error?.message?.includes("Phone number")) {
        toast.error("Session error — start over");
        router.push("/auth/login");
      } else {
        toast.error(error?.message || "Verification failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!phone) return null;

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/images/estate1.jpg')" }}>
      
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Verify Code</h1>
        <p className="text-gray-600 mb-8">We sent a code to {phone}</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="w-full text-5xl font-bold text-center tracking-widest bg-gray-100 py-8 rounded-2xl mb-6 focus:outline-none focus:ring-4 focus:ring-blue-500"
          maxLength={6}
        />

        <PrimaryButton onClick={handleVerify} loading={isLoading} disabled={otp.length !== 6}>
          Verify & Enter
        </PrimaryButton>

        <button
          onClick={() => router.push("/auth/login")}
          className="w-full mt-3 text-sm text-blue-600 hover:underline"
        >
          Back to Phone Number
        </button>
      </div>
    </div>
  );
}
