import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: Request) {
  const { phone, otp } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // ───── Normalize to E.164 for Twilio (+234...) ─────
  let twilioPhone: string;
  if (phone.startsWith("+234")) {
    twilioPhone = phone;
  } else if (phone.startsWith("0")) {
    twilioPhone = "+234" + phone.slice(1);
  } else if (phone.startsWith("234")) {
    twilioPhone = "+234" + phone.slice(3);
  } else {
    return NextResponse.json({ error: "Invalid number" }, { status: 400 });
  }

  // ───── Local format for DB lookup (0706...) ─────
  const dbPhone = "0" + twilioPhone.slice(4);

  // Check if there's an active session
  const { data: session } = await supabase
    .from("otp_sessions")
    .select("otp")
    .eq("phone", dbPhone)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!session) {
    return NextResponse.json({ error: "No active code or expired" }, { status: 400 });
  }

  // Verify the code with Twilio
  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: twilioPhone,
        code: otp.trim(),
      });

    if (check.status === "approved") {
      // Clean up session
      await supabase.from("otp_sessions").delete().eq("phone", dbPhone);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Twilio verify failed:", error.message);
    } else {
      console.error("Twilio verify failed:", error);
    }
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}