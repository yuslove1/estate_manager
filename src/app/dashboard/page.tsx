import { createSupabaseServerClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import GateCodeCard from "@/components/dashboard/GateCodeCard";
import CopyGateCodeButton from "@/components/dashboard/CopyGateCodeButton";
import EmergencyContactsButton from "@/components/dashboard/EmergencyContactsButton";
import TodayAnnouncements from "@/components/dashboard/TodayAnnouncements";
import PWAPrompt from "@/components/dashboard/PWAPrompt";
import TopAppBar from "@/components/dashboard/TopAppBar";
import UrgentAnnouncementsBanner from "@/components/dashboard/UrgentAnnouncementsBanner";

export const revalidate = 0;

async function getDashboardData() {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const [codeRes, annRes] = await Promise.all([
    supabase
      .from("gate_passes")
      .select("code")
      .eq("date", today)
      .maybeSingle(),
    supabase
      .from("announcements")
      .select("*")
      .gte("created_at", today + "T00:00:00")
      .lt("created_at", today + "T23:59:59")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    code: codeRes.data?.code || "No code yet",
    announcements: annRes.data || [],
  };
}

export default async function DashboardPage() {
  const { code, announcements } = await getDashboardData();
  const today = new Date();

  return (
    <>
      <TopAppBar />
      <main className="bg-transparent">
        <div className="min-h-screen container max-w-2xl mx-auto px-4 pt-6 pb-32">
          {/* Urgent Announcements Banner */}
          <div className="mb-6">
            <UrgentAnnouncementsBanner />
          </div>

          {/* Date Display */}
          <p className="text-center text-neutral-700 dark:text-neutral-300 font-semibold mb-6">
            {format(today, "EEEE d MMMM yyyy")}
          </p>

          {/* Gate Code Card */}
          <GateCodeCard code={code} />

          {/* Copy Gate Code Button */}
          <CopyGateCodeButton code={code} />

          {/* Emergency Contacts Button */}
          <EmergencyContactsButton />

          {/* Today's Announcements */}
          <TodayAnnouncements announcements={announcements} />

          {/* PWA Prompt */}
          <PWAPrompt />
        </div>
      </main>
    </>
  );
}
