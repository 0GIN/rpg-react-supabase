-- Migration: Enforce 1 Account = 1 Character
-- Adds UNIQUE constraint on user_id to prevent race conditions

-- Add UNIQUE constraint to ensure one character per account
ALTER TABLE postacie ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- This prevents:
-- 1. Duplicate character creation via simultaneous requests
-- 2. Database inconsistency from race conditions
-- 3. Exploits where users try to create multiple characters

-- If migration fails due to existing duplicates, run this first:
-- DELETE FROM postacie WHERE id NOT IN (
--   SELECT MIN(id) FROM postacie GROUP BY user_id
-- );
