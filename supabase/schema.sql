-- Life CRM — Supabase schema + seed data
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: it drops and recreates the five tables below.

drop table if exists attachments cascade;
drop table if exists task_contacts cascade;
drop table if exists tasks cascade;
drop table if exists contacts cascade;
drop table if exists categories cascade;

create table categories (
  id text primary key,
  name text not null,
  color text not null,
  tint text not null,
  icon text not null,
  sort_order integer not null default 0
);

create table contacts (
  id text primary key,
  name text not null,
  role text not null,
  status text not null,
  email text,
  phone text
);

create table tasks (
  id text primary key,
  category_id text not null references categories(id) on delete cascade,
  title text not null,
  company_name text,
  status text not null check (status in ('todo', 'in_progress', 'done')),
  urgency text not null check (urgency in ('low', 'medium', 'high')),
  event_date date,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table task_contacts (
  task_id text not null references tasks(id) on delete cascade,
  contact_id text not null references contacts(id) on delete cascade,
  primary key (task_id, contact_id)
);

create table attachments (
  id text primary key,
  task_id text not null references tasks(id) on delete cascade,
  name text not null,
  url text not null,
  uploaded_at timestamptz not null default now()
);

-- Row Level Security
-- This app has no login (it uses the public anon/publishable key directly),
-- so these policies allow full read/write to anyone holding that key.
-- That's fine for a personal tool in a private repo; if you ever add
-- authentication, tighten these to check auth.uid() instead of `true`.
alter table categories enable row level security;
alter table contacts enable row level security;
alter table tasks enable row level security;
alter table task_contacts enable row level security;
alter table attachments enable row level security;

create policy "public access" on categories for all using (true) with check (true);
create policy "public access" on contacts for all using (true) with check (true);
create policy "public access" on tasks for all using (true) with check (true);
create policy "public access" on task_contacts for all using (true) with check (true);
create policy "public access" on attachments for all using (true) with check (true);

-- Seed data (mirrors what was previously hardcoded in src/mockData.ts)
insert into categories (id, name, color, tint, icon, sort_order) values
  ('job-search', 'Job Search', '#f97316', '#fff1e6', 'Briefcase', 0),
  ('miluim', 'Miluim (Reserves)', '#4d7c0f', '#f1f8e2', 'Shield', 1),
  ('or-1900', 'Or 1900 (Partner)', '#ec4899', '#fdeef6', 'Heart', 2),
  ('friends', 'Friends', '#3b82f6', '#eaf2fe', 'Users', 3),
  ('web-projects', 'Personal Web Projects', '#8b5cf6', '#f3eefe', 'Code', 4),
  ('marathon', 'Marathon Training', '#ef4444', '#feecec', 'Activity', 5),
  ('avner-yona', 'Avner Yona (Coworker)', '#14b8a6', '#e9fbf8', 'Building2', 6),
  ('tal-orev', 'Tal Orev Mentor Project', '#f59e0b', '#fef6e4', 'GraduationCap', 7),
  ('non-profits', 'Non-profits', '#10b981', '#e8faf3', 'HeartHandshake', 8),
  ('network-groups', 'Key Network Groups', '#6366f1', '#edeefe', 'Network', 9);

insert into contacts (id, name, role, status, email, phone) values
  ('c-checkpoint-hr', 'Noa Regev', 'HR Recruiter', 'Active', 'noa.regev@checkpoint.com', '054-1234567'),
  ('c-wix-recruiter', 'Itai Ben-David', 'Talent Acquisition', 'Active', 'itai.bd@wix.com', '052-2345678'),
  ('c-monday-recruiter', 'Shira Katz', 'Recruiter', 'Closed - Rejected', 'shira.katz@monday.com', null),
  ('c-fiverr-hiring', 'Omer Levi', 'Hiring Manager', 'Active', 'omer.levi@fiverr.com', '053-3456789'),
  ('c-or', 'Or', 'Partner', 'Active', null, '050-1112233'),
  ('c-yossi', 'Yossi Mizrahi', 'Friend', 'Active', null, '054-9988776'),
  ('c-dani', 'Dani Cohen', 'Friend', 'Active', null, '050-5544332'),
  ('c-avner', 'Avner Yona', 'Coworker', 'Active', 'avner.yona@company.com', null),
  ('c-tal', 'Tal Orev', 'Mentor', 'Active', 'tal.orev@mentors.org', null);

insert into tasks (id, category_id, title, company_name, status, urgency, event_date, description) values
  ('t-job-checkpoint', 'job-search', 'Backend Developer', 'Check Point', 'in_progress', 'high', current_date + 2, 'Technical interview scheduled. Reviewed system design notes. Second round after this.'),
  ('t-job-wix', 'job-search', 'Fullstack Engineer', 'Wix', 'todo', 'medium', current_date + 6, 'Applied via referral. Waiting on initial screening call.'),
  ('t-job-monday', 'job-search', 'Product Engineer', 'Monday.com', 'done', 'low', current_date - 14, 'Reached final round, ultimately rejected in favor of an internal candidate. Good feedback received.'),
  ('t-job-fiverr', 'job-search', 'Senior Developer', 'Fiverr', 'in_progress', 'medium', current_date + 4, 'Take-home assignment submitted, awaiting review.'),
  ('t-miluim-prep', 'miluim', 'Reserve duty prep - equipment check', null, 'todo', 'high', current_date + 3, 'Pack gear, confirm call-up dates with unit.'),
  ('t-miluim-return', 'miluim', 'Equipment return - Base 8210', null, 'done', 'low', current_date - 8, 'Returned gear after last stint, confirmed release form signed.'),
  ('t-or-anniversary', 'or-1900', 'Anniversary dinner planning', null, 'todo', 'medium', current_date + 5, 'Book restaurant, arrange surprise.'),
  ('t-or-lease', 'or-1900', 'Apartment lease renewal discussion', null, 'in_progress', 'medium', current_date + 1, 'Compare renewal terms vs. moving options together.'),
  ('t-friends-bbq', 'friends', 'Yossi''s birthday BBQ', null, 'todo', 'low', current_date + 4, 'Bring drinks, confirm headcount.'),
  ('t-friends-coffee', 'friends', 'Coffee catch-up with Dani', null, 'done', 'low', current_date - 2, 'Caught up after his move, good to reconnect.'),
  ('t-web-lifecrm', 'web-projects', 'Life CRM App', null, 'in_progress', 'high', current_date, 'Wiring up Supabase as the real backend.'),
  ('t-web-portfolio', 'web-projects', 'Portfolio site redesign', null, 'todo', 'low', current_date + 20, 'Refresh case studies, add dark hero section.'),
  ('t-marathon-longrun', 'marathon', 'Long run - 32km', null, 'todo', 'medium', current_date + 3, 'Fuel with gels every 8km, target pace 5:40/km.'),
  ('t-marathon-race', 'marathon', 'Tel Aviv Marathon - race day', null, 'todo', 'high', current_date + 45, 'Goal: sub-3:45. Taper starts two weeks out.'),
  ('t-marathon-physio', 'marathon', 'Physio appointment - knee', null, 'done', 'low', current_date - 5, 'Cleared to keep training, given mobility exercises.'),
  ('t-avner-handoff', 'avner-yona', 'Handoff docs for API migration', null, 'in_progress', 'medium', current_date + 2, 'Document auth flow before Avner takes over the service.'),
  ('t-tal-session', 'tal-orev', 'Mentoring session prep', null, 'todo', 'medium', current_date + 7, 'Prepare questions on career direction and negotiation.'),
  ('t-nonprofit-orientation', 'non-profits', 'Volunteer orientation - Latet', null, 'todo', 'low', current_date + 9, 'New volunteer orientation session.'),
  ('t-nonprofit-fooddrive', 'non-profits', 'Food drive coordination', null, 'in_progress', 'medium', current_date + 6, 'Coordinate pickup locations with 3 volunteers.'),
  ('t-network-meetup', 'network-groups', 'Monthly meetup - Tech Leaders Israel', null, 'todo', 'low', current_date + 8, 'RSVP and prepare a couple of talking points.'),
  ('t-network-followup', 'network-groups', 'Follow up intros from last meetup', null, 'in_progress', 'medium', current_date + 1, 'Send LinkedIn connections and a short thank-you note.');

insert into task_contacts (task_id, contact_id) values
  ('t-job-checkpoint', 'c-checkpoint-hr'),
  ('t-job-wix', 'c-wix-recruiter'),
  ('t-job-monday', 'c-monday-recruiter'),
  ('t-job-fiverr', 'c-fiverr-hiring'),
  ('t-or-anniversary', 'c-or'),
  ('t-or-lease', 'c-or'),
  ('t-friends-bbq', 'c-yossi'),
  ('t-friends-coffee', 'c-dani'),
  ('t-avner-handoff', 'c-avner'),
  ('t-tal-session', 'c-tal');

insert into attachments (id, task_id, name, url, uploaded_at) values
  ('a1', 't-job-checkpoint', 'CV_v3_backend.pdf', '#', now() - interval '10 days'),
  ('a2', 't-job-wix', 'CV_v2_fullstack.pdf', '#', now() - interval '20 days'),
  ('a3', 't-job-monday', 'CV_v3_backend.pdf', '#', now() - interval '25 days'),
  ('a4', 't-job-fiverr', 'CV_v3_backend.pdf', '#', now() - interval '10 days');
