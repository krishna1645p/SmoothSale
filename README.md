# SmoothSale

AI-powered sales copilot that tracks leads end-to-end from discovery to close.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL + Auth)
- **State:** Zustand
- **Icons:** Phosphor Icons
- **AI:** Google Gemini (for email generation and transcript analysis)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up Supabase:
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema in `lib/supabase-schema.sql` in the SQL editor
   - Copy your project URL and anon key

3. Configure environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
smoothsale/
├── app/
│   ├── pipeline/       # Kanban board view
│   ├── lead-intel/     # LinkedIn analysis + email generation
│   ├── analytics/      # Pipeline metrics & funnel
│   ├── add-product/    # ICP configuration
│   └── api/            # Route handlers
├── components/
│   ├── ui/             # Shared UI components
│   ├── pipeline/       # Kanban board, lead cards, modals
│   └── linkedin/       # Profile card, email templates
├── lib/                # Supabase clients, store, helpers
└── types/              # TypeScript types
```

## Key Features

- **Pipeline Kanban** — Drag-and-drop leads across stages
- **LinkedIn Intelligence** — Paste a URL, get fit score + personalized outreach
- **Cold Email Generation** — AI-crafted emails based on prospect profile + your ICP
- **Fit Scoring** — Automatic scoring against your Ideal Customer Profile
- **Analytics** — Conversion funnel, deal cycle time, stale lead alerts
