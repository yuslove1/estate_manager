"use client";

import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmergencyContactsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/emergency")}
      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition mb-6"
    >
      <Phone size={20} />
      Emergency Contacts
    </button>
  );
}
