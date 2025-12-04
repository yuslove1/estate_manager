import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

function generateCode() {
  // 4-digit numeric code (estate standard)
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Check if code already exists for today
  const { data: existing } = await supabase
    .from("gate_passes")
    .select("id, code")
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      message: "Today's gate code already generated",
      code: existing.code || "hidden",
      date: today,
    });
  }

  const code = generateCode();

  // Insert new code
  const { error } = await supabase
    .from("gate_passes")
    .insert({
      date: today,
      code,
    });

  if (error) {
    console.error("Failed to save gate code:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  console.log(`New gate code generated: ${code} for ${today}`);

  return NextResponse.json({
    success: true,
    message: "New gate code generated!",
    code, // Only visible in logs/cron output
    date: today,
    tip: "Residents can now see it in the app now",
  });
}