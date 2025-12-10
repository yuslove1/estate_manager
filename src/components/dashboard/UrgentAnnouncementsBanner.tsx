"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { AlertCircle, X } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  message: string;
  is_important: boolean;
}

export default function UrgentAnnouncementsBanner() {
  const supabase = createClient();
  const [urgentAnnouncements, setUrgentAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUrgentAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_important", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading urgent announcements:", error);
          return;
        }

        setUrgentAnnouncements(data || []);
      } catch (err) {
        console.error("Failed to load urgent announcements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUrgentAnnouncements();

    const loadDismissed = () => {
      const stored = localStorage.getItem("dismissed_announcements");
      setDismissedIds(stored ? JSON.parse(stored) : []);
    };

    loadDismissed();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = (id: number) => {
    const newDismissed = [...dismissedIds, id];
    setDismissedIds(newDismissed);
    localStorage.setItem("dismissed_announcements", JSON.stringify(newDismissed));
  };

  const visibleAnnouncements = urgentAnnouncements.filter(
    (ann) => !dismissedIds.includes(ann.id)
  );

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {visibleAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className="border-l-4 border-red-600 rounded-lg p-4 backdrop-blur-md"
          style={{ background: "rgba(254, 226, 226, 0.9)" }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-900 text-sm">
                {announcement.title}
              </h3>
              <p className="text-sm text-red-800 mt-1">
                {announcement.message}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(announcement.id)}
              className="flex-shrink-0 text-red-700 hover:text-red-900 hover:bg-red-200 rounded-lg p-1 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
