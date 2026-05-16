"use client";

import { useState } from "react";
import { DealStage } from "@/types";
import { STAGES } from "@/lib/constants";
import { usePipelineStore } from "@/lib/store";
import { LeadCard } from "./lead-card";

export function KanbanBoard() {
  const { leads, updateLeadStage } = usePipelineStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const handleDragStart = (leadId: string) => {
    setDraggedId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: DealStage) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    if (draggedId) {
      updateLeadStage(draggedId, stageId);
      setDraggedId(null);
    }
  };

  const visibleStages = STAGES.filter((s) => s.id !== "closed_lost");

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {visibleStages.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage.id);
        const isDragOver = dragOverStage === stage.id;

        return (
          <div key={stage.id} className="flex-shrink-0 w-[260px]">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: stage.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {stage.title}
                </span>
              </div>
              <span className="text-xs text-gray-400">{stageLeads.length}</span>
            </div>
            <div
              className={`min-h-[400px] rounded-lg p-2 space-y-2 transition-colors ${
                isDragOver
                  ? "bg-gray-100 border-2 border-dashed border-gray-300"
                  : "bg-gray-50"
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {stageLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onDragStart={() => handleDragStart(lead.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
