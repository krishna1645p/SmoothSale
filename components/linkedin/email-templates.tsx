"use client";

import { useState } from "react";
import { Copy, Plus, PencilSimple } from "@phosphor-icons/react";
import { EmailTemplate } from "@/types";

interface EmailTemplatesProps {
  coldEmail: EmailTemplate;
  coffeeChat: EmailTemplate;
  onAddToPipeline: () => void;
}

export function EmailTemplates({
  coldEmail,
  coffeeChat,
  onAddToPipeline,
}: EmailTemplatesProps) {
  const [activeTab, setActiveTab] = useState<"cold" | "coffee">("cold");

  const handleCopy = () => {
    const text =
      activeTab === "cold"
        ? `Subject: ${coldEmail.subject ?? ""}\n\n${coldEmail.body}`
        : coffeeChat.body;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("cold")}
          className={`px-4 py-2.5 text-sm font-medium ${
            activeTab === "cold"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Cold Email
        </button>
        <button
          onClick={() => setActiveTab("coffee")}
          className={`px-4 py-2.5 text-sm font-medium ${
            activeTab === "coffee"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Coffee Chat
        </button>
      </div>
      <div className="p-5">
        {activeTab === "cold" ? (
          <div>
            <div className="mb-3">
              <label className="text-xs text-gray-400 block mb-1">
                Subject Line
              </label>
              <p className="text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-md">
                {coldEmail.subject}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Body</label>
              <div className="text-sm text-gray-700 bg-gray-50 px-3 py-3 rounded-md leading-relaxed whitespace-pre-line">
                {coldEmail.body}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="text-xs text-gray-400 block mb-1">Message</label>
            <div className="text-sm text-gray-700 bg-gray-50 px-3 py-3 rounded-md leading-relaxed whitespace-pre-line">
              {coffeeChat.body}
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Copy size={14} weight="light" />
            Copy
          </button>
          <button
            onClick={onAddToPipeline}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} weight="light" />
            Add to Pipeline
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <PencilSimple size={14} weight="light" />
            Edit Tone
          </button>
        </div>
      </div>
    </div>
  );
}
