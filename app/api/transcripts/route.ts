import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/transcripts?lead_id=xxx
export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("lead_id");
  if (!leadId) {
    return NextResponse.json({ error: "lead_id required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("transcripts")
    .select("*")
    .eq("lead_id", leadId)
    .order("meeting_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transcripts: data });
}

// POST /api/transcripts — Link a meeting transcript to a lead
export async function POST(req: NextRequest) {
  const { lead_id, user_id, title, source, raw_text, meeting_date } =
    await req.json();

  if (!lead_id || !user_id || !title) {
    return NextResponse.json(
      { error: "lead_id, user_id, and title are required" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  let summary: string | null = null;
  let actionItems: string[] = [];
  let keyDecisions: string[] = [];
  let buyingSignals: string[] = [];
  let objections: string[] = [];

  if (raw_text && process.env.OPENAI_API_KEY) {
    const aiSummary = await summarizeTranscript(raw_text);
    summary = aiSummary.summary;
    actionItems = aiSummary.action_items;
    keyDecisions = aiSummary.key_decisions;
    buyingSignals = aiSummary.buying_signals;
    objections = aiSummary.objections;
  }

  const { data, error } = await supabase
    .from("transcripts")
    .insert({
      lead_id,
      user_id,
      title,
      source: source || "manual",
      raw_text: raw_text || null,
      summary,
      action_items: actionItems,
      key_decisions: keyDecisions,
      buying_signals: buyingSignals,
      objections,
      meeting_date: meeting_date || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("activities").insert({
    lead_id,
    user_id,
    type: "meeting",
    description: `Meeting transcript linked: ${title}`,
    metadata: { transcript_id: data.id },
  });

  await supabase
    .from("leads")
    .update({ last_activity: "Just now" })
    .eq("id", lead_id);

  return NextResponse.json({ transcript: data }, { status: 201 });
}

async function summarizeTranscript(text: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a sales meeting analyst. Extract structured insights from meeting transcripts. Return JSON with these fields:
- summary: 2-3 sentence overview
- action_items: array of follow-up tasks
- key_decisions: array of decisions made
- buying_signals: array of positive indicators (budget mentions, timeline urgency, stakeholder buy-in)
- objections: array of concerns or pushback raised`,
        },
        {
          role: "user",
          content: `Analyze this sales meeting transcript:\n\n${text.slice(0, 8000)}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return {
      summary: null,
      action_items: [],
      key_decisions: [],
      buying_signals: [],
      objections: [],
    };
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0]?.message?.content || "{}");

  return {
    summary: parsed.summary || null,
    action_items: parsed.action_items || [],
    key_decisions: parsed.key_decisions || [],
    buying_signals: parsed.buying_signals || [],
    objections: parsed.objections || [],
  };
}
