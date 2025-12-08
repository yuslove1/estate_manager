import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: "Missing phone" }, { status: 400 });
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

    // Verify the user exists in the system
    const { data: resident } = await supabase
      .from("residents")
      .select("id")
      .eq("phone", dbPhone)
      .single();

    if (!resident) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Firebase OTP verification happens on client-side
    // This endpoint just confirms the user exists
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}