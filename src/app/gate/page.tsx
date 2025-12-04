import { createSupabaseServerClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import CopyButton from "@/components/CopyButton";

export const revalidate = 0;

async function getData() {
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
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    code: codeRes.data?.code || "No code yet – check back at 1 AM",
    announcements: annRes.data || [],
  };
}

export default async function GatePage() {
  const { code, announcements } = await getData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-8 md:py-12 md:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-center text-3xl md:text-4xl font-bold text-emerald-400 mb-4">
          Brentfield Estate
        </h1>
        <p className="text-center text-slate-400 mb-12">Today’s Gate Pass</p>

        <div className="rounded-3xl bg-slate-800/80 backdrop-blur p-8 md:p-12 text-center shadow-2xl">
          <p className="text-slate-400 text-sm md:text-base mb-6">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>

          <div className="text-6xl md:text-8xl font-bold tracking-widest text-emerald-400 mb-8">
            {code}
          </div>

          <CopyButton code={code} />

          <p className="mt-8 text-xs md:text-sm text-slate-500">
            Valid until midnight • Auto-updates daily
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-emerald-400">Announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-center text-slate-400">No announcements yet.</p>
          ) : (
            <div className="space-y-6">
              {announcements.map((a) => (
                <div key={a.id} className="bg-slate-800 rounded-2xl p-6 shadow-md">
                  <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                  <p className="text-slate-300">{a.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Built with ❤️ by a proud resident
        </p>
      </div>
    </main>
  );
}