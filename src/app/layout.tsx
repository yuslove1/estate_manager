import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";
import DarkModeInitializer from "@/components/DarkModeInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brentfield Estate Gate Pass",
  description: "Daily gate pass & estate announcements",
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.google.com/recaptcha/api.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors`}>
        <DarkModeInitializer />
        <UserProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}