"use client";

import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { DealStage, Lead, OutreachMode } from "@/types";
import { usePipelineStore } from "@/lib/store";
import { STAGES } from "@/lib/constants";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const { addLead } = usePipelineStore();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [stage, setStage] = useState<DealStage>("lead");
  const [outreachMode, setOutreachMode] = useState<OutreachMode>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !company) return;

    const newLead: Lead = {
      id: crypto.randomUUID(),
      name,
      company,
      title: title || "New Lead",
      stage,
      fit_score: "medium",
      outreach_mode: outreachMode,
      linkedin_url: linkedinUrl || undefined,
      last_activity: "Just now",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "",
    };

    addLead(newLead);
    setName("");
    setCompany("");
    setTitle("");
    setLinkedinUrl("");
    setStage("lead");
    setOutreachMode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">
            Add New Lead
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} weight="light" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Company name"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="Job title"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              LinkedIn URL (optional)
            </label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as DealStage)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Outreach Mode
            </label>
            <select
              value={outreachMode || ""}
              onChange={(e) =>
                setOutreachMode((e.target.value as OutreachMode) || null)
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
            >
              <option value="">Not yet contacted</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="linkedin_message">LinkedIn Message</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}
