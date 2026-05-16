"use client";

import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { AddLeadModal } from "@/components/pipeline/add-lead-modal";
import { usePipelineStore } from "@/lib/store";
import { Lead } from "@/types";

const SAMPLE_LEADS: Lead[] = [
  {
    id: "1", name: "Sarah Chen", company: "ScaleAI", title: "VP Engineering",
    stage: "meeting", fit_score: "high", outreach_mode: "email", last_activity: "2 hours ago",
    created_at: "2026-05-10", updated_at: "2026-05-16", user_id: "1",
  },
  {
    id: "2", name: "Marcus Johnson", company: "Stripe", title: "Eng Director",
    stage: "outreach", fit_score: "high", outreach_mode: "linkedin_message", last_activity: "1 day ago",
    created_at: "2026-05-12", updated_at: "2026-05-15", user_id: "1",
  },
  {
    id: "3", name: "Priya Patel", company: "Notion", title: "Head of Platform",
    stage: "lead", fit_score: "medium", outreach_mode: null, last_activity: "3 days ago",
    created_at: "2026-05-08", updated_at: "2026-05-13", user_id: "1",
  },
  {
    id: "4", name: "Alex Rivera", company: "Vercel", title: "CTO",
    stage: "proposal", fit_score: "high", outreach_mode: "email", last_activity: "5 hours ago",
    created_at: "2026-05-05", updated_at: "2026-05-16", user_id: "1",
  },
  {
    id: "5", name: "Jordan Lee", company: "Retool", title: "VP Product",
    stage: "lead", fit_score: "medium", outreach_mode: null, last_activity: "1 day ago",
    created_at: "2026-05-14", updated_at: "2026-05-15", user_id: "1",
  },
  {
    id: "6", name: "Emily Zhang", company: "Datadog", title: "Eng Director",
    stage: "closed_won", fit_score: "high", outreach_mode: "phone", last_activity: "1 week ago",
    created_at: "2026-04-20", updated_at: "2026-05-09", user_id: "1",
  },
];

export default function PipelinePage() {
  const { leads, setLeads } = usePipelineStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (leads.length === 0) {
      setLeads(SAMPLE_LEADS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pipeline</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {leads.length} leads across your pipeline
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} weight="light" />
          Add Lead
        </button>
      </div>
      <KanbanBoard />
      <AddLeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
