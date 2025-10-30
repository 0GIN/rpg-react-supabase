-- Migration: Add inventory system
-- Created: 2025-01-30
-- Description: Adds inventory column to store player items

-- Add inventory column to postacie table
alter table public.postacie
  add column if not exists inventory jsonb not null default '[]'::jsonb;

comment on column public.postacie.inventory is 
  'Player inventory - array of {itemId, quantity, equipped?, obtainedAt?}';

-- Create index for faster inventory queries
create index if not exists idx_postacie_inventory 
  on public.postacie using gin (inventory);

-- Example starting inventory data (optional - can be set during character creation)
-- This gives new players some basic items to start with
-- update public.postacie 
-- set inventory = '[
--   {"itemId": "medkit", "quantity": 3, "obtainedAt": "2025-01-30T00:00:00Z"},
--   {"itemId": "energy_drink", "quantity": 5, "obtainedAt": "2025-01-30T00:00:00Z"},
--   {"itemId": "pistol_9mm", "quantity": 1, "obtainedAt": "2025-01-30T00:00:00Z"}
-- ]'::jsonb
-- where inventory = '[]'::jsonb;
