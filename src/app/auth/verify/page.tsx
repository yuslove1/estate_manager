// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import toast from "react-hot-toast";
// import { setCookie } from "cookies-next";
// import PrimaryButton from "@/components/ui/PrimaryButton";

// export default function VerifyPage() {
//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const phone = searchParams.get("phone");

//   useEffect(() => {
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     setIsDarkMode(prefersDark);

//     if (!phone) {
//       router.push("/auth/login");
//     }
//   }, [phone, router]);

//   const handleVerify = async () => {
//     if (!otp || otp.length !== 6) {
//       toast.error("Please enter a 6-digit code");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, otp }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setCookie("verified_phone", phone, {
//           maxAge: 60 * 60 * 24 * 365,
//           path: "/",
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//         });
//         toast.success("Welcome to Brentfield!");
//         router.push("/dashboard");
//       } else {
//         toast.error(data.error || "Invalid code. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again.");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!phone) {
//     return null;
//   }

//   return (
//     <div className={isDarkMode ? "dark" : ""}>
//       {/* <div className="min-h-screen bg-white dark:bg-neutral-900 flex flex-col justify-center px-6 transition-colors"> */}
//         <div
//       className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-4 py-8 transition-colors duration-200"
//       style={{
//         backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('/images/estate1.jpg')",
//         backgroundAttachment: "fixed",
//       }}
//       >
//         {/* Main Content */}
//         <div className="max-w-md mx-auto w-full pt-8">
//           <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white text-center mb-2">
//             Enter Verification Code
//           </h1>
//           <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-8">
//             We sent a code to {phone}
//           </p>

//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//             placeholder="000000"
//             maxLength={6}
//             className="w-full h-14 text-center text-4xl font-bold tracking-widest rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 focus:ring-2 focus:ring-blue-600 dark:bg-neutral-800 dark:text-white bg-white text-neutral-900 placeholder-neutral-300 dark:placeholder-neutral-600 transition mb-6"
//           />

//           <PrimaryButton onClick={handleVerify} loading={isLoading} disabled={otp.length !== 6}>
//             Verify & Enter
//           </PrimaryButton>

//           <button
//             onClick={() => router.push("/auth/login")}
//             className="w-full mt-3 text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             Back to Phone Number
//           </button>

//           {/* Dark Mode Toggle */}
//           <div className="flex justify-center mt-8 text-sm">
//             <button
//               onClick={() => setIsDarkMode(!isDarkMode)}
//               className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
//             >
//               {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//             </button>
//           </div>
//         </div>


//       </div>
//     </div>
//   );
// }

import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('/images/estate1.jpg')" }}>
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyClient />
    </Suspense>
  );
}