import { createSupabaseServerClient } from "@/utils/supabase/server";
import AnnouncementsClient from "@/components/announcements/AnnouncementsClient";
import AnnouncementsTopBar from "@/components/announcements/AnnouncementsTopBar";

async function getAnnouncements() {
  const supabase = await createSupabaseServerClient();

  const annRes = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return {
    announcements: annRes.data || [],
  };
}

export default async function AnnouncementsPage() {
  const { announcements } = await getAnnouncements();

  return (
    <>
      <AnnouncementsTopBar />
      <main className="min-h-screen bg-white dark:bg-neutral-900">
        <div className="container max-w-2xl px-4 pt-6 pb-24">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
            Latest
            <br />
            Announcements
          </h2>

          <AnnouncementsClient announcements={announcements} />
        </div>
      </main>
    </>
  );
}
