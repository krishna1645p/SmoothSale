"use client";

import { EnvelopeSimple, Phone, LinkedinLogo } from "@phosphor-icons/react";
import { Lead } from "@/types";

interface LeadCardProps {
  lead: Lead;
  onDragStart: () => void;
}

const outreachIcons: Record<
  string,
  { icon: typeof EnvelopeSimple; label: string }
> = {
  email: { icon: EnvelopeSimple, label: "Email" },
  phone: { icon: Phone, label: "Phone" },
  linkedin_message: { icon: LinkedinLogo, label: "LinkedIn" },
};

export function LeadCard({ lead, onDragStart }: LeadCardProps) {
  const fitColors = {
    high: "bg-emerald-50 text-emerald-800",
    medium: "bg-amber-50 text-amber-800",
    low: "bg-red-50 text-red-800",
  };
  const fitLabels = { high: "High", medium: "Med", low: "Low" };
  const outreach = lead.outreach_mode ? outreachIcons[lead.outreach_mode] : null;

  return (
    <div
      className="bg-white border border-gray-200 rounded-md p-3 cursor-grab hover:shadow-md hover:-translate-y-0.5 transition-all"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">{lead.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{lead.title}</p>
        </div>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${fitColors[lead.fit_score]}`}
        >
          {fitLabels[lead.fit_score]}
        </span>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <span className="text-xs text-gray-500">{lead.company}</span>
        <div className="flex items-center gap-1.5">
          {outreach && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
              <outreach.icon size={10} weight="regular" />
              {outreach.label}
            </span>
          )}
          <span className="text-[10px] text-gray-300">{lead.last_activity}</span>
        </div>
      </div>
    </div>
  );
}
