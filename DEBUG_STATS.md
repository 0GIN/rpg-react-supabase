# 🔧 DEBUG - Sprawdź zmienne środowiskowe Edge Functions

## Problem: "Failed to update character"

### Możliwe przyczyny:

1. **Brak zmiennych środowiskowych** w Edge Functions
2. **RLS blokuje UPDATE** (chociaż service_role powinien omijać)
3. **Nieprawidłowy format danych** (stats jako JSONB)

---

## ✅ KROK 1: Sprawdź zmienne środowiskowe

Otwórz: **Supabase Dashboard → Settings → Edge Functions → Manage environment variables**

Upewnij się że są ustawione:
- ✅ `SUPABASE_URL` = `https://npmlpyyhquabsfbpaics.supabase.co`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` = twój service role key (z Settings → API)

**WAŻNE:** Po dodaniu zmiennych środowiskowych musisz **redeploy funkcje**:
```powershell
npx supabase functions deploy increase-stat
```

---

## ✅ KROK 2: Sprawdź RLS w SQL Editor

```sql
-- Sprawdź czy RLS jest włączone
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'postacie';

-- Sprawdź polityki
SELECT * FROM pg_policies WHERE tablename = 'postacie';
```

---

## ✅ KROK 3: Test bezpośrednio w SQL Editor

Spróbuj zaktualizować statystyki bezpośrednio (jako service_role):

```sql
-- Znajdź swoją postać
SELECT id, user_id, stats, stat_points FROM postacie LIMIT 1;

-- Spróbuj zaktualizować (zamień ID)
UPDATE postacie 
SET 
  stats = jsonb_set(stats::jsonb, '{strength}', '10'::jsonb),
  stat_points = stat_points - 1
WHERE id = 1; -- ZAMIEŃ NA SWOJE ID

-- Sprawdź czy się udało
SELECT stats, stat_points FROM postacie WHERE id = 1;
```

Jeśli UPDATE działa w SQL Editor, ale nie w Edge Function - problem jest w zmiennych środowiskowych.

---

## ✅ KROK 4: Zobacz logi Edge Function

1. **Supabase Dashboard → Edge Functions → increase-stat**
2. Kliknij **Logs**
3. Spróbuj zwiększyć statystykę w grze
4. Zobacz dokładny błąd w logach

---

## 🔄 Tymczasowe obejście (jeśli nadal nie działa)

Możesz tymczasowo użyć starej metody (UPDATE bezpośrednio z klienta), ale to NIEBEZPIECZNE:

```typescript
// W DashboardNew.tsx - TYLKO DO TESTÓW!
async function handleStatIncrease(stat: keyof CharacterStats) {
  if (!postac || !postac.stat_points || postac.stat_points <= 0) return

  const currentStats = postac.stats || { strength: 1, intelligence: 1, endurance: 1, agility: 1, charisma: 1, luck: 1 }
  const updatedStats = { ...currentStats, [stat]: (currentStats[stat] || 1) + 1 }

  const { data, error } = await supabase
    .from('postacie')
    .update({
      stats: updatedStats,
      stat_points: postac.stat_points - 1,
    })
    .eq('id', postac.id)
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Error:', error)
    alert('❌ Błąd: ' + error.message)
  } else if (data) {
    setPostac(data)
    alert(`✅ ${stat.toUpperCase()} zwiększone!`)
  }
}
```

**UWAGA:** To obejście działa, ale każdy może oszukiwać! Użyj TYLKO do testów.

---

## 📝 Najprawdopodobniejsze rozwiązanie

Problem jest w **braku zmiennych środowiskowych**. 

**Zrób to:**
1. Dodaj zmienne w Dashboard → Settings → Edge Functions
2. Redeploy funkcję: `npx supabase functions deploy increase-stat`
3. Odśwież grę i spróbuj ponownie

---

## 🆘 Jeśli dalej nie działa

Pokaż mi:
1. Logi z Edge Function (Dashboard → Functions → increase-stat → Logs)
2. Błąd z konsoli przeglądarki (pełny message)
3. Czy w Settings → API widzisz `service_role` key?
