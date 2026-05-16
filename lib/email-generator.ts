import { ProfileAnalysis, EmailTemplate, ICP } from "@/types";
import { generateWithGemini } from "./gemini";

interface GenerateEmailParams {
  profile: ProfileAnalysis;
  icp: ICP;
  type: "cold_email" | "coffee_chat" | "follow_up";
  tone?: "professional" | "casual" | "direct";
  senderName?: string;
}

export async function generateEmail(
  params: GenerateEmailParams
): Promise<EmailTemplate> {
  const { profile } = params;

  const prompt = buildPrompt(params);
  const fallback = serializeTemplate(generateFallbackEmail(params));

  const text = await generateWithGemini(prompt, fallback);
  return parseEmailResponse(text, profile);
}

function buildPrompt(params: GenerateEmailParams): string {
  const { profile, icp, type, tone = "professional", senderName = "Chinmaya" } = params;

  const emailType =
    type === "cold_email"
      ? "cold outreach"
      : type === "coffee_chat"
      ? "casual coffee chat"
      : "follow-up";

  const constraints =
    type === "cold_email"
      ? "Keep it under 120 words. Include one clear value prop and a soft CTA (15-min call, not aggressive)."
      : type === "coffee_chat"
      ? "Keep it under 100 words. Explicitly state 'no pitch'. Suggest coffee or a short virtual chat."
      : "Keep it under 80 words. Add new value (a relevant insight or data point). End with a low-pressure CTA.";

  return `You are an expert sales copywriter.
Write a ${emailType} email to this person:
Name: ${profile.name}
Title: ${profile.title}
Company: ${profile.company}
Industry: ${profile.industry}
Location: ${profile.location}
Seniority: ${profile.seniority}

My product/service: ${icp.product_description}
Sender name: ${senderName}
Tone: ${tone}

${constraints}

Reference specific details about their role and company so it feels human, not templated. Avoid generic openers like "I hope this email finds you well."

Format your response exactly as:
Subject: <subject line>
<email body>`;
}

function parseEmailResponse(text: string, profile: ProfileAnalysis): EmailTemplate {
  const cleaned = text.trim();
  const subjectMatch = cleaned.match(/Subject:\s*(.+)/i);
  const subject = subjectMatch?.[1]?.trim() || `Re: ${profile.company}`;
  const body = cleaned.replace(/Subject:\s*.+\n?/i, "").trim();
  return { subject, body };
}

function serializeTemplate(t: EmailTemplate): string {
  return `Subject: ${t.subject ?? ""}\n${t.body}`;
}

function generateFallbackEmail(params: GenerateEmailParams): EmailTemplate {
  const { profile, icp, type, senderName = "Chinmaya" } = params;
  const firstName = profile.name.split(" ")[0];

  if (type === "cold_email") {
    return {
      subject: `Quick question about ${profile.company}'s developer workflow`,
      body: `Hi ${firstName},

I noticed ${profile.company} has been growing the engineering team — congrats. As you scale, I imagine keeping developer velocity high gets increasingly complex.

We built ${icp.product_description.split(".")[0].replace(/^.+is /, "")} to help ${profile.seniority} leaders like you reduce context-switching and ship faster. Teams at similar companies saw results within 2 weeks.

Would a 15-min call next week make sense to see if there's a fit?

Best,
${senderName}`,
    };
  }

  if (type === "coffee_chat") {
    return {
      subject: `Loved what ${profile.company} is building`,
      body: `Hi ${firstName},

I've been following ${profile.company}'s work — really impressive what your team has built. I'm working on something in a similar space and would love to pick your brain on how you think about scaling challenges.

No pitch, genuinely curious about your perspective. Happy to do coffee or a quick virtual chat — whatever works for your schedule.

Cheers,
${senderName}`,
    };
  }

  return {
    subject: `Re: ${profile.company} — one more thought`,
    body: `Hi ${firstName},

I reached out last week about developer productivity at ${profile.company}. Wanted to share a quick data point: teams using tools like ours typically cut their sprint cycle time by 20-30%.

Happy to walk you through how in 10 minutes — or just share a case study if that's easier. No pressure either way.

Best,
${senderName}`,
  };
}
