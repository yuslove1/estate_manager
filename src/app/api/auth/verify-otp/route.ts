import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone, otp } = await request.json();

  if (!phone || !otp) {
    return NextResponse.json({ error: "Missing phone or otp" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Normalize phone
    let normalizedPhone: string;
    if (phone.startsWith("+234")) {
      normalizedPhone = phone;
    } else if (phone.startsWith("0")) {
      normalizedPhone = "+234" + phone.slice(1);
    } else if (phone.startsWith("234")) {
      normalizedPhone = "+234" + phone.slice(3);
    } else {
      return NextResponse.json({ error: "Invalid number" }, { status: 400 });
    }

    const dbPhone = normalizedPhone.replace("+234", "0");

    // Verify OTP
    const { data: resident } = await supabase
      .from("residents")
      .select("otp_code")
      .eq("phone", dbPhone)
      .single();

    if (!resident) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (resident.otp_code !== otp) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Clear OTP
    await supabase
        .from("residents")
        .update({ otp_code: null })
        .eq("phone", dbPhone);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
