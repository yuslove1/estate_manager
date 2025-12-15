"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function OfflineDetector() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleOffline = () => {
      if (pathname !== "/offline" && pathname !== "/auth/login" && pathname !== "/") {
        router.push("/offline");
      }
    };

    const handleOnline = () => {
      if (pathname === "/offline") {
        router.push("/dashboard");
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    if (!navigator.onLine && pathname !== "/offline" && pathname !== "/auth/login" && pathname !== "/") {
      router.push("/offline");
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [router, pathname]);

  return null;
}
