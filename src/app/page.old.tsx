import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import VerifyPhone from "@/components/VerifyPhone";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const cookieStore = await import('next/headers').then(m => m.cookies());
  const verifiedPhone = cookieStore.get("verified_phone")?.value;

  if (verifiedPhone) {
    const { data } = await supabase
      .from("residents")
      .select("phone")
      .eq("phone", verifiedPhone)
      .single();

    if (data?.phone) {
      redirect("/gate");
    }
  }

  return <VerifyPhone />;
}