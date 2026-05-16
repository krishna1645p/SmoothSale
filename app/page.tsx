"use client";

import Link from "next/link";
import {
  Link as LinkIcon,
  Brain,
  EnvelopeSimple,
  Kanban,
  FileText,
  Target,
} from "@phosphor-icons/react";

const kanbanCols = [
  {
    title: "Lead",
    name: "Sarah Chen",
    role: "VP Eng · Acme",
    badge: "Hot · 9/10",
    badgeClass: "bg-navy-50 text-navy-600",
  },
  {
    title: "Outreach",
    name: "James Park",
    role: "CTO · Nexus",
    badge: "Warm · 6/10",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  {
    title: "Meeting",
    name: "Priya Nair",
    role: "PM · Stripe",
    badge: "Hot · 8/10",
    badgeClass: "bg-navy-50 text-navy-600",
  },
  {
    title: "Proposal",
    name: "Tom Walsh",
    role: "Dir · Vercel",
    badge: "Warm · 7/10",
    badgeClass: "bg-amber-50 text-amber-700",
  },
];

const sidebarItems = [
  { label: "Pipeline", active: true },
  { label: "Lead Intel", active: false },
  { label: "Analytics", active: false },
  { label: "ICP Config", active: false },
];

const features = [
  {
    icon: LinkIcon,
    title: "Paste a LinkedIn URL",
    desc: "Drop any profile. SmoothSale pulls full context and scores against your ICP automatically.",
  },
  {
    icon: Brain,
    title: "Get an AI fit score",
    desc: "Gemini scores each lead 1-10 with a plain-English reason. Know instantly where to focus.",
  },
  {
    icon: EnvelopeSimple,
    title: "Send the right email",
    desc: "Cold email and coffee chat drafts written for this specific person — their pain, one clear ask.",
  },
  {
    icon: Kanban,
    title: "Track every deal",
    desc: "Drag leads through your pipeline from first touch to closed won. Persists in real time.",
  },
  {
    icon: FileText,
    title: "Analyze call transcripts",
    desc: "Paste a transcript and get pain points, objections, sentiment, and next action automatically.",
  },
  {
    icon: Target,
    title: "Define your ICP once",
    desc: "Set your ideal customer profile and every score, email, and priority list adapts to it.",
  },
];

function SailboatLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 22L18 22L24 27L9 27Z" fill="#042C53" />
      <path d="M16 4L16 21L27 21Z" fill="#378ADD" />
      <line x1="16" y1="3" x2="16" y2="22" stroke="#042C53" strokeWidth="1.2" />
      <line x1="2" y1="29" x2="30" y2="29" stroke="#85B7EB" strokeWidth="1" />
      <circle cx="26" cy="4" r="0.9" fill="#378ADD" />
      <circle cx="29" cy="7" r="0.7" fill="#85B7EB" />
      <circle cx="23" cy="2" r="0.5" fill="#85B7EB" />
    </svg>
  );
}

function BrandName({ size = "text-base" }: { size?: string }) {
  return (
    <span className={`font-sora font-bold ${size}`}>
      <span className="text-navy-900">Smooth</span>
      <span className="text-navy-400">Sale</span>
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* ─── NAV ─────────────────────────────── */}
      <nav
        className="flex items-center justify-between py-5 px-12"
        style={{ borderBottom: "0.5px solid #B5D4F4" }}
      >
        <div className="flex items-center gap-2.5">
          <SailboatLogo />
          <BrandName size="text-base" />
        </div>
        <div className="flex items-center gap-8">
          <a href="#features" className="text-sm text-navy-600 hover:text-navy-900 transition-colors">
            Features
          </a>
          <a href="#" className="text-sm text-navy-600 hover:text-navy-900 transition-colors">
            Pricing
          </a>
          <a href="#" className="text-sm text-navy-600 hover:text-navy-900 transition-colors">
            Blog
          </a>
          <Link
            href="/pipeline"
            className="bg-navy-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy-800 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────── */}
      <section className="pt-20 pb-16 px-12 text-center bg-white">
        <div className="inline-flex items-center gap-2 bg-navy-50 text-navy-600 rounded-full px-3 py-1 text-xs uppercase tracking-widest font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-navy-400"></span>
          <span>Sales Autopilot · Now Live</span>
        </div>

        <h1 className="font-sora text-5xl font-bold leading-tight text-navy-900 max-w-2xl mx-auto mt-6">
          Close more deals with your{" "}
          <span className="text-navy-400">AI sales copilot</span>
        </h1>

        <p className="text-lg text-navy-600 max-w-lg mx-auto mt-5 leading-relaxed">
          Paste a LinkedIn URL. Get a fit score, outreach emails, and a pipeline — all in 30 seconds.
        </p>

        <div className="flex items-center justify-center gap-3 mt-10">
          <Link
            href="/pipeline"
            className="bg-navy-900 text-white px-7 py-3 rounded-lg font-semibold text-sm hover:bg-navy-800 transition-colors"
          >
            Try SmoothSale Free →
          </Link>
          <button
            type="button"
            className="bg-white text-navy-900 px-7 py-3 rounded-lg font-semibold text-sm border border-navy-100 hover:bg-navy-50 transition-colors"
          >
            Watch 60s Demo
          </button>
        </div>

        {/* App screenshot mockup */}
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl border border-navy-100 overflow-hidden mt-12">
          {/* Top bar */}
          <div className="bg-navy-50 py-2.5 px-4 flex items-center gap-2 border-b border-navy-100">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F09595" }}></span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FAC775" }}></span>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#97C459" }}></span>
            <div className="flex-1 bg-white rounded text-xs text-gray-400 px-2.5 py-1 border border-gray-200 ml-2 text-left">
              smooth-sale.vercel.app/pipeline
            </div>
          </div>

          {/* Body grid */}
          <div className="grid grid-cols-[200px_1fr] gap-4 p-5 text-left">
            {/* Mockup sidebar */}
            <div className="flex flex-col gap-2">
              {sidebarItems.map((item) => (
                <div
                  key={item.label}
                  className={`text-xs font-medium px-3 py-2 rounded-md flex items-center gap-2 ${
                    item.active
                      ? "bg-navy-900 text-white"
                      : "bg-navy-50 text-navy-600"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Mockup main */}
            <div>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white border border-navy-100 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Total Leads</p>
                  <p className="text-lg font-bold font-sora text-navy-900">24</p>
                </div>
                <div className="bg-white border border-navy-100 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Hot Leads</p>
                  <p className="text-lg font-bold font-sora text-navy-400">8</p>
                </div>
                <div className="bg-white border border-navy-100 rounded-lg p-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">Closed Won</p>
                  <p className="text-lg font-bold font-sora text-green-700">3</p>
                </div>
              </div>

              {/* Kanban preview */}
              <div className="grid grid-cols-4 gap-1.5">
                {kanbanCols.map((col) => (
                  <div key={col.title}>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 py-1.5">
                      {col.title}
                    </p>
                    <div className="bg-white border border-navy-100 rounded-md p-2 text-[10px]">
                      <p className="font-semibold text-navy-900">{col.name}</p>
                      <p className="text-gray-400 mt-0.5">{col.role}</p>
                      <span
                        className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded mt-1.5 ${col.badgeClass}`}
                      >
                        {col.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EDGE DIVIDER (top into dark) ───── */}
      <div className="relative bg-white" style={{ height: "60px" }}>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "60px",
            background: "#042C53",
            clipPath: "polygon(0 100%, 100% 40%, 100% 100%)",
          }}
        ></div>
      </div>

      {/* ─── FEATURES (dark) ────────────────── */}
      <section
        id="features"
        className="relative py-20 px-12"
        style={{ background: "#042C53" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase text-navy-200 mb-3">
          How It Works
        </p>
        <h2 className="font-sora text-4xl font-bold text-white max-w-lg leading-snug mb-12">
          <span className="block">From URL to</span>
          <span className="block text-navy-200">ready-to-send</span>
          <span className="block">in seconds</span>
        </h2>

        <div className="grid grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl p-6"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "0.5px solid rgba(181,212,244,0.2)",
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-navy-400/20 flex items-center justify-center mb-4">
                  <Icon size={20} weight="regular" className="text-navy-200" />
                </div>
                <h3 className="font-sora text-sm font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-navy-200 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── EDGE DIVIDER (dark exit) ─────── */}
      <div
        style={{
          height: "60px",
          background: "#042C53",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      ></div>

      {/* ─── CTA SECTION ─────────────────── */}
      <section className="bg-navy-50 text-center py-20 px-12">
        <h2 className="font-sora text-4xl font-bold text-navy-900 mb-3">
          Your first lead is 30 seconds away
        </h2>
        <p className="text-base text-navy-600 mb-8">
          No credit card. No setup. Just paste a URL and go.
        </p>
        <Link
          href="/pipeline"
          className="inline-block bg-navy-900 text-white px-8 py-3.5 rounded-lg font-semibold text-sm hover:bg-navy-800 transition-colors"
        >
          Open SmoothSale →
        </Link>
      </section>

      {/* ─── FOOTER ──────────────────────── */}
      <footer className="bg-white border-t border-navy-100 py-6 px-12 flex justify-between items-center">
        <BrandName size="text-sm" />
        <p className="text-xs text-gray-400">
          Built at Second Axis Hackathon · 2026
        </p>
      </footer>
    </div>
  );
}
