"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    await fetch("/manifest.json", {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
};

export default function OfflineDetector() {
  const router = useRouter();
  const pathname = usePathname();
  const isCheckingRef = useRef(false);
  const lastStatusRef = useRef<boolean | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const performCheck = async () => {
      if (isCheckingRef.current) return;
      
      isCheckingRef.current = true;
      try {
        const isOnline = await checkNetworkConnectivity();
        
        if (lastStatusRef.current === null) {
          lastStatusRef.current = isOnline;
        }
        
        if (lastStatusRef.current && !isOnline && pathname !== "/offline" && pathname !== "/auth/login" && pathname !== "/") {
          lastStatusRef.current = false;
          router.push("/offline");
        } else if (!lastStatusRef.current && isOnline && pathname === "/offline") {
          lastStatusRef.current = true;
          router.push("/dashboard");
        } else {
          lastStatusRef.current = isOnline;
        }
      } catch (error) {
        console.error("Network check error:", error);
      } finally {
        isCheckingRef.current = false;
      }
    };

    performCheck();
    const checkInterval = setInterval(performCheck, 4000);

    return () => {
      clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, pathname]);

  return null;
}
