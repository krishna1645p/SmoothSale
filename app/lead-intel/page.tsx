"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon } from "@phosphor-icons/react";
import { ProfileCard } from "@/components/linkedin/profile-card";
import { EmailTemplates } from "@/components/linkedin/email-templates";
import { usePipelineStore } from "@/lib/store";
import { api } from "@/lib/api";
import { ProfileAnalysis, EmailTemplate, FitScore } from "@/types";

function numericToFitLabel(score: number): FitScore {
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

export default function LeadIntelPage() {
  const { addLead } = usePipelineStore();
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [profile, setProfile] = useState<ProfileAnalysis | null>(null);
  const [coldEmail, setColdEmail] = useState<EmailTemplate | null>(null);
  const [coffeeChat, setCoffeeChat] = useState<EmailTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addState, setAddState] = useState<"idle" | "saving" | "added">("idle");

  const analyzeProfile = async () => {
    setError(null);
    if (!url.trim()) {
      setError("Please enter a LinkedIn URL");
      return;
    }
    setAnalyzing(true);
    setProfile(null);
    setColdEmail(null);
    setCoffeeChat(null);
    setAddState("idle");
    try {
      const data = await api.analyze(url);
      setProfile(data.profile);
      setColdEmail(data.cold_email);
      setCoffeeChat(data.coffee_chat);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddToPipeline = async () => {
    if (!profile || addState !== "idle") return;
    setError(null);
    setAddState("saving");
    try {
      const created = await api.leads.create({
        name: profile.name,
        title: profile.title,
        company: profile.company,
        stage: "lead",
        fit_score: numericToFitLabel(profile.fit_score),
        outreach_mode: null,
        linkedin_url: url,
        location: profile.location,
        industry: profile.industry,
        company_size: profile.company_size,
        seniority: profile.seniority,
        user_id: "",
        last_activity: "Just now",
        updated_at: new Date().toISOString(),
      });
      addLead(created);
      setAddState("added");
      setTimeout(() => router.push("/pipeline"), 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add lead");
      setAddState("idle");
    }
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

        <div className="flex gap-3 mb-2">
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
            disabled={analyzing}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {analyzing ? "Analyzing..." : "Analyze Profile"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {profile && coldEmail && coffeeChat && (
          <div className="space-y-4 animate-in mt-4">
            <ProfileCard profile={profile} />
            <EmailTemplates
              coldEmail={coldEmail}
              coffeeChat={coffeeChat}
              onAddToPipeline={handleAddToPipeline}
              addState={addState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
