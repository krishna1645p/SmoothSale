-- SmoothSale Database Schema
-- Run this in your Supabase SQL editor to set up the database

create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamp with time zone default now()
);

-- ICP (Ideal Customer Profile) configuration
create table public.icps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'Default ICP',
  product_description text,
  target_industries text[] default '{}',
  target_roles text[] default '{}',
  company_size_min integer default 0,
  company_size_max integer default 10000,
  geographies text[] default '{}',
  keywords text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Leads table
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  company text not null,
  title text,
  email text,
  linkedin_url text,
  location text,
  industry text,
  company_size text,
  seniority text,
  stage text not null default 'lead' check (
    stage in ('lead', 'outreach', 'meeting', 'proposal', 'negotiation', 'closed_won', 'closed_lost')
  ),
  fit_score text default 'medium' check (fit_score in ('high', 'medium', 'low')),
  fit_reason text,
  outreach_mode text check (outreach_mode in ('email', 'phone', 'linkedin_message') or outreach_mode is null),
  phone text,
  last_activity text default 'Just now',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Activities (timeline per lead)
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('stage_change', 'note', 'email', 'meeting', 'call')),
  description text not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- Meeting transcripts linked to leads
create table public.transcripts (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  source text,
  raw_text text,
  summary text,
  action_items text[] default '{}',
  pain_points text[] default '{}',
  objections text[] default '{}',
  next_action text,
  sentiment text,
  conversion_likelihood text,
  meeting_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Generated emails (saved for reference)
create table public.generated_emails (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('cold_email', 'coffee_chat', 'follow_up')),
  subject text,
  body text not null,
  tone text default 'professional',
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.icps enable row level security;
alter table public.leads enable row level security;
alter table public.activities enable row level security;
alter table public.transcripts enable row level security;
alter table public.generated_emails enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can CRUD own ICPs" on public.icps
  for all using (auth.uid() = user_id);

create policy "Users can CRUD own leads" on public.leads
  for all using (auth.uid() = user_id);

create policy "Users can CRUD own activities" on public.activities
  for all using (auth.uid() = user_id);

create policy "Users can CRUD own transcripts" on public.transcripts
  for all using (auth.uid() = user_id);

create policy "Users can CRUD own emails" on public.generated_emails
  for all using (auth.uid() = user_id);

-- Demo mode policies (no auth required)
create policy "Demo user can CRUD leads"
  on public.leads for all
  using (user_id = '00000000-0000-0000-0000-000000000001')
  with check (user_id = '00000000-0000-0000-0000-000000000001');

create policy "Demo user can CRUD icps"
  on public.icps for all
  using (user_id = '00000000-0000-0000-0000-000000000001')
  with check (user_id = '00000000-0000-0000-0000-000000000001');

create policy "Demo user can CRUD activities"
  on public.activities for all
  using (user_id = '00000000-0000-0000-0000-000000000001')
  with check (user_id = '00000000-0000-0000-0000-000000000001');

create policy "Demo user can CRUD transcripts"
  on public.transcripts for all
  using (user_id = '00000000-0000-0000-0000-000000000001')
  with check (user_id = '00000000-0000-0000-0000-000000000001');

create policy "Demo user can CRUD emails"
  on public.generated_emails for all
  using (user_id = '00000000-0000-0000-0000-000000000001')
  with check (user_id = '00000000-0000-0000-0000-000000000001');

create index idx_leads_user_id on public.leads(user_id);
create index idx_leads_stage on public.leads(stage);
create index idx_activities_lead_id on public.activities(lead_id);
create index idx_transcripts_lead_id on public.transcripts(lead_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_lead_updated
  before update on public.leads
  for each row execute function public.handle_updated_at();

create trigger on_icp_updated
  before update on public.icps
  for each row execute function public.handle_updated_at();
