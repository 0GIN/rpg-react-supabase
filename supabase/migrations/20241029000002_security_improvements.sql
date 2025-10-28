-- Security improvements and audit logging

-- 1. Add audit log table for completed missions
CREATE TABLE IF NOT EXISTS mission_completions (
  id BIGSERIAL PRIMARY KEY,
  postac_id INTEGER NOT NULL REFERENCES postacie(id) ON DELETE CASCADE,
  zlecenie_id INTEGER NOT NULL REFERENCES zlecenia_definicje(id) ON DELETE CASCADE,
  kredyty_nagroda INTEGER NOT NULL DEFAULT 0,
  street_cred_nagroda INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast queries by character
CREATE INDEX IF NOT EXISTS idx_mission_completions_postac_id ON mission_completions(postac_id);
CREATE INDEX IF NOT EXISTS idx_mission_completions_completed_at ON mission_completions(completed_at);

-- RLS for audit log (users can only see their own completions)
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gracze widzą tylko swoje ukończone misje"
  ON mission_completions FOR SELECT
  USING (
    postac_id IN (
      SELECT id FROM postacie WHERE user_id = auth.uid()
    )
  );

-- 2. Add 'visible' column to zlecenia_definicje for future admin control
ALTER TABLE zlecenia_definicje 
  ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT true;

-- Update existing policy to only show visible missions
DROP POLICY IF EXISTS "Wszyscy widzą dostępne zlecenia" ON zlecenia_definicje;

CREATE POLICY "Wszyscy widzą dostępne zlecenia"
  ON zlecenia_definicje FOR SELECT
  USING (visible = true);

-- 3. Add rate limiting: track last mission start time
ALTER TABLE postacie
  ADD COLUMN IF NOT EXISTS last_mission_started_at TIMESTAMPTZ;

-- 4. Add column to track total missions completed (for stats/achievements)
ALTER TABLE postacie
  ADD COLUMN IF NOT EXISTS missions_completed INTEGER NOT NULL DEFAULT 0;

-- Index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_postacie_last_mission_started ON postacie(last_mission_started_at);
