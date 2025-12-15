import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone) return NextResponse.json({ error: "No phone" }, { status: 400 });

  const supabase = await createSupabaseServerClient();

  let normalizedPhone: string;
  if (phone.startsWith("+234")) {
    normalizedPhone = phone;
  } else if (phone.startsWith("0")) {
    normalizedPhone = "+234" + phone.slice(1);
  } else if (phone.startsWith("234")) {
    normalizedPhone = "+234" + phone.slice(3);
  } else {
    return NextResponse.json({ error: "Invalid Nigerian number" }, { status: 400 });
  }

  const normalizedPhoneDB = normalizedPhone.replace("+234", "0");

  try {
    const { data: resident } = await supabase
      .from("residents")
      .select("phone")
      .eq("phone", normalizedPhoneDB)
      .single();

    if (!resident) {
      return NextResponse.json({ error: "You're not in the residential list, contact the brentfield CDA" }, { status: 403 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in DB
    const { error: updateError } = await supabase
      .from("residents")
      .update({ otp_code: otp })
      .eq("phone", normalizedPhoneDB);

    if (updateError) {
        console.error("Failed to store OTP:", updateError);
        // Fallback: If column doesn't exist, we can't proceed.
        return NextResponse.json({ error: "Database error: Please ensure 'otp_code' column exists in residents table." }, { status: 500 });
    }

    // Call WhatsApp Bot
    try {
        const botUrl = process.env.WHATSAPP_BOT_URL || 'http://localhost:3001';
        const botRes = await fetch(`${botUrl}/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: normalizedPhone, otp })
        });
        
        if (!botRes.ok) {
            console.error("Bot failed:", await botRes.text());
            return NextResponse.json({ error: "Failed to send WhatsApp message. Is the bot running?" }, { status: 500 });
        }
    } catch (err) {
        console.error("Bot connection error:", err);
        return NextResponse.json({ error: "WhatsApp Bot is not running. Please start the bot script." }, { status: 500 });
    }

    return NextResponse.json({ success: true, phone: normalizedPhone });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ error: "Failed to validate phone number" }, { status: 500 });
  }
}
