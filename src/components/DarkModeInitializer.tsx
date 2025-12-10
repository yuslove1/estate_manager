"use client";

import { useEffect } from "react";

function applyBackground(isDark: boolean) {
  const body = document.body;
  const html = document.documentElement;
  
  if (isDark) {
    html.classList.add("dark");
    body.style.backgroundImage = "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(15, 23, 42, 0.75) 100%), url('/images/brentfieldNight.jpg')";
    body.style.backgroundColor = "#0f172a";
  } else {
    html.classList.remove("dark");
    body.style.backgroundImage = "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(226, 232, 240, 0.4) 50%, rgba(255, 255, 255, 0.4) 100%), url('/images/brentfieldDay.jpg')";
    body.style.backgroundColor = "#f8fafc";
  }
  
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundAttachment = "fixed";
  body.style.backgroundRepeat = "no-repeat";
}

export default function DarkModeInitializer() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyBackground(savedTheme === "dark");

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      applyBackground(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
