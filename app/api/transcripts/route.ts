import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generateWithGemini } from "@/lib/gemini";

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

  const analysis = raw_text ? await analyzeTranscript(raw_text) : null;

  const { data, error } = await supabase
    .from("transcripts")
    .insert({
      lead_id,
      user_id,
      title,
      source: source || "manual",
      raw_text: raw_text || null,
      summary: analysis?.summary ?? null,
      pain_points: analysis?.pain_points ?? [],
      objections: analysis?.objections ?? [],
      next_action: analysis?.next_action ?? null,
      sentiment: analysis?.sentiment ?? null,
      conversion_likelihood: analysis?.conversion_likelihood ?? null,
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

  return NextResponse.json({ transcript: data, analysis }, { status: 201 });
}

interface TranscriptAnalysis {
  summary: string;
  pain_points: string[];
  objections: string[];
  sentiment: "positive" | "neutral" | "negative";
  next_action: string;
  conversion_likelihood: "hot" | "warm" | "cold";
}

async function analyzeTranscript(transcript: string): Promise<TranscriptAnalysis> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      summary: "Mock analysis - add GEMINI_API_KEY to enable real analysis",
      pain_points: ["Needs better workflow", "Current tool too expensive"],
      objections: ["Budget concerns", "Implementation time"],
      sentiment: "positive",
      next_action: "Send follow up within 24 hours",
      conversion_likelihood: "warm",
    };
  }

  const prompt = `You are an expert sales coach analyzing a sales call transcript.

Transcript: ${transcript.slice(0, 8000)}

Return JSON only, no markdown, no explanation:
{
  "summary": "<2-3 sentence summary>",
  "pain_points": ["<point 1>", "<point 2>"],
  "objections": ["<objection 1>", "<objection 2>"],
  "sentiment": "<positive|neutral|negative>",
  "next_action": "<specific next step>",
  "conversion_likelihood": "<hot|warm|cold>"
}`;

  const parseFailureFallback: TranscriptAnalysis = {
    summary: "Could not analyze transcript",
    pain_points: [],
    objections: [],
    sentiment: "neutral",
    next_action: "Manual review required",
    conversion_likelihood: "warm",
  };

  const text = await generateWithGemini(prompt, JSON.stringify(parseFailureFallback));

  try {
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    return JSON.parse(cleaned) as TranscriptAnalysis;
  } catch {
    return parseFailureFallback;
  }
}
