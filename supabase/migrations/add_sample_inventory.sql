-- ========================================
-- ADD SAMPLE ITEMS TO YOUR INVENTORY
-- ========================================
-- Run this AFTER run_all_items_migrations.sql
-- Replace YOUR_CHARACTER_ID with your actual character ID

-- First, find your character ID:
-- SELECT id, nazwa FROM postacie WHERE user_id = auth.uid();

-- Then insert sample items (update the postac_id value):
INSERT INTO public.ekwipunek (postac_id, item_id, ilosc, zalozony) VALUES
  (YOUR_CHARACTER_ID, 'cyber_jacket_f', 1, false),
  (YOUR_CHARACTER_ID, 'cyber_pants_f', 1, false),
  (YOUR_CHARACTER_ID, 'combat_boots', 1, false),
  (YOUR_CHARACTER_ID, 'pistol_9mm', 1, false),
  (YOUR_CHARACTER_ID, 'medkit', 3, false),
  (YOUR_CHARACTER_ID, 'energy_drink', 5, false)
ON CONFLICT (postac_id, item_id) 
DO UPDATE SET ilosc = ekwipunek.ilosc + EXCLUDED.ilosc;

-- ========================================
-- OR run this query to add items automatically:
-- ========================================
/*
DO $$
DECLARE
  char_id BIGINT;
BEGIN
  -- Get your character ID
  SELECT id INTO char_id FROM postacie WHERE user_id = auth.uid() LIMIT 1;
  
  IF char_id IS NOT NULL THEN
    INSERT INTO public.ekwipunek (postac_id, item_id, ilosc, zalozony) VALUES
      (char_id, 'cyber_jacket_f', 1, false),
      (char_id, 'cyber_pants_f', 1, false),
      (char_id, 'combat_boots', 1, false),
      (char_id, 'pistol_9mm', 1, false),
      (char_id, 'medkit', 3, false),
      (char_id, 'energy_drink', 5, false)
    ON CONFLICT (postac_id, item_id) 
    DO UPDATE SET ilosc = ekwipunek.ilosc + EXCLUDED.ilosc;
  END IF;
END $$;
*/
