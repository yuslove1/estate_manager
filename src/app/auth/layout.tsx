import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { UserProvider } from "@/context/UserContext";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brentfield Estate Gate Pass - Login",
  description: "Enter your phone number to verify your estate access",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            background-image: url('/images/brentfieldDay.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
          }
          body.dark {
            background-image: url('/images/brentfieldNight.jpg');
          }
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.15);
            pointer-events: none;
            z-index: 0;
          }
          body.dark::before {
            background: rgba(10, 15, 30, 0.35);
          }
        `}</style>
      </head>
      <body className={`${inter.className} text-neutral-900 dark:text-white transition-colors duration-300`}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
