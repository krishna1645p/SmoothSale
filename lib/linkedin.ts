import { ProfileAnalysis, ICP } from "@/types";

interface ProxycurlProfile {
  full_name: string;
  headline: string;
  occupation: string;
  summary: string;
  city: string;
  state: string;
  country_full_name: string;
  industry: string;
  experiences: Array<{
    company: string;
    title: string;
    starts_at: { year: number };
    ends_at: { year: number } | null;
    company_linkedin_profile_url?: string;
  }>;
  connections: number;
}

// Fetch LinkedIn profile data via Proxycurl API
export async function fetchLinkedInProfile(
  linkedinUrl: string
): Promise<ProxycurlProfile | null> {
  const apiKey = process.env.PROXYCURL_API_KEY;

  if (!apiKey) {
    // Return mock data for development
    return getMockProfile(linkedinUrl);
  }

  const response = await fetch(
    `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(linkedinUrl)}&skills=skip&inferred_salary=skip&personal_email=skip&personal_contact_number=skip`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
    }
  );

  if (!response.ok) {
    console.error("Proxycurl error:", response.status);
    return null;
  }

  return response.json();
}

// Score a profile against user's ICP — returns a 1-10 fit score
export function scoreProfileFit(
  profile: ProxycurlProfile,
  icp: ICP
): { score: number; reason: string } {
  let points = 0;
  const reasons: string[] = [];

  const profileIndustry = (profile.industry || "").toLowerCase();
  const industryMatch = icp.target_industries.some((ind) =>
    profileIndustry.includes(ind.toLowerCase())
  );
  if (industryMatch) {
    points += 3;
    reasons.push(`industry (${profile.industry})`);
  }

  const currentTitle = profile.experiences?.[0]?.title || profile.headline || "";
  const roleMatch = icp.target_roles.some((role) =>
    currentTitle.toLowerCase().includes(role.toLowerCase())
  );
  if (roleMatch) {
    points += 3;
    reasons.push(`role matches target (${currentTitle})`);
  }

  const seniorityKeywords = ["vp", "vice president", "director", "head of", "cto", "ceo", "chief"];
  const isSenior = seniorityKeywords.some((k) =>
    currentTitle.toLowerCase().includes(k)
  );
  if (isSenior) {
    points += 2;
    reasons.push("senior decision-maker");
  }

  const profileText = `${profile.headline} ${profile.summary || ""}`.toLowerCase();
  const keywordMatches = icp.keywords.filter((kw) =>
    profileText.includes(kw.toLowerCase())
  );
  if (keywordMatches.length > 0) {
    points += keywordMatches.length;
    reasons.push(`keyword signals: ${keywordMatches.join(", ")}`);
  }

  // Clamp to 1-10
  const score = Math.min(10, Math.max(1, points));

  const tier = score >= 8 ? "Hot" : score >= 5 ? "Warm" : "Cold";
  const reasonText =
    reasons.length > 0
      ? `Matches ICP on ${reasons.join(", ")}. ${
          tier === "Hot"
            ? "High likelihood of budget authority."
            : tier === "Warm"
            ? "Worth exploring further."
            : "Limited alignment with target profile."
        }`
      : "No strong signals matching your ICP criteria.";

  return { score, reason: reasonText };
}

export function parseProfile(
  profile: ProxycurlProfile,
  fitResult: { score: number; reason: string }
): ProfileAnalysis {
  const currentExperience = profile.experiences?.[0];
  const location = [profile.city, profile.state, profile.country_full_name]
    .filter(Boolean)
    .join(", ");

  const seniority = inferSeniority(currentExperience?.title || profile.headline);

  return {
    name: profile.full_name,
    title: currentExperience?.title || profile.headline,
    company: currentExperience?.company || "Unknown",
    summary: profile.summary || profile.headline || "",
    location: location || "Unknown",
    industry: profile.industry || "Unknown",
    company_size: inferCompanySize(profile.connections),
    seniority,
    fit_score: fitResult.score,
    fit_reason: fitResult.reason,
  };
}

function inferSeniority(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("ceo") || lower.includes("founder")) return "C-Level";
  if (lower.includes("cto") || lower.includes("coo") || lower.includes("cfo")) return "C-Level";
  if (lower.includes("vp") || lower.includes("vice president")) return "VP Level";
  if (lower.includes("director") || lower.includes("head of")) return "Director";
  if (lower.includes("manager") || lower.includes("lead")) return "Manager";
  return "Individual Contributor";
}

function inferCompanySize(connections: number): string {
  if (connections > 2000) return "1000+";
  if (connections > 1000) return "500-1000";
  if (connections > 500) return "100-500";
  if (connections > 200) return "50-100";
  return "< 50";
}

function getMockProfile(_url: string): ProxycurlProfile {
  return {
    full_name: "Sarah Chen",
    headline: "VP of Engineering at ScaleAI",
    occupation: "VP of Engineering",
    summary:
      "Engineering leader focused on scaling developer productivity and AI infrastructure. Previously built engineering orgs at Uber and Meta.",
    city: "San Francisco",
    state: "California",
    country_full_name: "United States",
    industry: "Artificial Intelligence",
    experiences: [
      {
        company: "ScaleAI",
        title: "VP of Engineering",
        starts_at: { year: 2023 },
        ends_at: null,
      },
      {
        company: "Uber",
        title: "Engineering Director",
        starts_at: { year: 2019 },
        ends_at: { year: 2023 },
      },
    ],
    connections: 1847,
  };
}
