# 🔧 ADMIN PANEL - DEBUGGING GUIDE

Panel admina nie działa? Oto krok po kroku jak naprawić:

## ⚠️ Najczęstsze problemy:

### 1. **NIE JESTEŚ ADMINEM W BAZIE**

**Objawy:**
- Błąd 403 Forbidden
- Toast "Forbidden: Admin access required"
- W konsoli: błąd o braku dostępu

**Rozwiązanie:**

1. Otwórz Supabase Dashboard → SQL Editor
2. Uruchom:
```sql
-- Sprawdź swoje user_id
SELECT id, email FROM auth.users WHERE email = 'twoj@email.com';

-- Dodaj siebie jako admina (zamień 'YOUR_USER_ID' na swoje ID z poprzedniego query)
INSERT INTO admin_users (user_id, is_admin) 
VALUES ('YOUR_USER_ID_tutaj', true)
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;

-- Sprawdź czy jesteś adminem
SELECT * FROM admin_users;
```

---

### 2. **BŁĄD CORS**

**Objawy:**
- W konsoli: CORS policy error
- Request Failed
- Network error

**Rozwiązanie:**
- Funkcje są już skonfigurowane z CORS dla localhost i Vercel
- Sprawdź czy uruchamiasz z `localhost` lub `127.0.0.1`
- Sprawdź w Network tab czy request w ogóle wychodzi

---

### 3. **NIEPRAWIDŁOWY NICK GRACZA**

**Objawy:**
- Toast: "Character with nick not found"
- 404 Not Found

**Rozwiązanie:**
```sql
-- Sprawdź istniejące nicki w bazie
SELECT id, nick, kredyty, experience, street_cred FROM postacie LIMIT 10;

-- Użyj dokładnego nicka z bazy (wielkość liter nie ma znaczenia)
```

---

### 4. **FUNKCJE NIE WDROŻONE**

**Objawy:**
- 404 Not Found
- "Function not found"

**Rozwiązanie:**
```powershell
# Sprawdź listę funkcji
npx supabase functions list

# Jeśli brakuje funkcji, wdróż je:
npx supabase functions deploy admin-add-item --no-verify-jwt
npx supabase functions deploy admin-give-credits --no-verify-jwt
npx supabase functions deploy admin-give-exp --no-verify-jwt
npx supabase functions deploy admin-give-street-cred --no-verify-jwt
```

---

## 🧪 TEST KROK PO KROKU

### Krok 1: Sprawdź czy jesteś zalogowany

1. Otwórz aplikację w przeglądarce
2. Naciśnij F12 (Developer Tools)
3. W konsoli uruchom:
```javascript
const { data: { user } } = await window.supabase.auth.getUser()
console.log('User ID:', user?.id)
console.log('User email:', user?.email)
```

4. Zapisz sobie `user.id` - będziesz go potrzebować

---

### Krok 2: Dodaj siebie jako admina

1. Otwórz Supabase Dashboard
2. Idź do SQL Editor
3. Uruchom (zamień `YOUR_USER_ID` na ID z poprzedniego kroku):
```sql
INSERT INTO admin_users (user_id, is_admin) 
VALUES ('YOUR_USER_ID', true)
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
```

4. Sprawdź:
```sql
SELECT * FROM admin_users;
```

---

### Krok 3: Sprawdź dostępne nicki

```sql
SELECT id, nick, kredyty, experience, level, street_cred 
FROM postacie 
ORDER BY created_at DESC
LIMIT 10;
```

Zapisz sobie jakiś nick do testów.

---

### Krok 4: Przetestuj panel admina

1. Odśwież stronę aplikacji (F5)
2. Otwórz panel admina (klawisz `~` lub przycisk w UI)
3. Wpisz nick z kroku 3
4. Wybierz item / wpisz wartość
5. Kliknij przycisk
6. Sprawdź konsolę (F12) - powinny być logi:
   - ✅ Success: ... (jeśli działa)
   - ❌ Failed: ... (jeśli nie działa - zobacz szczegóły)

---

### Krok 5: Sprawdź logi w konsoli

Po kliknięciu przycisku w panelu admina, w konsoli powinny pojawić się logi:

**Sukces:**
```
✅ Admin add item success: {success: true, message: "..."}
```

**Błąd:**
```
❌ Admin add item failed: {status: 403, error: "Forbidden", ...}
```

---

## 🔍 DIAGNOSTYKA SQL

Uruchom ten plik w Supabase SQL Editor:
`supabase/ADMIN_DIAGNOSTIC.sql`

To sprawdzi:
- Czy tabele istnieją
- Czy jesteś w admin_users
- Ile jest itemów
- Czy audit_log działa
- RLS policies

---

## 📋 CHECKLIST

Przed zgłoszeniem błędu, sprawdź:

- [ ] Jestem zalogowany (mam `user.id`)
- [ ] Jestem w tabeli `admin_users` z `is_admin = true`
- [ ] Edge Functions są wdrożone (`npx supabase functions list`)
- [ ] Nick gracza istnieje w bazie (`SELECT * FROM postacie WHERE nick ILIKE '%partial_nick%'`)
- [ ] Otwieram panel admina w przeglądarce (nie w aplikacji desktopowej)
- [ ] Sprawdziłem konsolę (F12) i widzę dokładny błąd
- [ ] Nie mam błędów CORS w konsoli

---

## 💡 SZYBKI FIX

Jeśli wszystko inne zawodzi, spróbuj:

1. **Wyloguj się i zaloguj ponownie**
2. **Wyczyść cache przeglądarki** (Ctrl+Shift+Delete)
3. **Sprawdź czy używasz najnowszej wersji** (git pull)
4. **Sprawdź czy build się powiódł** (npm run build)
5. **Sprawdź .env.local** - czy masz `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`

---

## 🆘 DALEJ NIE DZIAŁA?

Jeśli wykonałeś wszystkie kroki powyżej i dalej nie działa:

1. Otwórz konsolę przeglądarki (F12)
2. Kliknij przycisk w panelu admina
3. Skopiuj **CAŁY** błąd z konsoli
4. Sprawdź zakładkę **Network** - znajdź request do funkcji
5. Kliknij na niego i skopiuj **Response** i **Headers**
6. Wyślij to wszystko jako zgłoszenie błędu

Będzie mi wtedy łatwiej pomóc! 🚀
