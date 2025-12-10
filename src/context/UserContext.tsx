"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Resident } from "@/utils/supabase/types";
import type { ConfirmationResult } from "firebase/auth";

interface UserContextType {
  user: Resident | null;
  loading: boolean;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  annNotif: boolean;
  setAnnNotif: (enabled: boolean) => void;
  gateNotif: boolean;
  setGateNotif: (enabled: boolean) => void;
  textSize: number;
  setTextSize: (size: number) => void;
  keyboardNav: boolean;
  setKeyboardNav: (enabled: boolean) => void;
  refreshUser: () => Promise<void>;
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: (result: ConfirmationResult | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const confirmationResultStore: { current: ConfirmationResult | null } = { current: null };

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkModeState] = useState(false);
  const [annNotif, setAnnNotifState] = useState(true);
  const [gateNotif, setGateNotifState] = useState(true);
  const [textSize, setTextSizeState] = useState(16);
  const [keyboardNav, setKeyboardNavState] = useState(false);
  const [confirmationResult, setConfirmationResultState] = useState<ConfirmationResult | null>(null);

  const setConfirmationResult = (result: ConfirmationResult | null) => {
    setConfirmationResultState(result);
    confirmationResultStore.current = result;
  };

  useEffect(() => {
    return () => {
      confirmationResultStore.current = null;
    };
  }, []);

  const supabase = createClient();

  const loadPreferences = useCallback(() => {
    const savedDarkMode = localStorage.getItem("theme") === "dark";
    const savedAnnNotif = localStorage.getItem("pref_ann_notif") !== "false";
    const savedGateNotif = localStorage.getItem("pref_gate_notif") !== "false";
    const savedTextSize = Number(localStorage.getItem("pref_text_size")) || 16;
    const savedKeyboardNav = localStorage.getItem("pref_keyboard_nav") === "true";

    setDarkModeState(savedDarkMode);
    setAnnNotifState(savedAnnNotif);
    setGateNotifState(savedGateNotif);
    setTextSizeState(savedTextSize);
    setKeyboardNavState(savedKeyboardNav);

    applyDarkMode(savedDarkMode);
    applyTextSize(savedTextSize);
    applyKeyboardNav(savedKeyboardNav);
  }, []);

  const normalizePhoneNumber = (phone: string): string => {
    let normalized = phone.replace(/\s|-/g, "");
    if (normalized.startsWith("+234")) {
      normalized = "0" + normalized.slice(4);
    } else if (normalized.startsWith("234")) {
      normalized = "0" + normalized.slice(3);
    }
    return normalized;
  };

  const initializeUser = useCallback(async () => {
    try {
      const cookies = document.cookie.split("; ");
      const verifiedPhoneCookie = cookies.find((cookie) =>
        cookie.startsWith("verified_phone=")
      );

      if (verifiedPhoneCookie) {
        const phoneFromCookie = decodeURIComponent(verifiedPhoneCookie.split("=")[1]);
        if (phoneFromCookie) {
          const normalizedPhone = normalizePhoneNumber(phoneFromCookie);
          const { data, error } = await supabase
            .from("residents")
            .select("*")
            .eq("phone", normalizedPhone)
            .single();

          if (error) {
            console.error("User lookup error:", error);
            throw error;
          }
          if (data) setUser(data as Resident);
        }
      }
    } catch (error) {
      console.error("Failed to initialize user:", error);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPreferences();
    initializeUser();
  }, [initializeUser, loadPreferences]);

  const fetchUserData = async (phone: string) => {
    try {
      const normalizedPhone = normalizePhoneNumber(phone);
      const { data, error } = await supabase
        .from("residents")
        .select("*")
        .eq("phone", normalizedPhone)
        .single();

      if (error) throw error;
      if (data) setUser(data as Resident);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const refreshUser = async () => {
    if (user?.phone) {
      await fetchUserData(user.phone);
    }
  };

  const setDarkMode = (enabled: boolean) => {
    setDarkModeState(enabled);
    applyDarkMode(enabled);
    localStorage.setItem("theme", enabled ? "dark" : "light");
  };

  const setAnnNotif = (enabled: boolean) => {
    setAnnNotifState(enabled);
    localStorage.setItem("pref_ann_notif", String(enabled));
  };

  const setGateNotif = (enabled: boolean) => {
    setGateNotifState(enabled);
    localStorage.setItem("pref_gate_notif", String(enabled));
  };

  const setTextSize = (size: number) => {
    setTextSizeState(size);
    applyTextSize(size);
    localStorage.setItem("pref_text_size", String(size));
  };

  const setKeyboardNav = (enabled: boolean) => {
    setKeyboardNavState(enabled);
    applyKeyboardNav(enabled);
    localStorage.setItem("pref_keyboard_nav", String(enabled));
  };

  const applyDarkMode = (enabled: boolean) => {
    const html = document.documentElement;
    const body = document.body;
    
    if (enabled) {
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
  };

  const applyTextSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}px`;
  };

  const applyKeyboardNav = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("keyboard-nav");
    } else {
      document.documentElement.classList.remove("keyboard-nav");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        darkMode,
        setDarkMode,
        annNotif,
        setAnnNotif,
        gateNotif,
        setGateNotif,
        textSize,
        setTextSize,
        keyboardNav,
        setKeyboardNav,
        refreshUser,
        confirmationResult,
        setConfirmationResult,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
