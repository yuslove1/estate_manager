// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { Shield } from "lucide-react";
// import PhoneInputField from "@/components/auth/PhoneInputField";
// import Image from "next/image";

// export default function LoginPage() {
//   const [phone, setPhone] = useState("");
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setIsDarkMode(savedTheme === "dark");
//     if (savedTheme === "dark") {
//       document.documentElement.classList.add("dark");
//     }
//   }, []);

//   const handleSendOTP = async () => {
//     if (!phone || phone.length < 10) {
//       toast.error("Please enter a valid phone number");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         toast.success("Code sent!");
//         router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
//       } else {
//         toast.error(data.error || "Failed to send code. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     const newDarkMode = !isDarkMode;
//     setIsDarkMode(newDarkMode);
//     localStorage.setItem("theme", newDarkMode ? "dark" : "light");
//     if (newDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   };

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 py-8 transition-colors duration-200"
//       style={{
//         backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/images/estate1.jpg')",
//         backgroundAttachment: "fixed",
//       }}
//       >
//       {/* App Icon */}
//       <div className="mb-6 mt-8">
//         <div className="bg-teal-500 rounded-3xl p-4 shadow-lg">
//           <Shield size={56} className="text-white" />
//         </div>
//       </div>

//       {/* Main White Card */}
//       <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-8 transition-colors">
//         {/* Heading */}
//         <div className="text-center space-y-3">
//           <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
//             Enter your Phone Number
//           </h1>
//           <p className="text-base text-neutral-600 dark:text-neutral-400">
//             We will send a verification code to your phone.
//           </p>
//         </div>

//         {/* Phone Input */}
//         <PhoneInputField value={phone} onChange={setPhone} />

//         {/* Send OTP Button */}
//         <button
//           onClick={handleSendOTP}
//           disabled={isLoading || !phone}
//           className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-lg"
//         >
//           {isLoading ? "Sending..." : "Send OTP"}
//         </button>
//       </div>

//       {/* Bottom Section */}
//       <div className="mt-16 text-center space-y-6 w-full max-w-md">
//         <p className="text-neutral-800 dark:text-neutral-200 font-semibold text-lg">
//           Welcome to Brentfield Estate
//         </p>

//         {/* Images */}
//         <div className="flex justify-center gap-6">
//           <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
//             <Image
//               src="/images/appIcon1.png"
//               alt="Estate"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
//             <Image
//               src="/images/appIcon2.png"
//               alt="Estate"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
//             <Image
//               src="/images/estate2.jpg"
//               alt="Estate"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>

//         {/* Dark Mode Toggle */}
//         <div className="flex justify-center items-center gap-3 mt-6">
//           <button
//             onClick={toggleDarkMode}
//             className={`relative w-12 h-7 rounded-full transition-colors ${
//               isDarkMode ? "bg-neutral-700" : "bg-neutral-300"
//             }`}
//           >
//             <div
//               className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
//                 isDarkMode ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//           <span className="text-sm text-neutral-700 dark:text-neutral-300">
//             Dark Mode
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Shield } from "lucide-react";
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
  const { setConfirmationResult } = useUser();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    checkFirebaseConfig();
    checkDomainWhitelist();

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
      console.log("Reusing existing RecaptchaVerifier");
      return recaptchaVerifierRef.current;
    }

    try {
      console.log("Creating new RecaptchaVerifier...");
      console.log("reCAPTCHA container exists:", !!document.getElementById("recaptcha-container"));
      console.log("auth object valid:", !!auth);

      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "normal",
        callback: (response: string) => {
          console.log("✓ reCAPTCHA verified with token:", response.substring(0, 20) + "...");
        },
        "expired-callback": () => {
          console.warn("⚠ reCAPTCHA expired");
          recaptchaVerifierRef.current = null;
          toast.error("reCAPTCHA expired — try again");
        },
        "error-callback": () => {
          console.error("✗ reCAPTCHA error");
          recaptchaVerifierRef.current = null;
          toast.error("reCAPTCHA error — refresh page");
        },
      });

      console.log("✓ RecaptchaVerifier created successfully");
      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch (err) {
      console.error("✗ reCAPTCHA init failed:", err);
      recaptchaVerifierRef.current = null;
      throw new Error("Failed to initialize reCAPTCHA. Ensure reCAPTCHA script is loaded.");
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
          toast.error("You're not in the residential list, contact the brentfield CDA");
          return;
        }
        throw new Error(validationData.error || "Validation failed");
      }

      console.log("Initializing reCAPTCHA...");
      const recaptchaVerifier = await initializeRecaptcha();

      console.log("Sending OTP to:", formattedPhone);
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
      console.error("Firebase error code:", error?.code);
      console.error("Firebase error message:", error?.message);
      console.error("Full error:", err);

      recaptchaVerifierRef.current = null;

      let msg = "Failed to send OTP";
      
      if (error?.code === "auth/invalid-app-credential") {
        console.error("INVALID APP CREDENTIAL - Check these settings:");
        console.error("1. Firebase Console → Authentication → Phone");
        console.error("2. Is Phone Provider ENABLED?");
        console.error("3. Firebase Console → Settings → Authorized Domains");
        console.error("4. Is your domain listed? Current domain:", window.location.hostname);
        console.error("5. reCAPTCHA Enterprise or Admin Console configured?");
        msg = "⚠️ Phone Auth setup incomplete. Check browser console for details.";
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

  return (
    <div
      className="min-h-screen bg-transparent flex flex-col justify-center items-center px-4 py-8"
    >
      <div className="mb-6">
        <div className="bg-teal-500 rounded-3xl p-4 shadow-lg backdrop-blur-md">
          <Shield size={56} className="text-white" />
        </div>
      </div>

      <div className="rounded-3xl w-full max-w-md p-8 space-y-8 backdrop-blur-md border border-neutral-200" style={{ background: "rgba(255, 255, 255, 0.95)" }}>
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Enter your Phone Number</h1>
          <p className="text-base text-gray-600">
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

      <div className="mt-16 text-center space-y-6 w-full max-w-md">
        <p className="text-neutral-800 font-semibold text-lg">
          Welcome to Brentfield Estate
        </p>
        <div className="flex justify-center gap-6">
          <Image src="/images/appIcon1.png" alt="Estate" width={80} height={80} className="rounded-xl shadow-md" />
          <Image src="/images/appIcon2.png" alt="Estate" width={80} height={80} className="rounded-xl shadow-md" />
          <Image src="/images/estate2.jpg" alt="Estate" width={80} height={80} className="rounded-xl shadow-md" />
        </div>
      </div>
    </div>
  );
}