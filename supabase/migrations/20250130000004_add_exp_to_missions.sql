-- Update odbierz_ukonczone_zlecenie to add experience and handle level ups

CREATE OR REPLACE FUNCTION odbierz_ukonczone_zlecenie()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  postac_id_var INTEGER;
  aktywne_zlecenie_row RECORD;
  zlecenie_def_row RECORD;
  postac_row RECORD;
  nagrody_json JSON;
  nowe_kredyty INTEGER;
  nowy_street_cred INTEGER;
  nowy_exp INTEGER;
  nowy_level INTEGER;
  nowe_stat_points INTEGER;
  kredyty_reward INTEGER;
  street_cred_reward INTEGER;
  exp_reward INTEGER;
  exp_for_next_level INTEGER;
  leveled_up BOOLEAN := FALSE;
  levels_gained INTEGER := 0;
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
  
  -- Get current character data
  SELECT * INTO postac_row
  FROM postacie
  WHERE id = postac_id_var;
  
  -- Parse rewards (expecting JSON like: {"kredyty": 100, "street_cred": 10, "experience": 500})
  nagrody_json := zlecenie_def_row.nagrody;
  kredyty_reward := COALESCE((nagrody_json->>'kredyty')::INTEGER, 0);
  street_cred_reward := COALESCE((nagrody_json->>'street_cred')::INTEGER, 0);
  exp_reward := COALESCE((nagrody_json->>'experience')::INTEGER, 0);
  
  -- Calculate new experience and check for level up
  nowy_exp := COALESCE(postac_row.experience, 0) + exp_reward;
  nowy_level := COALESCE(postac_row.level, 1);
  nowe_stat_points := COALESCE(postac_row.stat_points, 0);
  
  -- Level up loop (in case player gains multiple levels)
  LOOP
    -- Calculate experience needed for next level: 100 * level^1.5
    exp_for_next_level := FLOOR(100 * POWER(nowy_level, 1.5));
    
    -- Check if player has enough exp to level up
    IF nowy_exp >= exp_for_next_level THEN
      nowy_level := nowy_level + 1;
      leveled_up := TRUE;
      levels_gained := levels_gained + 1;
      -- Consume EXP required for this level-up so leftover carries toward next level
      nowy_exp := nowy_exp - exp_for_next_level;
      
      -- Award stat points based on level tier
      IF nowy_level <= 10 THEN
        nowe_stat_points := nowe_stat_points + 3;
      ELSIF nowy_level <= 25 THEN
        nowe_stat_points := nowe_stat_points + 4;
      ELSIF nowy_level <= 50 THEN
        nowe_stat_points := nowe_stat_points + 5;
      ELSIF nowy_level <= 100 THEN
        nowe_stat_points := nowe_stat_points + 6;
      ELSE
        nowe_stat_points := nowe_stat_points + 7;
      END IF;
    ELSE
      -- No more level ups
      EXIT;
    END IF;
  END LOOP;
  
  -- Apply rewards to character and increment missions_completed counter
  UPDATE postacie
  SET 
    kredyty = kredyty + kredyty_reward,
    street_cred = street_cred + street_cred_reward,
    experience = nowy_exp,
    level = nowy_level,
    stat_points = nowe_stat_points,
    missions_completed = missions_completed + 1
  WHERE id = postac_id_var
  RETURNING kredyty, street_cred, experience, level, stat_points 
  INTO nowe_kredyty, nowy_street_cred, nowy_exp, nowy_level, nowe_stat_points;
  
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
  
  -- Return updated stats with level up info
  RETURN json_build_object(
    'kredyty', nowe_kredyty,
    'street_cred', nowy_street_cred,
    'experience', nowy_exp,
    'level', nowy_level,
    'stat_points', nowe_stat_points,
    'leveled_up', leveled_up,
    'levels_gained', levels_gained,
    'exp_gained', exp_reward,
    'message', CASE 
      WHEN leveled_up THEN 'Nagroda odebrana! POZIOM ' || nowy_level || '!'
      ELSE 'Nagroda odebrana!'
    END
  );
END;
$$;
