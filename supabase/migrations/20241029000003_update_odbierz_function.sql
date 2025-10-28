-- Update odbierz_ukonczone_zlecenie to include audit logging

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
  kredyty_reward INTEGER;
  street_cred_reward INTEGER;
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
  kredyty_reward := COALESCE((nagrody_json->>'kredyty')::INTEGER, 0);
  street_cred_reward := COALESCE((nagrody_json->>'street_cred')::INTEGER, 0);
  
  -- Apply rewards to character and increment missions_completed counter
  UPDATE postacie
  SET 
    kredyty = kredyty + kredyty_reward,
    street_cred = street_cred + street_cred_reward,
    missions_completed = missions_completed + 1
  WHERE id = postac_id_var
  RETURNING kredyty, street_cred INTO nowe_kredyty, nowy_street_cred;
  
  -- AUDIT LOG: Record completed mission
  INSERT INTO mission_completions (
    postac_id,
    zlecenie_id,
    kredyty_nagroda,
    street_cred_nagroda,
    completed_at
  ) VALUES (
    postac_id_var,
    aktywne_zlecenie_row.zlecenie_id,
    kredyty_reward,
    street_cred_reward,
    NOW()
  );
  
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
