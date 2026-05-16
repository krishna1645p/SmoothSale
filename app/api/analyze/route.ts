import { NextRequest, NextResponse } from "next/server";
import { fetchLinkedInProfile, scoreProfileFit, parseProfile } from "@/lib/linkedin";
import { generateEmail } from "@/lib/email-generator";
import { createServerClient } from "@/lib/supabase-server";
import { ICP } from "@/types";

// POST /api/analyze
// Body: { linkedin_url: string, user_id: string }
export async function POST(req: NextRequest) {
  const { linkedin_url, user_id } = await req.json();

  if (!linkedin_url) {
    return NextResponse.json(
      { error: "linkedin_url is required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  let icp: ICP;

  const { data: icpData } = await supabase
    .from("icps")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (icpData) {
    icp = icpData as ICP;
  } else {
    icp = {
      id: "",
      name: "Default",
      product_description:
        "A developer productivity platform that helps engineering teams reduce context-switching and ship faster.",
      target_industries: ["SaaS", "AI", "Fintech", "Developer Tools"],
      target_roles: ["VP Eng", "CTO", "Head of Engineering", "Eng Director"],
      company_size_min: 50,
      company_size_max: 1000,
      geographies: ["US", "Canada", "UK"],
      keywords: ["hiring engineers", "scaling", "developer experience"],
      user_id: user_id || "",
    };
  }

  const rawProfile = await fetchLinkedInProfile(linkedin_url);
  if (!rawProfile) {
    return NextResponse.json(
      { error: "Could not fetch LinkedIn profile. Check the URL and try again." },
      { status: 422 }
    );
  }

  const fitResult = scoreProfileFit(rawProfile, icp);
  const profile = parseProfile(rawProfile, fitResult);

  const [coldEmail, coffeeChat] = await Promise.all([
    generateEmail({ profile, icp, type: "cold_email" }),
    generateEmail({ profile, icp, type: "coffee_chat", tone: "casual" }),
  ]);

  return NextResponse.json({
    profile,
    cold_email: coldEmail,
    coffee_chat: coffeeChat,
  });
}
