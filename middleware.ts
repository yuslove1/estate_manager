import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";


export async function middleware(request: NextRequest) {
  // Get the verified phone from cookie
  const verifiedPhone = request.cookies.get("verified_phone")?.value;

  // If user is already logged in and trying to access login page, redirect to dashboard
  if (verifiedPhone) {
    if (
      request.nextUrl.pathname === "/auth/login" ||
      request.nextUrl.pathname === "/auth/verify"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Public routes — allow everyone
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/auth/login" ||
    request.nextUrl.pathname === "/auth/verify" ||
    request.nextUrl.pathname === "/offline" ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico") ||
    request.nextUrl.pathname.startsWith("/images") ||
    request.nextUrl.pathname.startsWith("/manifest")
  ) {
    return NextResponse.next();
  }

  // If no verified phone → redirect to home (phone entry)
  if (!verifiedPhone) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const supabase = await createSupabaseServerClient();

      // Normalize phone for DB lookup (DB uses 0..., cookie may have +234...)
      let dbPhone = verifiedPhone;
      if (dbPhone.startsWith("+234")) dbPhone = "0" + dbPhone.slice(4);
      if (dbPhone.startsWith("234")) dbPhone = "0" + dbPhone.slice(3);

      const adminCheckPromise = supabase
        .from("residents")
        .select("is_admin")
        .eq("phone", dbPhone)
        .single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      );

      const result = (await Promise.race([
        adminCheckPromise,
        timeoutPromise,
      ])) as { data: { is_admin: boolean } | null; error: { message: string } | null };

      const { data, error } = result;

      // If not admin → redirect to gate page
      if (!data?.is_admin || error) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      console.error("Admin check failed:", err);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // All good — let them through
  return NextResponse.next();
}

// Only run on these paths
export const config = {
  matcher: ["/", "/auth/login", "/auth/verify", "/admin", "/dashboard/:path*"],
};