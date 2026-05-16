import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/icp?user_id=xxx
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("icps")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ icps: data });
}

// POST /api/icp — Create or update ICP
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    user_id,
    name,
    product_description,
    target_industries,
    target_roles,
    company_size_min,
    company_size_max,
    geographies,
    keywords,
  } = body;

  if (!user_id || !product_description) {
    return NextResponse.json(
      { error: "user_id and product_description are required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from("icps")
    .select("id")
    .eq("user_id", user_id)
    .limit(1)
    .single();

  let data;
  let error;

  if (existing) {
    ({ data, error } = await supabase
      .from("icps")
      .update({
        name: name || "Default ICP",
        product_description,
        target_industries: target_industries || [],
        target_roles: target_roles || [],
        company_size_min: company_size_min || 0,
        company_size_max: company_size_max || 10000,
        geographies: geographies || [],
        keywords: keywords || [],
      })
      .eq("id", existing.id)
      .select()
      .single());
  } else {
    ({ data, error } = await supabase
      .from("icps")
      .insert({
        user_id,
        name: name || "Default ICP",
        product_description,
        target_industries: target_industries || [],
        target_roles: target_roles || [],
        company_size_min: company_size_min || 0,
        company_size_max: company_size_max || 10000,
        geographies: geographies || [],
        keywords: keywords || [],
      })
      .select()
      .single());
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ icp: data });
}
