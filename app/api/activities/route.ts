import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/activities?lead_id=xxx
export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("lead_id");
  if (!leadId) {
    return NextResponse.json({ error: "lead_id required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activities: data });
}

// POST /api/activities — Log a new activity
export async function POST(req: NextRequest) {
  const { lead_id, user_id, type, description, metadata } = await req.json();

  if (!lead_id || !user_id || !type || !description) {
    return NextResponse.json(
      { error: "lead_id, user_id, type, and description are required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("activities")
    .insert({
      lead_id,
      user_id,
      type,
      description,
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("leads")
    .update({ last_activity: "Just now" })
    .eq("id", lead_id);

  return NextResponse.json({ activity: data }, { status: 201 });
}
