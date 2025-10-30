-- Add character customization columns to postacie
-- Creates JSONB columns for base appearance and equipped clothing

alter table public.postacie
  add column if not exists appearance jsonb not null default '{}'::jsonb;

alter table public.postacie
  add column if not exists clothing jsonb not null default '{}'::jsonb;

comment on column public.postacie.appearance is 'Character base appearance (gender, bodyType, skinTone, etc)';
comment on column public.postacie.clothing is 'Equipped clothing PNG paths (body, hair, top, bottom, shoes, accessory, implant)';
