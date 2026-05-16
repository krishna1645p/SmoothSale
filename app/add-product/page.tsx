"use client";

import { useState } from "react";

export default function AddProductPage() {
  const [productDesc, setProductDesc] = useState(
    "Proto is a developer productivity platform that helps engineering teams reduce context-switching and ship faster. We target companies with 50-1000 engineers."
  );
  const [industries, setIndustries] = useState(
    "SaaS, AI/ML, Fintech, Developer Tools"
  );
  const [roles, setRoles] = useState(
    "VP Eng, CTO, Head of Engineering, Eng Director"
  );
  const [companySize, setCompanySize] = useState("50-1000 employees");
  const [geography, setGeography] = useState("US, Canada, UK");
  const [keywords, setKeywords] = useState(
    "hiring engineers, scaling, developer experience, DevEx"
  );

  const handleSave = () => {
    alert("ICP saved successfully");
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
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Save ICP
          </button>
        </div>
      </div>
    </div>
  );
}
