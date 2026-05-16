import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// GET /api/leads?user_id=xxx
export async function GET(req: NextRequest) {
  console.log("LEADS API HIT");
  console.log(
    "SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING"
  );
  console.log(
    "SERVICE_KEY:",
    process.env.SUPABASE_SERVICE_ROLE_KEY ? "SET" : "MISSING"
  );
  console.log("user_id param:", req.nextUrl.searchParams.get("user_id"));

  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  try {
    const supabase = createServerClient();
    console.log("About to query Supabase");
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    console.log("Query result - error:", JSON.stringify(error));
    console.log("Query result - data count:", data?.length ?? "null");

    if (error) {
      console.error("Supabase leads GET error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ leads: data });
  } catch (e) {
    console.error("Leads GET exception:", e);
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}

// POST /api/leads — Create a new lead
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      name,
      company,
      title,
      stage,
      fit_score,
      outreach_mode,
      linkedin_url,
      email,
      phone,
      location,
      industry,
      company_size,
      seniority,
      fit_reason,
    } = body;

    if (!user_id || !name || !company) {
      return NextResponse.json(
        { error: "user_id, name, and company are required" },
        { status: 400 }
      );
    }

    const safeFitScore = (() => {
      const s = fit_score;
      if (s === "high" || s === "medium" || s === "low") return s;
      const n = typeof s === "string" ? parseInt(s) : Number(s);
      if (n >= 8) return "high";
      if (n >= 5) return "medium";
      return "low";
    })();

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id,
        name,
        company,
        title: title || null,
        stage: stage || "lead",
        fit_score: safeFitScore,
        outreach_mode: outreach_mode || null,
        linkedin_url: linkedin_url || null,
        email: email || null,
        phone: phone || null,
        location: location || null,
        industry: industry || null,
        company_size: company_size || null,
        seniority: seniority || null,
        fit_reason: fit_reason || null,
        last_activity: "Just now",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase leads POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("activities").insert({
      lead_id: data.id,
      user_id,
      type: "stage_change",
      description: `Lead created in ${stage || "lead"} stage`,
    });

    return NextResponse.json({ lead: data }, { status: 201 });
  } catch (e) {
    console.error("Leads POST exception:", e);
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}

// PATCH /api/leads — Update a lead
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, user_id, ...updates } = body;

    if (!id || !user_id) {
      return NextResponse.json(
        { error: "id and user_id are required" },
        { status: 400 }
      );
    }

    if (updates.fit_score !== undefined) {
      const s = updates.fit_score;
      updates.fit_score = (() => {
        if (s === "high" || s === "medium" || s === "low") return s;
        const n = typeof s === "string" ? parseInt(s) : Number(s);
        if (n >= 8) return "high";
        if (n >= 5) return "medium";
        return "low";
      })();
    }

    const supabase = createServerClient();

    if (updates.stage) {
      const { data: existing } = await supabase
        .from("leads")
        .select("stage")
        .eq("id", id)
        .single();

      if (existing && existing.stage !== updates.stage) {
        await supabase.from("activities").insert({
          lead_id: id,
          user_id,
          type: "stage_change",
          description: `Moved from ${existing.stage} to ${updates.stage}`,
          metadata: { from: existing.stage, to: updates.stage },
        });
      }
    }

    if (updates.outreach_mode) {
      await supabase.from("activities").insert({
        lead_id: id,
        user_id,
        type: "email",
        description: `Outreach mode set to ${updates.outreach_mode}`,
      });
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ ...updates, last_activity: "Just now" })
      .eq("id", id)
      .eq("user_id", user_id)
      .select()
      .single();

    if (error) {
      console.error("Supabase leads PATCH error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead: data });
  } catch (e) {
    console.error("Leads PATCH exception:", e);
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}

// DELETE /api/leads?id=xxx&user_id=xxx
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!id || !userId) {
    return NextResponse.json(
      { error: "id and user_id required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerClient();
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Supabase leads DELETE error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Leads DELETE exception:", e);
    return NextResponse.json({ error: errMessage(e) }, { status: 500 });
  }
}
