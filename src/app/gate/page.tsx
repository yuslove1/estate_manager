import { createSupabaseServerClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import CopyButton from "@/components/CopyButton";

export const revalidate = 0;

async function getTodayCode() {
  const supabase = await createSupabaseServerClient();

  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("gate_passes")
    .select("code")
    .eq("date", today)
    .single();

  return data?.code || "Code will appear at 1 AM";
}

export default async function GatePage() {
  const code = await getTodayCode();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-3xl font-bold text-emerald-400 mb-2">
          Brentfield Estate
        </h1>
        <p className="text-center text-slate-400 mb-12">Today’s Gate Pass</p>

        <div className="rounded-3xl bg-slate-800/80 backdrop-blur p-12 text-center shadow-2xl">
          <p className="text-slate-400 text-sm mb-6">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>

          <div className="text-7xl md:text-8xl font-black tracking-widest text-emerald-400 mb-8">
            {code}
          </div>

          <CopyButton code={code} />

          <p className="mt-8 text-xs text-slate-500">
            Valid until midnight • Auto-updates daily
          </p>
        </div>

        <p className="mt-20 text-center text-sm text-slate-500">
          Built with love by a proud resident
        </p>
      </div>
    </main>
  );
}