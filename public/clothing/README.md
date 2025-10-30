# 👗 Struktura Folderów Garderoby

## 📁 Organizacja

```
clothing/
├── female/          ← Ubrania damskie
│   ├── body/        ← Typy ciała (athletic.png, slim.png, muscular.png)
│   ├── hair/        ← Fryzury (mohawk.png, ponytail.png, etc.)
│   ├── tops/        ← Góra (jacket.png, shirt.png, hoodie.png)
│   ├── bottoms/     ← Dół (pants.png, jeans.png, skirt.png)
│   ├── shoes/       ← Buty (boots.png, sneakers.png, heels.png)
│   ├── accessories/ ← Akcesoria (glasses.png, mask.png, visor.png)
│   └── implants/    ← Implanty (cyber-arm.png, eye-implant.png)
└── male/            ← Ubrania męskie
    ├── body/        ← Typy ciała męskie
    ├── hair/        ← Fryzury męskie
    ├── tops/        ← Góra męska
    ├── bottoms/     ← Dół męski
    ├── shoes/       ← Buty męskie
    ├── accessories/ ← Akcesoria męskie
    └── implants/    ← Implanty

```

## 🎨 Wymagania dla plików PNG

### Obowiązkowe:
- **Format**: PNG z przezroczystym tłem (alpha channel)
- **Rozmiar**: Dopasowany do manekina (zalecane: 512x1024px lub 1024x2048px)
- **Pozycjonowanie**: Ubranie musi dokładnie pasować do ciała manekina
- **Nazewnictwo**: małe litery, myślniki zamiast spacji
  - ✅ `cyber-jacket-red.png`
  - ✅ `tactical-pants-black.png`
  - ❌ `Cyber Jacket Red.PNG`

### Warstwy (zIndex):
0. **Bazowy manekin** (female_manekin.png / male_manekin.png) - zawsze widoczny
1. **Body** - typ ciała (opcjonalny overlay)
2. **Shoes** - buty
3. **Bottom** - spodnie/spódnica
4. **Top** - góra (koszula, kurtka)
5. **Accessory** - akcesoria (okulary, maska)
6. **Hair** - fryzura
7. **Implant** - widoczne implanty cybernetyczne

## 📝 Przykład ścieżek w bazie danych

```json
{
  "appearance": {
    "gender": "female",
    "bodyType": "/clothing/female/body/athletic.png"
  },
  "clothing": {
    "body": "/clothing/female/body/athletic.png",
    "hair": "/clothing/female/hair/mohawk-pink.png",
    "top": "/clothing/female/tops/cyber-jacket-red.png",
    "bottom": "/clothing/female/bottoms/tactical-pants-black.png",
    "shoes": "/clothing/female/shoes/combat-boots.png",
    "accessory": "/clothing/female/accessories/visor-red.png",
    "implant": "/clothing/female/implants/cyber-arm-left.png"
  }
}
```

## 🚀 Jak działa system

1. **React renderuje warstwy** (po stronie klienta - w przeglądarce)
2. **Baza przechowuje tylko ścieżki** (stringi, nie obrazki)
3. **Vercel serwuje PNG** (CDN, bardzo szybko)
4. **CSS position:absolute** nakłada warstwy

### Nie wymaga serwera! Wszystko działa w przeglądarce.

## 🎯 Tips

- Używaj tej samej palety kolorów dla spójności
- Zachowaj te same proporcje dla wszystkich ubrań
- Testuj nowe ubrania na obu manekinach
- Używaj opisowych nazw (kolor, typ, wariant)
