# CLAUDE.md

Project guidance for Claude Code when working in this repository.

## Project: SmoothSale

AI-powered sales copilot. Next.js 14 App Router + Tailwind + Supabase + Zustand + Gemini.

## Connection Status

| Page / Component | Status | Wired through |
|---|---|---|
| `/pipeline` (page + KanbanBoard) | **Connected** | `api.leads.list()` on mount; `api.leads.updateStage()` on drag-drop with optimistic update + revert on failure |
| `/lead-intel` | **Connected** | `api.analyze(url)` for profile + emails; `api.leads.create()` for Add to Pipeline (then redirects to `/pipeline` after 1s) |
| `/add-product` | **Connected** | `api.icp.get()` on mount (prefills form); `api.icp.upsert()` on save |
| `AddLeadModal` | **Connected** | `api.leads.create()` on submit, then `addLead()` into Zustand with the server-returned row |
| `KanbanBoard` drag-drop | **Connected** | Optimistic `updateLeadStage()` first, then `api.leads.updateStage()`; reverts Zustand on failure |
| `/analytics` | **Not connected** | Still reads `leads.length` from Zustand but funnel + KPIs are hardcoded |

## Architecture notes

- **Single user_id**: hardcoded `DEMO_USER_ID = 'demo-user-001'` in [lib/constants.ts](lib/constants.ts) and used inside [lib/api.ts](lib/api.ts) wrapper. No auth yet.
- **API wrapper layer**: All page/component code calls `api.*` from [lib/api.ts](lib/api.ts) — never `fetch()` directly. The wrapper unwraps response shapes (`{ leads }` → `Lead[]`, `{ lead }` → `Lead`, etc.) so callers get clean entities.
- **Zustand store**: [lib/store.ts](lib/store.ts) holds pipeline leads. Server-of-truth is Supabase; Zustand is a client cache populated on page load and mutated optimistically on writes.
- **AI provider**: Google Gemini via `@google/generative-ai`. Wrapper in [lib/gemini.ts](lib/gemini.ts). Used by [lib/email-generator.ts](lib/email-generator.ts) and [app/api/transcripts/route.ts](app/api/transcripts/route.ts).
- **Mock fallbacks (do not remove)**: [lib/linkedin.ts](lib/linkedin.ts) returns a mock Proxycurl profile when `PROXYCURL_API_KEY` is missing; [lib/email-generator.ts](lib/email-generator.ts) returns templated emails when `GEMINI_API_KEY` is missing. Same pattern in `app/api/transcripts/route.ts` — mock analysis without `GEMINI_API_KEY`. This lets the full app run with zero external keys.
- **Database**: [lib/supabase-schema.sql](lib/supabase-schema.sql) is the source of truth. Run it once in the Supabase SQL editor on a fresh project.

## Data shape: ProfileAnalysis

`ProfileAnalysis.fit_score` is a **number 1-10** (not a `FitScore` string). Tier labels:
- `8-10` → `Hot` (emerald)
- `5-7` → `Warm` (amber)
- `1-4` → `Cold` (red)

When persisting an analyzed profile as a `Lead` (Lead.fit_score is `'high' | 'medium' | 'low'`), map numeric → label using the same thresholds. See `numericToFitLabel()` in [app/lead-intel/page.tsx](app/lead-intel/page.tsx).

## Env

See `.env.local.example`. Only `GEMINI_API_KEY` and `PROXYCURL_API_KEY` are optional (mock fallbacks). The Supabase keys are required for any real database call to succeed.

## Build / dev

```bash
npm run dev    # local dev
npm run build  # type-check + production build
```
