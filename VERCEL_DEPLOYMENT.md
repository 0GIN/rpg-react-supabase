# 🚀 Deployment na Vercel (krok po kroku)

## 1. Commit i push do GitHub

```powershell
# W folderze projektu:
git add .
git commit -m "Add security features and prepare for production"
git push origin main
```

## 2. Połącz repo z Vercel

1. Zaloguj się na https://vercel.com
2. Kliknij **"Add New Project"**
3. **Import Git Repository** → wybierz swoje repo z GitHub
4. Vercel automatycznie wykryje Vite (framework: `vite`)

## 3. Skonfiguruj zmienne środowiskowe w Vercel

W **Project Settings → Environment Variables** dodaj:

```
VITE_SUPABASE_URL=https://npmlpyyhquabsfbpaics.supabase.co
VITE_SUPABASE_ANON_KEY=<twój_anon_key_z_panelu_supabase>
```

**Ważne:** Użyj wartości z Supabase Dashboard → Settings → API

## 4. Deploy!

- Kliknij **"Deploy"**
- Vercel zbuduje aplikację (trwa ~1-2 min)
- Po deployu dostaniesz URL: `https://twoj-projekt.vercel.app`

## 5. Ustaw CORS w Supabase Edge Functions

**BARDZO WAŻNE!** Bez tego funkcje nie będą działać w przeglądarce.

```powershell
# W PowerShell (w folderze projektu):
$env:SUPABASE_ACCESS_TOKEN="sbp_1fe5cd1509b6215c67cd44d0f8f3be2e9c43d94b"
.\tools\supabase.exe secrets set ALLOWED_ORIGIN=https://twoj-projekt.vercel.app
```

**Zastąp** `https://twoj-projekt.vercel.app` swoim rzeczywistym URL z Vercela.

## 6. Przetestuj produkcję

1. Otwórz `https://twoj-projekt.vercel.app`
2. Zaloguj się
3. Rozpocznij misję → dokończ → odbierz nagrodę
4. Sprawdź DevTools Console — nie powinno być błędów CORS

---

## 🔧 Troubleshooting

### Błąd: "CORS error" w production
- Sprawdź czy `ALLOWED_ORIGIN` jest ustawiony w Supabase secrets
- Wartość musi być **dokładnie** taka jak URL z Vercela (bez trailing slash `/`)
- Przykład OK: `https://moja-gra.vercel.app`
- Przykład ZŁY: `https://moja-gra.vercel.app/`

### Błąd: "Environment variables not defined"
- Upewnij się, że zmienne są w **Project Settings → Environment Variables**
- Zmienne muszą zaczynać się od `VITE_` (wymagane przez Vite)
- Po zmianie zmiennych: **Redeploy** (Vercel → Deployments → ... → Redeploy)

### Aplikacja pokazuje "białą stronę"
- Sprawdź Vercel logs: Deployments → [twój deploy] → Build Logs
- Upewnij się, że `package.json` ma `"type": "module"` (lub usuń to pole)
- Sprawdź czy `vercel.json` istnieje w repo

### Edge Functions nie działają
- Sprawdź czy funkcje są wdrożone: Supabase Dashboard → Edge Functions
- Sprawdź logi: Edge Functions → [nazwa funkcji] → Logs
- Zweryfikuj `ALLOWED_ORIGIN` (secrets)

---

## ✅ Po udanym deployu

1. Zmień `ALLOWED_ORIGIN` na URL z Vercela (instrukcja wyżej)
2. Przetestuj wszystkie funkcje (login, misje, nagrody)
3. Monitoruj logi w Supabase Dashboard (Edge Functions → Logs)
4. Opcjonalnie: Dodaj custom domenę w Vercel Settings

---

## 📊 Przyszłe deployy (CI/CD)

Po pierwszym deployu każdy `git push` do `main` automatycznie wdraża nową wersję.

**Preview deployments:** Każdy branch dostaje swój URL do testowania przed mergem.

---

## 🔒 Bezpieczeństwo (checklist)

- [x] `.env.local` jest w `.gitignore` ✅
- [x] `ALLOWED_ORIGIN` ustawiony w Supabase ✅
- [x] Zmienne środowiskowe w Vercel ✅
- [x] RLS włączone w bazie ✅
- [x] Rate limiting aktywny ✅
- [x] CSP header w HTML ✅

**Gotowe!** 🎉
