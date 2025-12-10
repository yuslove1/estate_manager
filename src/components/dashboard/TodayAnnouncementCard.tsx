import Image from "next/image";
import { format } from "date-fns";

interface TodayAnnouncementCardProps {
  id: string;
  title: string;
  created_at: string;
  message?: string;
}

export default function TodayAnnouncementCard({
  id,
  title,
  created_at,
}: TodayAnnouncementCardProps) {
  return (
    <div className="flex-shrink-0 w-48 rounded-xl overflow-hidden backdrop-blur-sm border border-neutral-300 dark:border-neutral-700" style={{ background: "rgba(255, 255, 255, 0.85)" }}>
      <div className="relative w-full h-32 bg-gradient-to-br from-teal-200 to-teal-300 dark:from-teal-900 dark:to-teal-800">
        <Image
          src={`https://picsum.photos/200/150?random=${id}`}
          alt={title}
          fill
          className="object-cover opacity-80"
          unoptimized
        />
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
          {title}
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          {format(new Date(created_at), "d MMM")}
        </p>
      </div>
    </div>
  );
}
