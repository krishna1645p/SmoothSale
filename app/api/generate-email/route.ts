import { NextRequest, NextResponse } from "next/server";
import { generateEmail } from "@/lib/email-generator";
import { createServerClient } from "@/lib/supabase-server";
import { ProfileAnalysis, ICP } from "@/types";

// POST /api/generate-email
export async function POST(req: NextRequest) {
  const { profile, user_id, type, tone, lead_id } = await req.json();

  if (!profile || !type) {
    return NextResponse.json(
      { error: "profile and type are required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data: icpData } = await supabase
    .from("icps")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const icp: ICP = icpData || {
    id: "",
    name: "Default",
    product_description:
      "A developer productivity platform that helps engineering teams reduce context-switching and ship faster.",
    target_industries: ["SaaS", "AI", "Fintech"],
    target_roles: ["VP Eng", "CTO", "Director"],
    company_size_min: 50,
    company_size_max: 1000,
    geographies: ["US"],
    keywords: ["scaling", "developer experience"],
    user_id: user_id || "",
  };

  const email = await generateEmail({
    profile: profile as ProfileAnalysis,
    icp,
    type,
    tone: tone || "professional",
  });

  if (user_id) {
    await supabase.from("generated_emails").insert({
      lead_id: lead_id || null,
      user_id,
      type,
      subject: email.subject,
      body: email.body,
      tone: tone || "professional",
    });
  }

  return NextResponse.json({ email });
}
