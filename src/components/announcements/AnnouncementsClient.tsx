"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";
import AnnouncementCard from "./AnnouncementCard";

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

interface AnnouncementsClientProps {
  announcements: Announcement[];
}

export default function AnnouncementsClient({ announcements }: AnnouncementsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    if (selectedAnnouncement) {
      document.body.style.overflow = "hidden";
      const bottomNav = document.querySelector('nav[role="navigation"]');
      if (bottomNav) {
        (bottomNav as HTMLElement).style.display = "none";
      }
    } else {
      document.body.style.overflow = "unset";
      const bottomNav = document.querySelector('nav[role="navigation"]');
      if (bottomNav) {
        (bottomNav as HTMLElement).style.display = "";
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      const bottomNav = document.querySelector('nav[role="navigation"]');
      if (bottomNav) {
        (bottomNav as HTMLElement).style.display = "";
      }
    };
  }, [selectedAnnouncement]);

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) {
      return announcements;
    }

    const query = searchQuery.toLowerCase();
    return announcements.filter(
      (ann) =>
        ann.title.toLowerCase().includes(query) || ann.message.toLowerCase().includes(query)
    );
  }, [announcements, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-500" size={20} />
        <input
          type="text"
          placeholder="Search announcements…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 pl-12 pr-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Announcement List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400">
            {searchQuery ? "No announcements match your search" : "No announcements yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              {...announcement}
              onClick={() => setSelectedAnnouncement(announcement)}
            />
          ))}
        </div>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-t-3xl sm:rounded-2xl w-full sm:w-full sm:max-w-md max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white pr-4 flex-1">
                {selectedAnnouncement.title}
              </h2>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {new Date(selectedAnnouncement.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed">
              {selectedAnnouncement.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
