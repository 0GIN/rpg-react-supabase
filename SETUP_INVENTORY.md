# 🚀 Instrukcja uruchomienia systemu itemów i ekwipunku

## ✅ Gotowe w kodzie:
- ItemsContext - ładuje itemy z bazy danych
- InventoryContext - ładuje ekwipunek z tabeli `ekwipunek`
- ItemEditorTab - panel admina do zarządzania itemami
- Edge Functions zaktualizowane do używania bazy danych

## 📋 Co musisz teraz zrobić:

### Krok 1: Uruchom migrację główną ⚡
1. Otwórz **Supabase Dashboard**: https://supabase.com/dashboard
2. Wybierz swój projekt
3. Idź do **SQL Editor** (ikona bazy danych w lewym menu)
4. Kliknij **New query**
5. Otwórz plik: `supabase/migrations/run_all_items_migrations.sql`
6. Skopiuj **całą zawartość** i wklej do SQL Editor
7. Kliknij **RUN** (lub Ctrl+Enter)

✅ To utworzy:
- Tabelę `items` z 20 przykładowymi itemami
- Tabelę `ekwipunek` dla Twojego inventory
- Wszystkie potrzebne indeksy i polityki bezpieczeństwa

### Krok 2: Dodaj przykładowe itemy do swojego ekwipunku 🎒

**Opcja A - Automatyczna (ZALECANE):**
1. W **SQL Editor** utwórz nowe zapytanie
2. Wklej ten kod:
```sql
DO $$
DECLARE
  char_id BIGINT;
BEGIN
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
    
    RAISE NOTICE 'Items added successfully!';
  ELSE
    RAISE NOTICE 'Character not found!';
  END IF;
END $$;
```
3. Kliknij **RUN**

**Opcja B - Manualna:**
1. Znajdź swoje ID postaci:
```sql
SELECT id, nazwa FROM postacie WHERE user_id = auth.uid();
```
2. Zanotuj `id` (np. 1)
3. Dodaj itemy (zamień `1` na swoje ID):
```sql
INSERT INTO public.ekwipunek (postac_id, item_id, ilosc, zalozony) VALUES
  (1, 'cyber_jacket_f', 1, false),
  (1, 'cyber_pants_f', 1, false),
  (1, 'combat_boots', 1, false),
  (1, 'pistol_9mm', 1, false),
  (1, 'medkit', 3, false),
  (1, 'energy_drink', 5, false);
```

### Krok 3: Dodaj siebie do admina (opcjonalne) 👑
```sql
INSERT INTO admin_users (user_id, is_admin, granted_by, granted_at)
VALUES (
  (SELECT user_id FROM postacie WHERE user_id = auth.uid() LIMIT 1),
  true,
  (SELECT user_id FROM postacie WHERE user_id = auth.uid() LIMIT 1),
  now()
)
ON CONFLICT (user_id) DO NOTHING;
```

### Krok 4: Odśwież aplikację 🔄
1. Wróć do aplikacji na http://localhost:5174
2. Naciśnij **F5** (odśwież stronę)
3. Otwórz panel ekwipunku

✅ **Powinieneś zobaczyć swoje itemy!**

## 🔍 Weryfikacja:

### Sprawdź tabelę items:
```sql
SELECT item_id, nazwa, typ, rzadkosc FROM items LIMIT 10;
```
Powinno zwrócić 20 itemów.

### Sprawdź swój ekwipunek:
```sql
SELECT e.*, i.nazwa 
FROM ekwipunek e
JOIN items i ON e.item_id = i.item_id
WHERE e.postac_id = (SELECT id FROM postacie WHERE user_id = auth.uid());
```

### Sprawdź console w przeglądarce (F12):
Szukaj logów:
- ✅ `Loaded inventory from ekwipunek table: X items`
- ✅ `Loaded items from database: 20 items`

## 🐛 Rozwiązywanie problemów:

**Problem: "Nie widzę itemów w ekwipunku"**
- Sprawdź czy migracja się wykonała: `SELECT COUNT(*) FROM items;` (powinno być 20)
- Sprawdź czy masz itemy: `SELECT * FROM ekwipunek WHERE postac_id = ...;`
- Sprawdź console (F12) czy są błędy

**Problem: "Permission denied for table ekwipunek"**
- Uruchom ponownie Krok 1 (migrację)
- Sprawdź RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'ekwipunek';`

**Problem: "Cannot read properties of undefined"**
- Wyloguj się i zaloguj ponownie
- Sprawdź czy Twoja postać istnieje: `SELECT * FROM postacie WHERE user_id = auth.uid();`

## 🎉 Gotowe!

Po wykonaniu tych kroków:
- ✅ ItemsContext ładuje z bazy danych
- ✅ InventoryContext ładuje z tabeli ekwipunek
- ✅ Admin panel ma Item Editor (zakładka Database)
- ✅ Edge Functions używają bazy danych
- ✅ Widzisz swoje itemy w ekwipunku!
