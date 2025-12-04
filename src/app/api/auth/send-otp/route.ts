
// import { createSupabaseServerClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// const TERMII_API_KEY = process.env.TERMII_API_KEY!;

// export async function POST(request: Request) {
//   const { phone } = await request.json();

//   if (!phone) return NextResponse.json({ error: "No phone" }, { status: 400 });

//   const supabase = await createSupabaseServerClient();

//   // Normalize: Always convert to local Nigerian format (0801...)
//   let normalizedPhone: string;
//   if (phone.startsWith("+234")) {
//     normalizedPhone = "0" + phone.slice(4);  // +234801... → 0801...
//   } else if (phone.startsWith("234")) {
//     normalizedPhone = "0" + phone.slice(3);  // 234801... → 0801...
//   } else if (phone.startsWith("0")) {
//     normalizedPhone = phone;  // Already local
//   } else {
//     return NextResponse.json({ error: "Invalid Nigerian number" }, { status: 400 });
//   }

//   // Check if normalized phone is approved
//   const { data: resident } = await supabase
//     .from("residents")
//     .select("phone")
//     .eq("phone", normalizedPhone)  // Now matches DB local format
//     .single();

//   if (!resident) {
//     return NextResponse.json({ error: "Number not approved yet. Contact CDA" }, { status: 403 });
//   }

//   // Generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // Save OTP (use normalized phone)
//   await supabase
//     .from("otp_sessions")
//     .upsert({
//       phone: normalizedPhone,
//       otp,
//       expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
//     });

//   // Send via Termii (use international for API)
//   const intlPhone = "+234" + normalizedPhone.slice(1);

//   try {
//     // await fetch("https://api.ng.termii.com/api/sms/send", {  // Use SMS for now (free credit)
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     "API-Key": TERMII_API_KEY,
//     //   },
//     //   body: JSON.stringify({
//     //     to: intlPhone,
//     //     from: "Brentfield",
//     //     sms: `Your Brentfield Estate verification code: ${otp} (valid 5 min)`,
//     //     type: "plain",
//     //     channel: "generic"
//     //   })
//     // });
//     await fetch("https://api.ng.termii.com/api/whatsapp/send_message", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "API-Key": process.env.TERMII_API_KEY!,
//       },
//       body: JSON.stringify({
//         to: intlPhone,
//         type: "plain",
//         message: `Your Brentfield verification code: ${otp} (valid 5 mins)`,
//         channel: "whatsapp"
//       })
//     });
//   } catch (error) {
//     console.error("OTP send failed:", error);
//     return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
//   }

//   return NextResponse.json({ success: true });
// }


import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: "No phone number" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  // ───── Normalize to E.164 for Twilio (+234...) ─────
  let twilioPhone: string;
  if (phone.startsWith("+234")) {
    twilioPhone = phone; // Already perfect
  } else if (phone.startsWith("0")) {
    twilioPhone = "+234" + phone.slice(1);
  } else if (phone.startsWith("234")) {
    twilioPhone = "+234" + phone.slice(3);
  } else {
    return NextResponse.json({ error: "Invalid Nigerian number" }, { status: 400 });
  }

  // ───── Local format for Supabase DB (0706...) ─────
  const dbPhone = "0" + twilioPhone.slice(4);

  // Check if number is approved
  const { data: resident } = await supabase
    .from("residents")
    .select("phone")
    .eq("phone", dbPhone)
    .single();

  if (!resident) {
    return NextResponse.json(
      { error: "Number not approved yet. Contact CDA" },
      { status: 403 }
    );
  }

  // Send SMS OTP via Twilio Verify
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: twilioPhone,     // +2347061926019
        channel: "sms",
      });

    // Save the verification SID (not the code) for later check
    await supabase.from("otp_sessions").upsert({
      phone: dbPhone,
      otp: verification.sid,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Twilio OTP send failed:", error.message);
    } else {
      console.error("Twilio OTP send failed:", error);
    }
    return NextResponse.json(
      { error: "Failed to send code. Try again." },
      { status: 500 }
    );
  }
}