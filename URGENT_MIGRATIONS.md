# 🚀 PILNE - Wykonaj te migracje w SQL Editor

## ✅ KROK 1: Zaktualizuj funkcję odbierania nagród (dodaje EXP)

Skopiuj i uruchom w SQL Editor:

📄 **Plik:** `supabase/migrations/20250130000004_add_exp_to_missions.sql`

---

## ✅ KROK 2: Dodaj nagrody EXP do istniejących misji

Skopiuj i uruchom w SQL Editor:

📄 **Plik:** `supabase/migrations/20250130000005_add_exp_rewards_to_missions.sql`

---

## 🧪 Po uruchomieniu tych migracji:

1. **Odśwież stronę gry** (F5)
2. **Spróbuj zwiększyć statystykę** - powinno działać bez błędu CORS
3. **Ukończ misję i kliknij "Odbierz"** - powinieneś dostać:
   - ✅ Kredyty
   - ✅ Street Cred  
   - ✅ **Experience (nowe!)**
   - ✅ Level up jeśli masz wystarczająco EXP

---

## 📊 Co zostało naprawione:

### Problem 1: CORS Error ❌ → ✅ FIXED
**Przyczyna:** Funkcje używały starych `corsHeaders` zamiast `getCorsHeaders()`  
**Rozwiązanie:** Zaktualizowano wszystkie 3 nowe funkcje:
- ✅ `increase-stat`
- ✅ `use-item`
- ✅ `equip-item`

### Problem 2: Brak EXP z misji ❌ → ✅ FIXED
**Przyczyna:** Funkcja `odbierz_ukonczone_zlecenie()` nie przyznawała experience  
**Rozwiązanie:**
- ✅ Zaktualizowano funkcję SQL aby dodawała EXP
- ✅ Dodano obsługę level-up (może być kilka poziomów naraz)
- ✅ Dodano przyznawanie stat points za level
- ✅ Dodano pole `experience` do nagród w definicjach misji

---

## 🎮 Jak będzie działać teraz:

### Zwiększanie statystyk:
```
Kliknij + przy statystyce → 
Edge Function sprawdza czy masz punkty → 
Zwiększa stat i zmniejsza punkty → 
✅ Alert: "STRENGTH zwiększone!"
```

### Odbieranie nagrody z misji:
```
Kliknij "Odbierz" →
Edge Function sprawdza czy misja ukończona →
SQL Function:
  1. Dodaje kredyty (+100)
  2. Dodaje street cred (+10)  
  3. Dodaje experience (+500)
  4. Sprawdza czy level up
  5. Jeśli TAK: zwiększa level + dodaje stat points
→ ✅ Alert: "Nagroda odebrana! POZIOM 6!" (jeśli level up)
```

---

## 🔍 Sprawdź czy działa:

### Test 1: Statystyki
```javascript
// W konsoli przeglądarki:
const result = await secureApi.increaseStat('strength')
console.log(result)
// Powinno zwrócić: { success: true, data: {...}, message: "..." }
```

### Test 2: Misja z EXP
```sql
-- W SQL Editor sprawdź nagrody:
SELECT nazwa, nagrody FROM zlecenia_definicje LIMIT 5;
-- Powinno pokazać: {"kredyty": 100, "street_cred": 10, "experience": 500}
```

### Test 3: Odbierz nagrodę
```
1. Rozpocznij misję
2. Poczekaj aż się skończy (lub zmień czas w bazie)
3. Kliknij "Odbierz"
4. Sprawdź czy dostałeś EXP i czy level się zwiększył
```

---

## ✅ Po wykonaniu migracji wszystko powinno działać!

Odśwież grę i przetestuj! 🎉
