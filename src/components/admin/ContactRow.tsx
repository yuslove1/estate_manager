import { Phone, Mail } from "lucide-react";

interface ContactRowProps {
  name: string;
  phone: string;
  title: string;
  email?: string;
}

export default function ContactRow({ name, phone, title, email }: ContactRowProps) {
  return (
    <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-700 py-3 px-2">
      <div className="flex-1 text-sm">
        <p className="font-semibold text-neutral-900 dark:text-white">{name}</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">{title}</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={`tel:${phone}`}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2"
          title="Call"
        >
          <Phone size={18} />
        </a>
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-2"
            title="Email"
          >
            <Mail size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
