-- Migration: Add level and stats system
-- Created: 2025-01-30
-- Description: Adds experience, stat points, and character statistics

-- Add experience column
alter table public.postacie
  add column if not exists experience integer not null default 0;

comment on column public.postacie.experience is 
  'Current experience points earned by the character';

-- Add stat_points column (earned on level up, used to increase stats)
alter table public.postacie
  add column if not exists stat_points integer not null default 0;

comment on column public.postacie.stat_points is 
  'Available stat points to spend on character statistics';

-- Add stats column (JSONB for flexibility)
alter table public.postacie
  add column if not exists stats jsonb not null default '{"strength": 1, "intelligence": 1, "endurance": 1, "agility": 1, "charisma": 1, "luck": 1}'::jsonb;

comment on column public.postacie.stats is 
  'Character statistics: strength, intelligence, endurance, agility, charisma, luck';

-- Update existing level column to have default value 1
alter table public.postacie
  alter column level set default 1;

-- Update existing characters to have level 1 and base stats if they don't have them
update public.postacie
set 
  level = coalesce(level, 1),
  experience = coalesce(experience, 0),
  stat_points = coalesce(stat_points, 5), -- Give 5 starting points
  stats = coalesce(
    stats, 
    '{"strength": 1, "intelligence": 1, "endurance": 1, "agility": 1, "charisma": 1, "luck": 1}'::jsonb
  )
where level is null or stats is null;

-- Create index for faster stat queries
create index if not exists idx_postacie_level 
  on public.postacie (level desc);

create index if not exists idx_postacie_experience 
  on public.postacie (experience desc);
