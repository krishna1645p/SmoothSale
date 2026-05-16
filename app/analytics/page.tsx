"use client";

import { usePipelineStore } from "@/lib/store";

const funnelData = [
  { stage: "Lead", count: 24, width: "100%" },
  { stage: "Outreach", count: 18, width: "75%" },
  { stage: "Meeting", count: 10, width: "42%" },
  { stage: "Proposal", count: 6, width: "25%" },
  { stage: "Closed Won", count: 4, width: "17%" },
];

export default function AnalyticsPage() {
  const { leads } = usePipelineStore();

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Pipeline Analytics
      </h2>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400">Total Leads</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {leads.length || 24}
          </p>
          <p className="text-xs text-gray-400 mt-1">+3 this week</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">18%</p>
          <p className="text-xs text-emerald-600 mt-1">+2.3% vs last month</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400">Avg. Deal Cycle</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">14d</p>
          <p className="text-xs text-gray-400 mt-1">From outreach to close</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400">Stale Leads</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">3</p>
          <p className="text-xs text-amber-600 mt-1">No activity 7+ days</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Stage Conversion Funnel
        </h3>
        <div className="space-y-3">
          {funnelData.map((item) => (
            <div key={item.stage} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24">{item.stage}</span>
              <div className="flex-1 h-7 bg-gray-100 rounded-md overflow-hidden">
                <div
                  className="h-full bg-gray-400 rounded-md"
                  style={{ width: item.width }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
