import TodayAnnouncementCard from "./TodayAnnouncementCard";

interface Announcement {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

interface TodayAnnouncementsProps {
  announcements: Announcement[];
}

export default function TodayAnnouncements({
  announcements,
}: TodayAnnouncementsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
        Today&apos;s Announcements
      </h2>

      {announcements.length === 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            No announcements for today
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {announcements.map((announcement) => (
            <TodayAnnouncementCard
              key={announcement.id}
              {...announcement}
            />
          ))}
        </div>
      )}
    </div>
  );
}
