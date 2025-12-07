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
    <div className="flex-shrink-0 w-48 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
      <div className="relative w-full h-32 bg-gray-300 dark:bg-gray-700">
        <Image
          src={`https://picsum.photos/200/150?random=${id}`}
          alt={title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          {format(new Date(created_at), "d MMM")}
        </p>
      </div>
    </div>
  );
}
