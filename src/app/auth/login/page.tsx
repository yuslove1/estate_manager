"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PhoneInputField from "@/components/auth/PhoneInputField";
import Image from "next/image";
import { auth } from "@/utils/firebase/config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useUser } from "@/context/UserContext";
import { checkFirebaseConfig, checkDomainWhitelist } from "./diagnostics";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setConfirmationResult, darkMode, setDarkMode, user, loading } =
    useUser();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    checkFirebaseConfig();
    checkDomainWhitelist();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const initializeRecaptcha = async () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    try {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        callback: (response: string) => {
          // reCAPTCHA verified
        },
        "expired-callback": () => {
          recaptchaVerifierRef.current = null;
          toast.error("reCAPTCHA expired — try again");
        },
        "error-callback": () => {
          recaptchaVerifierRef.current = null;
          toast.error("reCAPTCHA error — refresh page");
        },
      });

      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch {
      recaptchaVerifierRef.current = null;
      throw new Error(
        "Failed to initialize reCAPTCHA. Ensure reCAPTCHA script is loaded."
      );
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      let formattedPhone = phone.replace(/\s|-/g, "");
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+234" + formattedPhone.slice(1);
      } else if (formattedPhone.startsWith("234")) {
        formattedPhone = "+234" + formattedPhone.slice(3);
      } else if (!formattedPhone.startsWith("+234")) {
        formattedPhone = "+234" + formattedPhone;
      }

      console.log("Validating phone in database...");
      const validationRes = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      if (!validationRes.ok) {
        const validationData = await validationRes.json();
        if (validationRes.status === 403) {
          toast.error(
            "You're not in the residential list, contact the brentfield CDA"
          );
          return;
        }
        throw new Error(validationData.error || "Validation failed");
      }

      const recaptchaVerifier = await initializeRecaptcha();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier
      );

      setConfirmationResult(confirmationResult);
      recaptchaVerifierRef.current = null;
      toast.success("OTP sent!");
      router.push(`/auth/verify?phone=${encodeURIComponent(formattedPhone)}`);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };

      recaptchaVerifierRef.current = null;

      let msg = "Failed to send OTP";

      if (error?.code === "auth/invalid-app-credential") {
        msg = "Phone Auth not configured. Contact support.";
      } else if (error?.code === "auth/invalid-phone-number") {
        msg = "Invalid phone number — use format 080xxxxxxxxx";
      } else if (error?.code === "auth/too-many-requests") {
        msg = "Too many attempts — wait a few minutes";
      } else if (error?.code === "auth/network-request-failed") {
        msg = "Network error — check your internet";
      } else if (error?.message) {
        msg = error.message;
      }

      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center items-center px-4 py-8">
      <div className="mb-6 max-w-40 wax-h-40">
        <img
          src="/images/Logo.png"
          alt="Brentfield Estate Logo"
          className="rounded-2xl w-full h-full object-contain"
        />
      </div>

      <div className="rounded-3xl w-full max-w-md p-8 space-y-8 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Enter your Phone Number
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            We will send a verification code to your phone.
          </p>
        </div>

        <PhoneInputField value={phone} onChange={setPhone} />

        {/* reCAPTCHA Container */}
        <div id="recaptcha-container" className="flex justify-center my-4" />

        <button
          onClick={handleSendOTP}
          disabled={isLoading || !phone}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition text-lg"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </button>
      </div>

      <div className="mt-16 text-center space-y-6 w-full max-w-md bg-blend-darken">
        <p className="text-neutral-800 dark:text-neutral-200 font-semibold text-lg">
          Welcome to Brentfield Estate
        </p>
        <div className="flex justify-center gap-6">
          <div className="mb-6 max-w-20 wax-h-20">
            <img
              src="/images/Logo.png"
              alt="Brentfield Estate Logo"
              className="w-full h-full object-contain border-none"
            />
          </div>

          <div className="mb-6 max-w-40 wax-h-40">
            <img
              src="/images/brentfield.png"
              alt="Brentfield Estate Logo"
              className="w-full h-full object-contain border-none"
            />
          </div>

          <div className="mb-6 max-w-20 wax-h-20">
            <img
              src="/images/Logo.png"
              alt="Brentfield Estate Logo"
              className="w-full h-full object-contain border-none"
            />
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-neutral-700" : "bg-neutral-300"
            }`}
            aria-label="Toggle dark mode"
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                darkMode ? "translate-x-6" : "translate-x-0.5"
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
