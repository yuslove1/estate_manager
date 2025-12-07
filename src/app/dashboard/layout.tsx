import type { Metadata } from "next";
import BottomTabs from "@/components/navigation/BottomTabs";

export const metadata: Metadata = {
  title: "Dashboard - Brentfield Estate",
  description: "Your estate access and announcements",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-24">
      {children}
      <BottomTabs />
    </div>
  );
}
