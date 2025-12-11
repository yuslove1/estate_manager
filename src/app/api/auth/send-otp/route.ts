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

    return NextResponse.json({ success: true, phone: normalizedPhone });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json({ error: "Failed to validate phone number" }, { status: 500 });
  }
}