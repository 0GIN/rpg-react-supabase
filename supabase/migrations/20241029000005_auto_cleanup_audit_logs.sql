-- Automatic cleanup of old audit logs using pg_cron
-- This keeps the database lean by removing mission history older than 90 days

-- 1. Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule automatic cleanup job
-- Runs every day at 3:00 AM UTC
-- Deletes mission_completions older than 90 days
SELECT cron.schedule(
  'cleanup-old-mission-logs',           -- job name
  '0 3 * * *',                          -- cron expression: daily at 3 AM
  $$DELETE FROM mission_completions 
    WHERE completed_at < NOW() - INTERVAL '90 days'$$
);

-- 3. Verify the job was created (optional, for testing)
-- You can check scheduled jobs with:
-- SELECT * FROM cron.job;

-- 4. If you want to change the retention period later, update the job:
-- SELECT cron.unschedule('cleanup-old-mission-logs');
-- Then re-run the cron.schedule command with new interval

-- NOTES:
-- - pg_cron may require Supabase Pro plan or manual enabling in some cases
-- - If pg_cron is not available, you can manually run the DELETE query monthly
-- - Adjust INTERVAL '90 days' to your preferred retention (e.g., '30 days', '180 days')
