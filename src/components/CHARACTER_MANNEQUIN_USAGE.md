# CharacterMannequin - Przykłady użycia

## 🎯 Cel komponentu

`CharacterMannequin` to komponent odpowiedzialny za **generowanie całej postaci**:
- Bazowy manekin (female/male)
- Nakładanie warstw ubrań w odpowiedniej kolejności
- Obsługa danych z bazy (appearance + clothing)

## 📦 API Komponentu

```typescript
interface CharacterMannequinProps {
  appearance?: CharacterAppearance | null  // { gender, bodyType, skinTone }
  clothing?: EquippedClothing | null       // { body, hair, top, bottom, shoes, accessory, implant }
  className?: string                       // CSS classes dla stylowania
}
```

## 💡 Przykłady użycia

### 1. Dashboard (strona główna)

```tsx
// src/components/character-panel.tsx
<CharacterMannequin 
  appearance={postac.appearance}  // z bazy danych
  clothing={postac.clothing}      // z bazy danych
  className="w-auto h-full"
/>
```

### 2. Profile (tworzenie postaci)

```tsx
// src/pages/Profile.tsx
<CharacterMannequin 
  appearance={{ gender: 'female', bodyType: 'athletic' }}
  clothing={{}}  // pusty - tylko manekin
  className="w-auto h-full"
/>
```

### 3. Wardrobe (garderoba - preview)

```tsx
// Przyszły komponent src/components/wardrobe.tsx
<CharacterMannequin 
  appearance={postac.appearance}
  clothing={previewClothing}  // tymczasowy outfit do podglądu
  className="w-auto h-64"
/>
```

### 4. Ranking (lista graczy)

```tsx
// src/components/ranking-list.tsx
{players.map(player => (
  <div key={player.id} className="flex items-center gap-4">
    <div className="w-16 h-16">
      <CharacterMannequin 
        appearance={player.appearance}
        clothing={player.clothing}
        className="w-full h-full"
      />
    </div>
    <span>{player.nick}</span>
  </div>
))}
```

### 5. Arena (versus screen)

```tsx
// src/components/arena-battle.tsx
<div className="flex gap-8">
  {/* Twoja postać */}
  <CharacterMannequin 
    appearance={myCharacter.appearance}
    clothing={myCharacter.clothing}
    className="w-48 h-48"
  />
  
  <span>VS</span>
  
  {/* Przeciwnik */}
  <CharacterMannequin 
    appearance={opponent.appearance}
    clothing={opponent.clothing}
    className="w-48 h-48"
  />
</div>
```

## 🔧 Jak działa wewnątrz

```tsx
// 1. Pobiera gender z appearance
const gender = appearance?.gender || 'female'

// 2. Wybiera bazowy manekin
const baseMannequin = gender === 'female' 
  ? '/female_manekin.png' 
  : '/male_manekin.png'

// 3. Konwertuje clothing na warstwy z zIndex
const clothingLayers = Object.entries(clothing).map(([type, path]) => ({
  id: type,
  type: type,
  imagePath: path,
  zIndex: zIndexMap[type]  // body:1, shoes:2, bottom:3, top:4, accessory:5, hair:6, implant:7
}))

// 4. Renderuje warstwy (sortowane po zIndex)
<div>
  <img src={baseMannequin} />  {/* warstwa 0 */}
  <img src="/clothing/female/shoes/boots.png" style={{zIndex: 2}} />
  <img src="/clothing/female/bottoms/pants.png" style={{zIndex: 3}} />
  <img src="/clothing/female/tops/jacket.png" style={{zIndex: 4}} />
  <img src="/clothing/female/hair/mohawk.png" style={{zIndex: 6}} />
</div>
```

## ✅ Zalety tego podejścia

1. **Reużywalny** - jeden komponent, wiele miejsc
2. **Czysty** - logika w jednym miejscu
3. **Prosty API** - tylko appearance + clothing
4. **Uniwersalny** - działa z danymi z bazy lub mockupami
5. **Wydajny** - React cache'uje renderowanie

## 📝 Zasady

- **CharacterMannequin** = generowanie postaci (logika warstw)
- **CharacterPanel** = panel na dashboardzie (tylko UI)
- **Profile** = tworzenie postaci (wybór płci)
- **Wardrobe** = garderoba (preview + zmiana ubrań)
