-- SQL functions needed by Edge Functions

-- 1. Function to get postac_id for authenticated user
-- Drop with CASCADE to remove dependent policies, then recreate them
DROP FUNCTION IF EXISTS get_postac_id_for_auth_user() CASCADE;

CREATE OR REPLACE FUNCTION get_postac_id_for_auth_user()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  postac_id_result INTEGER;
BEGIN
  -- Get the postac_id for the currently authenticated user
  SELECT id INTO postac_id_result
  FROM postacie
  WHERE user_id = auth.uid();
  
  RETURN postac_id_result;
END;
$$;

-- 2. Function to collect completed mission rewards
-- Drop existing function first if it exists
DROP FUNCTION IF EXISTS odbierz_ukonczone_zlecenie();

CREATE OR REPLACE FUNCTION odbierz_ukonczone_zlecenie()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  postac_id_var INTEGER;
  aktywne_zlecenie_row RECORD;
  zlecenie_def_row RECORD;
  nagrody_json JSON;
  nowe_kredyty INTEGER;
  nowy_street_cred INTEGER;
BEGIN
  -- Get player's character ID
  SELECT id INTO postac_id_var
  FROM postacie
  WHERE user_id = auth.uid();
  
  IF postac_id_var IS NULL THEN
    RAISE EXCEPTION 'Nie znaleziono postaci dla tego użytkownika';
  END IF;
  
  -- Get active mission for this character
  SELECT * INTO aktywne_zlecenie_row
  FROM aktywne_zlecenia
  WHERE postac_id = postac_id_var
  LIMIT 1;
  
  IF aktywne_zlecenie_row IS NULL THEN
    RAISE EXCEPTION 'Nie masz aktywnej misji';
  END IF;
  
  -- Check if mission is finished (time has passed)
  IF aktywne_zlecenie_row.koniec_zlecenia_o > NOW() THEN
    RAISE EXCEPTION 'Misja jeszcze się nie skończyła';
  END IF;
  
  -- Get mission definition to know rewards
  SELECT * INTO zlecenie_def_row
  FROM zlecenia_definicje
  WHERE id = aktywne_zlecenie_row.zlecenie_id;
  
  IF zlecenie_def_row IS NULL THEN
    RAISE EXCEPTION 'Nie znaleziono definicji zlecenia';
  END IF;
  
  -- Parse rewards (expecting JSON like: {"kredyty": 100, "street_cred": 10})
  nagrody_json := zlecenie_def_row.nagrody;
  
  -- Apply rewards to character
  UPDATE postacie
  SET 
    kredyty = kredyty + COALESCE((nagrody_json->>'kredyty')::INTEGER, 0),
    street_cred = street_cred + COALESCE((nagrody_json->>'street_cred')::INTEGER, 0)
  WHERE id = postac_id_var
  RETURNING kredyty, street_cred INTO nowe_kredyty, nowy_street_cred;
  
  -- Delete the active mission (completed)
  DELETE FROM aktywne_zlecenia
  WHERE id = aktywne_zlecenie_row.id;
  
  -- Return updated stats
  RETURN json_build_object(
    'kredyty', nowe_kredyty,
    'street_cred', nowy_street_cred,
    'message', 'Nagroda odebrana!'
  );
END;
$$;

-- Recreate policy that was dropped with CASCADE
-- (if it doesn't exist already from previous migrations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'aktywne_zlecenia' 
    AND policyname = 'Gracz moze zarzadzac tylko swoim aktywnym zleceniem'
  ) THEN
    CREATE POLICY "Gracz moze zarzadzac tylko swoim aktywnym zleceniem"
      ON aktywne_zlecenia
      FOR ALL
      USING (postac_id = get_postac_id_for_auth_user());
  END IF;
END $$;
