# 🎮 RPG React Supabase

Cyberpunkowa gra RPG w przeglądarce z systemem misji, walki, rozwoju postaci i rankingów.

## ✨ Funkcjonalności

- 🔐 **Autoryzacja** - rejestracja i logowanie przez Supabase Auth
- 👤 **System postaci** - tworzenie i rozwój cyberpunkowych postaci  
- 🎯 **Misje** - system zleceń z nagrodami i czasem realizacji
- ⚔️ **Arena PvP** - walki między graczami
- 🏆 **Rankingi** - tabela najlepszych graczy
- 💰 **Ekonomia** - system waluty (nuyen) i doświadczenia
- 🎨 **Dark mode** - cyberpunkowy motyw z neonowymi kolorami

## 🚀 Technologie

- **Frontend:** React 18 + TypeScript + Vite 7
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Deploy:** Vercel
- **UI Components:** Radix UI primitives

## 📦 Instalacja

### 1. Sklonuj repozytorium:
```bash
git clone https://github.com/0GIN/rpg-react-supabase.git
cd rpg-react-supabase
```

### 2. Zainstaluj zależności:
```bash
npm install
```

### 3. Skonfiguruj zmienne środowiskowe:
Skopiuj `.env.example` do `.env.local`:
```bash
cp .env.example .env.local
```

Wypełnij w `.env.local`:
```env
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj_anon_key_tutaj
```

### 4. Uruchom projekt lokalnie:
```bash
npm run dev
```

Aplikacja będzie dostępna pod: `http://localhost:5173`

## 🗄️ Konfiguracja Supabase

### 1. Utwórz projekt na [supabase.com](https://supabase.com)

### 2. Uruchom migracje SQL (w kolejności):
Skopiuj zawartość plików z `supabase/migrations/` i wykonaj w Supabase SQL Editor:

- `20241028000001_enable_rls.sql` - włącza Row Level Security
- `20241029000001_sql_functions.sql` - funkcje SQL
- `20241029000002_security_improvements.sql` - poprawki bezpieczeństwa
- `20241029000003_update_odbierz_function.sql` - funkcja odbioru nagród
- `20241029000005_auto_cleanup_audit_logs.sql` - czyszczenie logów
- `20241029000006_add_unique_user_id.sql` - unikalne user_id
- `20241029000007_add_inventory_and_requirements.sql` - ekwipunek

### 3. Wdróż Edge Functions:
```bash
cd supabase/functions
supabase functions deploy rozpocznij-zlecenie
supabase functions deploy odbierz-nagrode
```

## 🎮 Jak grać?

1. **Zaloguj się** lub zarejestruj nowe konto
2. **Stwórz postać** - wybierz imię i klasę (dostosuj statystyki)
3. **Wykonuj misje** - klikaj "Rozpocznij" przy dostępnych zleceniach
4. **Zbieraj nagrody** - po zakończeniu misji odbieraj XP i nuyen
5. **Walcz w Arenie** - testuj swoją postać przeciwko innym graczom
6. **Rozwijaj umiejętności** - za XP podnoś statystyki postaci
7. **Wspinaj się po rankingu** - zdobywaj więcej wygranych walk!

## 🚀 Deployment na Vercel

### 1. Połącz repozytorium z Vercel
Wejdź na [vercel.com](https://vercel.com) i importuj projekt z GitHuba

### 2. Dodaj zmienne środowiskowe w Vercel:
W **Settings → Environment Variables** dodaj:
- `VITE_SUPABASE_URL` - twój Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` - twój Supabase anon/public key

### 3. Deploy!
Vercel automatycznie zbuduje i wdroży projekt przy każdym pushu na `main`.

## 📁 Struktura projektu

```
src/
├── components/          # Komponenty UI
│   ├── ui/             # shadcn/ui komponenty (Button, Card, etc.)
│   ├── sections/       # Sekcje gry (Arena, Misje, Rankingi)
│   ├── dashboard/      # Komponenty dashboard
│   └── layout/         # Layout (Navbar, Footer)
├── pages/              # Strony aplikacji
│   ├── Login.tsx       # Strona logowania
│   ├── Profile.tsx     # Tworzenie postaci
│   └── Dashboard.tsx   # Główny dashboard gry
├── services/           # Klient Supabase
├── types/              # TypeScript typy
└── hooks/              # Custom React hooks

supabase/
├── migrations/         # Migracje bazy danych SQL
└── functions/          # Supabase Edge Functions
    ├── rozpocznij-zlecenie/
    └── odbierz-nagrode/

public/                 # Statyczne assety (obrazy)
```

## 🛠️ Skrypty npm

```bash
npm run dev      # Uruchom dev server (localhost:5173)
npm run build    # Zbuduj projekt do produkcji
npm run lint     # Sprawdź kod ESLintem
npm run preview  # Podgląd builda produkcyjnego
```

## 🎨 Customizacja stylów

Style są w `src/index.css` z wykorzystaniem Tailwind CSS v4.  
Zmienne kolorów (cyberpunk theme) można edytować w `:root`.

## 🐛 Znane problemy

- CSS warnings w VSCode dla `@custom-variant`, `@theme`, `@apply` - to false positives dla Tailwind v4, można zignorować

## 🤝 Contributing

Pull requesty są mile widziane! Śmiało otwieraj Issues z sugestiami lub bugami.

## 📄 Licencja

MIT License - szczegóły w pliku LICENSE

---

**Stworzony z ❤️ używając React, TypeScript, Supabase i Tailwind CSS**
