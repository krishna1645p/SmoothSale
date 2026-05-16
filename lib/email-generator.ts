import { ProfileAnalysis, EmailTemplate, ICP } from "@/types";

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
  const { profile, type, tone = "professional", senderName = "Chinmaya" } = params;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateFallbackEmail(params);
  }

  const systemPrompt = `You are a sales email writer. Write highly personalized, concise emails that feel human — not templated. Never use generic openers like "I hope this email finds you well." Reference specific details about the prospect's role, company, and recent work.`;

  const userPrompt = buildPrompt(params);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    console.error("OpenAI error:", response.status);
    return generateFallbackEmail(params);
  }

  const data = await response.json();
  const content: string = data.choices?.[0]?.message?.content || "";

  const subjectMatch = content.match(/Subject:\s*(.+)/i);
  const subject = subjectMatch?.[1]?.trim() || `Re: ${profile.company}`;
  const body = content.replace(/Subject:\s*.+\n?/i, "").trim();

  // Suppress unused-var lint for senderName/tone in fallback path
  void senderName;
  void tone;

  return { subject, body };
}

function buildPrompt(params: GenerateEmailParams): string {
  const { profile, icp, type, tone, senderName } = params;

  const baseContext = `
Prospect: ${profile.name}
Title: ${profile.title}
Company: ${profile.company}
Industry: ${profile.industry}
Location: ${profile.location}
Seniority: ${profile.seniority}

My Product: ${icp.product_description}
Sender: ${senderName}
Tone: ${tone}
`;

  if (type === "cold_email") {
    return `${baseContext}
Write a cold outreach email to this prospect. Include:
- A subject line that references their company or role (not generic)
- A personalized opening that shows you researched them
- One clear value prop relevant to their role/company
- A soft CTA (15-min call, not aggressive)
- Keep it under 120 words

Format:
Subject: [subject line]
[email body]`;
  }

  if (type === "coffee_chat") {
    return `${baseContext}
Write a casual coffee chat / networking request. Include:
- A genuine compliment about their work or company
- A reason you're reaching out (curiosity, shared interest)
- Explicitly state "no pitch"
- Suggest coffee or a short virtual chat
- Keep it under 100 words

Format:
Subject: [subject line]
[message body]`;
  }

  return `${baseContext}
Write a follow-up email after no response to the initial outreach. Include:
- A brief callback to the original message
- Add new value (a relevant insight, article, or data point)
- Keep it under 80 words
- End with a low-pressure CTA

Format:
Subject: [subject line]
[email body]`;
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
