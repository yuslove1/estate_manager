import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/context/UserContext";
import BlurBackgroundInitializer from "@/components/BlurBackgroundInitializer";

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
          <BlurBackgroundInitializer />
          <main className="relative z-10 min-h-screen bg-transparent">
            {children}
          </main>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '500',
                boxShadow: '0 10px 35px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
              },
              success: {
                style: {
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
            }}
          />
        </UserProvider>
      </body>
    </html>
  );
}