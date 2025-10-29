-- Migration: Add Inventory System and Mission Requirements
-- Adds JSONB columns for flexible game mechanics

-- 1. Add inventory column to postacie table for storing items
ALTER TABLE postacie ADD COLUMN IF NOT EXISTS inventory JSONB DEFAULT '[]'::jsonb;

-- Inventory structure example:
-- [
--   {
--     "id": "cyber_implant_mk2",
--     "name": "Cyber Implant MK2",
--     "type": "augmentation",
--     "stats": {"hacking": +5, "combat": +2},
--     "quantity": 1,
--     "equipped": true
--   },
--   {
--     "id": "health_kit",
--     "name": "Zestaw Medyczny",
--     "type": "consumable",
--     "quantity": 3
--   }
-- ]

-- Add index for faster inventory queries
CREATE INDEX IF NOT EXISTS idx_postacie_inventory ON postacie USING GIN (inventory);

-- 2. Add wymagania (requirements) column to zlecenia_definicje
ALTER TABLE zlecenia_definicje ADD COLUMN IF NOT EXISTS wymagania JSONB DEFAULT '{}'::jsonb;

-- Requirements structure example:
-- {
--   "min_level": 5,
--   "min_street_cred": 50,
--   "required_items": ["cyber_implant_mk1"],
--   "completed_missions": ["mission_tutorial_01"],
--   "max_level": 10  // optional: for beginner missions
-- }

-- Add index for faster requirement queries
CREATE INDEX IF NOT EXISTS idx_zlecenia_wymagania ON zlecenia_definicje USING GIN (wymagania);

-- 3. Add level column to postacie (for leveling system)
ALTER TABLE postacie ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE postacie ADD CONSTRAINT level_min_max CHECK (level >= 1 AND level <= 100);

-- 4. Extend nagrody structure to support item rewards
-- No schema change needed - just documentation of extended format:
-- {
--   "kredyty": 100,
--   "street_cred": 10,
--   "experience": 50,
--   "items": [
--     {"id": "cyber_implant_mk2", "quantity": 1},
--     {"id": "health_kit", "quantity": 2}
--   ]
-- }

COMMENT ON COLUMN postacie.inventory IS 'Player inventory stored as JSONB array of items with stats and quantities';
COMMENT ON COLUMN zlecenia_definicje.wymagania IS 'Mission requirements stored as JSONB: min_level, required_items, etc.';
COMMENT ON COLUMN postacie.level IS 'Player level for progression system (1-100)';
