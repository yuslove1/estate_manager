import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Dot } from "lucide-react";

interface AnnouncementCardProps {
  id: string;
  title: string;
  message: string;
  created_at: string;
  isRead?: boolean;
  onClick?: () => void;
}

export default function AnnouncementCard({
  title,
  message,
  created_at,
  isRead = false,
  onClick,
}: AnnouncementCardProps) {
  const preview = message.length > 80 ? message.substring(0, 80) + "..." : message;

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition text-left border border-neutral-100 dark:border-neutral-700"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`font-semibold flex-1 ${isRead ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-900 dark:text-white"}`}>
          {title}
        </h3>
        {!isRead && <Dot size={24} className="text-blue-600 flex-shrink-0 mt-0" />}
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
        {preview}
      </p>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </p>
        <ChevronRight size={16} className="text-neutral-400 dark:text-neutral-600" />
      </div>
    </button>
  );
}
