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
      <body className={`${inter.className} text-neutral-900 dark:text-white transition-colors duration-300`} style={{ backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", minHeight: "100vh" }}>
        <UserProvider>
          {children}
          <Toaster position="top-right" />
        </UserProvider>
      </body>
    </html>
  );
}
