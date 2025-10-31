/**
 * Migration: Add gender field to appearance
 * 
 * Dodaje domyślną wartość 'female' do appearance.gender dla wszystkich postaci
 * które jeszcze nie mają tego pola. Umożliwia to system gender-aware clothing paths.
 */

-- Aktualizuj wszystkie istniejące postacie, które nie mają gender w appearance
UPDATE postacie
SET appearance = COALESCE(appearance, '{}'::jsonb) || '{"gender": "female"}'::jsonb
WHERE appearance IS NULL 
   OR NOT (appearance ? 'gender');

-- Dodaj komentarz do kolumny appearance
COMMENT ON COLUMN postacie.appearance IS 'Character appearance data including gender (male/female), body type, hair, etc.';

-- Wyświetl podsumowanie
DO $$
DECLARE
  total_characters INTEGER;
  characters_with_gender INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_characters FROM postacie;
  SELECT COUNT(*) INTO characters_with_gender FROM postacie WHERE appearance ? 'gender';
  
  RAISE NOTICE '✅ Migration complete:';
  RAISE NOTICE '   Total characters: %', total_characters;
  RAISE NOTICE '   Characters with gender field: %', characters_with_gender;
END $$;
