-- Add experience rewards to mission definitions

-- Update existing missions to include experience in rewards
UPDATE zlecenia_definicje
SET nagrody = jsonb_set(
  nagrody::jsonb,
  '{experience}',
  to_jsonb(
    CASE 
      -- Easy missions (1-5 min): 50-100 EXP
  WHEN czas_trwania_sekundy <= 300 THEN 50 + (czas_trwania_sekundy / 60) * 10
      -- Medium missions (5-15 min): 100-300 EXP  
  WHEN czas_trwania_sekundy <= 900 THEN 100 + (czas_trwania_sekundy / 60) * 20
      -- Long missions (15+ min): 300-500 EXP
  ELSE 300 + (czas_trwania_sekundy / 60) * 10
    END::integer
  )
)::json
WHERE nagrody IS NOT NULL;

-- Log changes
DO $$
BEGIN
  RAISE NOTICE 'Updated % missions with experience rewards', 
    (SELECT COUNT(*) FROM zlecenia_definicje WHERE nagrody::jsonb ? 'experience');
END $$;
