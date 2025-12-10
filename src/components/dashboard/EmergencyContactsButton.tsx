"use client";

import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmergencyContactsButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/dashboard/emergency")}
      className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl transition mb-6 backdrop-blur-md border border-red-400"
      style={{ background: "rgba(220, 38, 38, 0.9)" }}
    >
      <Phone size={20} />
      Emergency Contacts
    </button>
  );
}
