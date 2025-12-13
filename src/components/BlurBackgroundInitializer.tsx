"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function BlurBackgroundInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    const style = document.getElementById("blur-style") || document.createElement("style");
    style.id = "blur-style";

    const isAuthPage = pathname?.startsWith("/auth") || pathname === "/";
    
    if (isAuthPage) {
      style.textContent = "body::before { backdrop-filter: none !important; }";
    } else {
      style.textContent = "body::before { backdrop-filter: blur(3px) !important; background-color: rgba(255, 255, 255, 0.35); }";
    }

    if (!document.getElementById("blur-style")) {
      document.head.appendChild(style);
    }
  }, [pathname]);

  return null;
}
