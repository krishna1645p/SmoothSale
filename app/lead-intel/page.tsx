"use client";

import { useState } from "react";
import { Link as LinkIcon } from "@phosphor-icons/react";
import { ProfileCard } from "@/components/linkedin/profile-card";
import { EmailTemplates } from "@/components/linkedin/email-templates";
import { usePipelineStore } from "@/lib/store";
import { ProfileAnalysis, EmailTemplate, Lead } from "@/types";

export default function LeadIntelPage() {
  const { addLead } = usePipelineStore();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileAnalysis | null>(null);
  const [coldEmail, setColdEmail] = useState<EmailTemplate | null>(null);
  const [coffeeChat, setCoffeeChat] = useState<EmailTemplate | null>(null);

  const analyzeProfile = async () => {
    if (!url.includes("linkedin")) return;
    setLoading(true);

    // Mock data — in production this hits /api/analyze
    await new Promise((r) => setTimeout(r, 1200));

    setProfile({
      name: "Sarah Chen",
      title: "VP of Engineering",
      company: "ScaleAI",
      location: "San Francisco, CA",
      industry: "AI / ML",
      company_size: "500-1000",
      seniority: "VP Level",
      fit_score: "high",
      fit_reason:
        "Matches ICP on seniority (VP+), industry (AI/ML), and company growth stage. High likelihood of budget authority for developer tools.",
    });

    setColdEmail({
      subject: "Quick question about ScaleAI's developer workflow",
      body: `Hi Sarah,

I noticed ScaleAI recently expanded the engineering team — congrats on the growth. As you scale, I imagine keeping developer velocity high across 500+ engineers gets increasingly complex.

We built Proto to help VP Eng leaders like you reduce context-switching and ship 30% faster without adding headcount. Teams at similar companies saw results within 2 weeks.

Would a 15-min call next week make sense to see if there's a fit?

Best,
Chinmaya`,
    });

    setCoffeeChat({
      body: `Hi Sarah,

I've been following ScaleAI's work on data labeling infrastructure — really impressive what your team has built. I'm working on something adjacent in the developer productivity space and would love to pick your brain on how you think about eng team scaling challenges.

No pitch, genuinely curious about your perspective. Happy to do coffee or a quick virtual chat — whatever works for your schedule.

Cheers,
Chinmaya`,
    });

    setLoading(false);
  };

  const handleAddToPipeline = () => {
    if (!profile) return;
    const newLead: Lead = {
      id: crypto.randomUUID(),
      name: profile.name,
      company: profile.company,
      title: profile.title,
      stage: "outreach",
      fit_score: profile.fit_score,
      outreach_mode: null,
      linkedin_url: url,
      location: profile.location,
      industry: profile.industry,
      company_size: profile.company_size,
      seniority: profile.seniority,
      last_activity: "Just now",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
    };
    addLead(newLead);
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900">
          Lead Intelligence
        </h2>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          Paste a LinkedIn profile URL to analyze fit and generate personalized
          outreach.
        </p>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <LinkIcon
              size={16}
              weight="light"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder:text-gray-300"
              onKeyDown={(e) => e.key === "Enter" && analyzeProfile()}
            />
          </div>
          <button
            onClick={analyzeProfile}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Analyzing..." : "Analyze Profile"}
          </button>
        </div>

        {profile && coldEmail && coffeeChat && (
          <div className="space-y-4 animate-in">
            <ProfileCard profile={profile} />
            <EmailTemplates
              coldEmail={coldEmail}
              coffeeChat={coffeeChat}
              onAddToPipeline={handleAddToPipeline}
            />
          </div>
        )}
      </div>
    </div>
  );
}
