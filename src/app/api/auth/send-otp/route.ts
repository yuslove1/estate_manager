// import { createSupabaseServerClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";
// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID!,
//   process.env.TWILIO_AUTH_TOKEN!
// );

// export async function POST(request: Request) {
//   const { phone } = await request.json();

//   if (!phone) {
//     return NextResponse.json({ error: "No phone number" }, { status: 400 });
//   }

//   const supabase = await createSupabaseServerClient();

//   // ───── Normalize to E.164 for Twilio (+234...) ─────
//   let twilioPhone: string;
//   if (phone.startsWith("+234")) {
//     twilioPhone = phone; // Already perfect
//   } else if (phone.startsWith("0")) {
//     twilioPhone = "+234" + phone.slice(1);
//   } else if (phone.startsWith("234")) {
//     twilioPhone = "+234" + phone.slice(3);
//   } else {
//     return NextResponse.json({ error: "Invalid Nigerian number" }, { status: 400 });
//   }

//   // ───── Local format for Supabase DB (0706...) ─────
//   const dbPhone = "0" + twilioPhone.slice(4);

//   // Check if number is approved
//   const { data: resident } = await supabase
//     .from("residents")
//     .select("phone")
//     .eq("phone", dbPhone)
//     .single();

//   if (!resident) {
//     return NextResponse.json(
//       { error: "Number not approved yet. Contact CDA" },
//       { status: 403 }
//     );
//   }

//   // Send SMS OTP via Twilio Verify
//   try {
//     const verification = await client.verify.v2
//       .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
//       .verifications.create({
//         to: twilioPhone,     // +2347061926019
//         channel: "sms",
//       });

//     // Save the verification SID (not the code) for later check
//     await supabase.from("otp_sessions").upsert({
//       phone: dbPhone,
//       otp: verification.sid,
//       expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
//     });

//     return NextResponse.json({ success: true });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("Twilio OTP send failed:", error.message);
//     } else {
//       console.error("Twilio OTP send failed:", error);
//     }
//     return NextResponse.json(
//       { error: "Failed to send code. Try again." },
//       { status: 500 }
//     );
//   }
// }


import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone) return NextResponse.json({ error: "No phone" }, { status: 400 });

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
    return NextResponse.json({ error: "Invalid Nigerian number" }, { status: 400 });
  }

  try {
    // Check if number is approved
    const { data: resident } = await supabase
      .from("residents")
      .select("phone")
      .eq("phone", normalizedPhone.replace("+234", "0"))
      .single();

    if (!resident) {
      return NextResponse.json({ error: "Number not approved" }, { status: 403 });
    }

    // Firebase Phone OTP is sent on client-side via RecaptchaVerifier
    // This endpoint validates the phone and confirms it's in the system
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}