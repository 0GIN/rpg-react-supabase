# Kreator Postaci - Character Creator

## Przegląd

Ulepszony ekran tworzenia postaci (`src/pages/Profile.tsx`) po pierwszej rejestracji w grze. Użytkownik przechodzi przez następujące kroki:

1. **Wpisanie nicku** (max 20 znaków)
2. **Wybór płci** (Kobieta / Mężczyzna)
3. **Wybór postury** (body type 1-5 dla kobiet, 1 dla mężczyzn)
4. **Wybór fryzury** (hair type, obecnie 1 dla każdej płci)

## Funkcjonalność

### Live Preview
- Podgląd postaci w czasie rzeczywistym
- Wykorzystuje komponent `CharacterMannequin`
- Pokazuje wybrane body + hair na bazowym manekinie

### Gender-Aware Paths
Ścieżki do grafik są generowane automatycznie:
```typescript
body: `/clothing/${selectedGender}/body/${selectedGender}_body_${selectedBody}.png`
hair: `/clothing/${selectedGender}/hair/${selectedGender}_hair_${selectedHair}.png`
```

### Zapisywanie w bazie
Po kliknięciu "Stwórz Postać" zostaje utworzony rekord w tabeli `postacie`:
```typescript
{
  nick: string,
  user_id: UUID,
  appearance: {
    gender: 'male' | 'female',
    body: string,    // ścieżka do PNG
    hair: string,    // ścieżka do PNG
    skinTone: string
  },
  clothing: {},       // puste na start
  inventory: [...],   // starter items
  stats: {...},       // początkowe statystyki
  level: 1,
  experience: 0,
  stat_points: 5
}
```

## Struktura plików graficznych

### Female
```
/public/clothing/female/
├── body/
│   ├── female_body_01.png
│   ├── female_body_02.png
│   ├── female_body_03.png
│   ├── female_body_04.png
│   └── female_body_05.png
└── hair/
    └── female_hair_01.png
```

### Male
```
/public/clothing/male/
├── body/
│   └── male_body_01.png
└── hair/
    └── male_hair_01.png
```

## Dodawanie nowych opcji

### Aby dodać nowy body type:
1. Dodaj plik PNG do `/public/clothing/{gender}/body/`
2. Nazwij zgodnie z konwencją: `{gender}_body_{ID}.png` (np. `female_body_06.png`)
3. Zaktualizuj `availableBodies` w `Profile.tsx`:
```typescript
const availableBodies = selectedGender === 'female' ? [1, 2, 3, 4, 5, 6] : [1, 2]
```

### Aby dodać nowy hair type:
1. Dodaj plik PNG do `/public/clothing/{gender}/hair/`
2. Nazwij zgodnie z konwencją: `{gender}_hair_{ID}.png` (np. `female_hair_02.png`)
3. Zaktualizuj `availableHairs`:
```typescript
const availableHairs = selectedGender === 'female' ? [1, 2, 3] : [1, 2]
```

## Uwagi techniczne

- **Resetowanie wyboru**: Zmiana płci resetuje wybór body i hair do 1
- **Walidacja**: Przycisk "Stwórz Postać" jest nieaktywny gdy nick jest pusty
- **Edge Function integration**: Po utworzeniu postaci, system automatycznie używa Edge Function `get-items` do pobierania itemów z odpowiednimi ścieżkami (male/female)
- **Maksymalna długość nicku**: 20 znaków (enforced przez maxLength)

## Flow użytkownika

```
Rejestracja (Login.tsx)
    ↓
Sprawdzenie profilu (App.tsx)
    ↓
Brak profilu → Profile.tsx (Kreator Postaci)
    ↓
Wypełnienie danych + Stwórz Postać
    ↓
Zapisanie w bazie danych (postacie)
    ↓
Przekierowanie do DashboardNew.tsx
```

## Starter Items

Nowa postać otrzymuje na start:
- 3x Medkit
- 5x Energy Drink
- 1x Pistol 9mm
- 1x Combat Boots
- 1x Cargo Pants

## Starter Stats

Wszystkie staty zaczynają od 1, gracz dostaje 5 wolnych punktów do rozdysponowania:
```typescript
{
  strength: 1,
  intelligence: 1,
  endurance: 1,
  agility: 1,
  charisma: 1,
  luck: 1
}
stat_points: 5
```
