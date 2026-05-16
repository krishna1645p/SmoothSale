"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CircleNotch, Sparkle } from "@phosphor-icons/react";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { AddLeadModal } from "@/components/pipeline/add-lead-modal";
import { usePipelineStore } from "@/lib/store";
import { api } from "@/lib/api";

export default function PipelinePage() {
  const { leads, setLeads } = usePipelineStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.leads
      .list()
      .then((rows) => {
        if (cancelled) return;
        setLeads(rows ?? []);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load leads");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pipeline</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? "Loading..." : `${leads.length} leads across your pipeline`}
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

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <CircleNotch size={28} weight="light" className="animate-spin mb-3" />
          <p className="text-sm">Loading leads...</p>
        </div>
      )}

      {!loading && error && (
        <div className="border border-red-200 bg-red-50 text-red-700 text-sm rounded-md p-4">
          {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Sparkle size={28} weight="light" className="text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-1">No leads yet.</p>
          <p className="text-sm text-gray-400 mb-4">
            Go to Lead Intel to add your first lead.
          </p>
          <Link
            href="/lead-intel"
            className="px-3.5 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Go to Lead Intel
          </Link>
        </div>
      )}

      {!loading && !error && leads.length > 0 && <KanbanBoard />}

      <AddLeadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
