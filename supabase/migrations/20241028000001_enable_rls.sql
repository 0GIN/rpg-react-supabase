-- Enable Row Level Security na wszystkich tabelach
ALTER TABLE postacie ENABLE ROW LEVEL SECURITY;
ALTER TABLE zlecenia_definicje ENABLE ROW LEVEL SECURITY;
ALTER TABLE aktywne_zlecenia ENABLE ROW LEVEL SECURITY;

-- POLITYKI DLA TABELI: postacie
-- Gracz może czytać TYLKO swoją postać
CREATE POLICY "Gracze widzą tylko swoją postać"
  ON postacie FOR SELECT
  USING (auth.uid() = user_id);

-- Gracz może stworzyć TYLKO swoją postać (INSERT raz przy tworzeniu profilu)
CREATE POLICY "Gracze tworzą tylko swoją postać"
  ON postacie FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Gracz NIE MOŻE edytować swojej postaci przez frontend (tylko przez Edge Functions → SQL functions)
-- (Brak UPDATE policy = brak możliwości UPDATE przez frontend)

-- POLITYKI DLA TABELI: zlecenia_definicje
-- Wszyscy mogą czytać dostępne zlecenia (to są "templates")
CREATE POLICY "Wszyscy widzą dostępne zlecenia"
  ON zlecenia_definicje FOR SELECT
  USING (true);

-- Nikt nie może dodawać/edytować zleceń przez frontend (tylko admin przez SQL)
-- (Brak INSERT/UPDATE/DELETE policies)

-- POLITYKI DLA TABELI: aktywne_zlecenia
-- Gracz widzi TYLKO swoje aktywne zlecenia
CREATE POLICY "Gracze widzą tylko swoje aktywne zlecenia"
  ON aktywne_zlecenia FOR SELECT
  USING (
    postac_id IN (
      SELECT id FROM postacie WHERE user_id = auth.uid()
    )
  );

-- Gracz NIE MOŻE sam dodawać/usuwać aktywnych zleceń przez frontend
-- (tylko przez Edge Functions → SQL functions)
-- (Brak INSERT/DELETE policies)

-- WAŻNE: Edge Functions działają z prawami service_role (pomijają RLS),
-- więc mogą modyfikować dane przez SQL functions bez problemu!
