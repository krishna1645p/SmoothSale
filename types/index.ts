export type FitScore = "high" | "medium" | "low";

export type DealStage =
  | "lead"
  | "outreach"
  | "meeting"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

export type OutreachMode = "email" | "phone" | "linkedin_message" | null;

export interface Lead {
  id: string;
  name: string;
  company: string;
  title: string;
  stage: DealStage;
  fit_score: FitScore;
  outreach_mode: OutreachMode;
  linkedin_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  industry?: string;
  company_size?: string;
  seniority?: string;
  last_activity: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Activity {
  id: string;
  lead_id: string;
  type: "stage_change" | "note" | "email" | "meeting" | "call";
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ICP {
  id: string;
  name: string;
  product_description: string;
  target_industries: string[];
  target_roles: string[];
  company_size_min: number;
  company_size_max: number;
  geographies: string[];
  keywords: string[];
  user_id: string;
}

export interface ProfileAnalysis {
  name: string;
  title: string;
  company: string;
  summary: string;
  location: string;
  industry: string;
  company_size: string;
  seniority: string;
  fit_score: number;
  fit_reason: string;
}

export interface EmailTemplate {
  subject?: string;
  body: string;
}

export interface Stage {
  id: DealStage;
  title: string;
  color: string;
}
