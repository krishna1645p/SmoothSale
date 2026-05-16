"use client";

import { User } from "@phosphor-icons/react";
import { ProfileAnalysis } from "@/types";

interface ProfileCardProps {
  profile: ProfileAnalysis;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const fitColors = {
    high: "bg-emerald-50 text-emerald-800",
    medium: "bg-amber-50 text-amber-800",
    low: "bg-red-50 text-red-800",
  };
  const fitLabels = { high: "High Fit", medium: "Medium Fit", low: "Low Fit" };

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={24} weight="light" className="text-gray-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {profile.name}
            </h3>
            <p className="text-sm text-gray-500">
              {profile.title} at {profile.company}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{profile.location}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${fitColors[profile.fit_score]}`}
        >
          {fitLabels[profile.fit_score]}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-400">Industry</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {profile.industry}
          </p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-400">Company Size</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {profile.company_size}
          </p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-xs text-gray-400">Seniority</p>
          <p className="text-sm font-medium text-gray-700 mt-0.5">
            {profile.seniority}
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-1.5">Fit Analysis</p>
        <p className="text-sm text-gray-600">{profile.fit_reason}</p>
      </div>
    </div>
  );
}
