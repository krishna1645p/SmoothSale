"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const DEFAULT_PRODUCT_DESC =
  "Proto is a developer productivity platform that helps engineering teams reduce context-switching and ship faster. We target companies with 50-1000 engineers.";
const DEFAULT_INDUSTRIES = "SaaS, AI/ML, Fintech, Developer Tools";
const DEFAULT_ROLES = "VP Eng, CTO, Head of Engineering, Eng Director";
const DEFAULT_COMPANY_SIZE = "50-1000 employees";
const DEFAULT_GEOGRAPHY = "US, Canada, UK";
const DEFAULT_KEYWORDS = "hiring engineers, scaling, developer experience, DevEx";

function parseCompanySize(input: string): { min: number; max: number } {
  const match = input.match(/(\d+)\s*-\s*(\d+)/);
  if (match) return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  return { min: 0, max: 10000 };
}

function splitCsv(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AddProductPage() {
  const [productDesc, setProductDesc] = useState(DEFAULT_PRODUCT_DESC);
  const [industries, setIndustries] = useState(DEFAULT_INDUSTRIES);
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [companySize, setCompanySize] = useState(DEFAULT_COMPANY_SIZE);
  const [geography, setGeography] = useState(DEFAULT_GEOGRAPHY);
  const [keywords, setKeywords] = useState(DEFAULT_KEYWORDS);

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    api.icp
      .get()
      .then((icp) => {
        if (cancelled || !icp) return;
        if (icp.product_description) setProductDesc(icp.product_description);
        if (icp.target_industries?.length)
          setIndustries(icp.target_industries.join(", "));
        if (icp.target_roles?.length) setRoles(icp.target_roles.join(", "));
        if (typeof icp.company_size_min === "number" && typeof icp.company_size_max === "number") {
          setCompanySize(`${icp.company_size_min}-${icp.company_size_max} employees`);
        }
        if (icp.geographies?.length) setGeography(icp.geographies.join(", "));
        if (icp.keywords?.length) setKeywords(icp.keywords.join(", "));
      })
      .catch(() => {
        // Silent — leaving defaults in place is fine on first load
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const size = parseCompanySize(companySize);
    try {
      await api.icp.upsert({
        name: "Default ICP",
        product_description: productDesc,
        target_industries: splitCsv(industries),
        target_roles: splitCsv(roles),
        company_size_min: size.min,
        company_size_max: size.max,
        geographies: splitCsv(geography),
        keywords: splitCsv(keywords),
      });
      setStatus({ kind: "success", message: "ICP saved successfully" });
    } catch (e) {
      setStatus({
        kind: "error",
        message: e instanceof Error ? e.message : "Failed to save ICP",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Add Product/Service
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Define what you sell and your ideal customer profile. This powers fit
          scoring and email personalization.
        </p>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Your Product/Service
            </label>
            <textarea
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              rows={3}
              placeholder="Describe what you sell and the key value propositions..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Target Industries
              </label>
              <input
                type="text"
                value={industries}
                onChange={(e) => setIndustries(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Target Roles
              </label>
              <input
                type="text"
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Company Size
              </label>
              <input
                type="text"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Geography
              </label>
              <input
                type="text"
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Keywords / Signals
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save ICP"}
            </button>
            {status && (
              <span
                className={`text-sm ${
                  status.kind === "success" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {status.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
