-- Dodanie cyber_pants_f do tabeli items
INSERT INTO public.items (
  item_id, 
  nazwa, 
  typ, 
  rzadkosc, 
  opis, 
  cena, 
  cena_sprzedazy
) VALUES (
  'cyber_pants_f',
  'Cyber Pants',
  'clothing',
  'uncommon',
  'Dżinsy wzmocnione kevlarową wyściółką.',
  600,
  250
)
ON CONFLICT (item_id) DO NOTHING;  -- Nie nadpisuj jeśli już istnieje

-- Opcjonalnie: możesz też dodać pozostałe itemy które mogą brakować
INSERT INTO public.items (item_id, nazwa, typ, rzadkosc, opis, cena, cena_sprzedazy) VALUES
  ('cyber_jacket_f', 'Cyber Jacket', 'clothing', 'uncommon', 'Stylowa kurtka z wbudowanymi portami cybernetycznymi.', 500, 200),
  ('tactical_vest', 'Tactical Vest', 'clothing', 'rare', 'Wzmocniona kamizelka taktyczna z kieszeniami na amunicję.', 1200, 500),
  ('cargo_pants', 'Cargo Pants', 'clothing', 'common', 'Wygodne spodnie cargo z wieloma kieszeniami.', 300, 100),
  ('armored_jeans', 'Armored Jeans', 'clothing', 'rare', 'Jeansy z wbudowaną pancerną wyściółką.', 800, 350),
  ('combat_boots', 'Combat Boots', 'clothing', 'common', 'Wytrzymałe buty bojowe.', 250, 80),
  ('stealth_sneakers', 'Stealth Sneakers', 'clothing', 'uncommon', 'Buty z technologią wyciszania kroków.', 450, 180),
  ('smart_glasses', 'Smart Glasses', 'cyberware', 'uncommon', 'Okulary z wyświetlaczem AR i analizą danych.', 800, 300),
  ('neural_link', 'Neural Link', 'cyberware', 'rare', 'Implant do bezpośredniego połączenia z siecią.', 2000, 800),
  ('basic_cyberarm', 'Basic Cyberarm', 'cyberware', 'uncommon', 'Podstawowa proteza ręki z wbudowanymi narzędziami.', 1500, 600),
  ('military_cyberarm', 'Military Cyberarm', 'cyberware', 'epic', 'Zaawansowana proteza wojskowa ze wzmocnioną siłą.', 5000, 2000),
  ('pistol_9mm', 'Pistolet 9mm', 'weapon', 'common', 'Standardowy pistolet służbowy.', 500, 200),
  ('plasma_rifle', 'Plasma Rifle', 'weapon', 'epic', 'Zaawansowany karabin plazmowy.', 3500, 1400),
  ('medkit', 'Medkit', 'consumable', 'common', 'Przenośny zestaw medyczny.', 150, 50),
  ('energy_drink', 'Energy Drink', 'consumable', 'common', 'Napój energetyczny przywracający energię.', 50, 10),
  ('stimpack', 'Stimpack', 'consumable', 'uncommon', 'Zaawansowany stymulator regeneracyjny.', 200, 80),
  ('scrap_metal', 'Złom Metalowy', 'misc', 'common', 'Fragmenty metalu nadające się do recyklingu.', 20, 5),
  ('electronics', 'Elektronika', 'misc', 'uncommon', 'Części elektroniczne.', 50, 15),
  ('rare_crystal', 'Rzadki Kryształ', 'misc', 'rare', 'Tajemniczy kryształ o niezwykłych właściwościach.', 500, 200),
  ('data_chip', 'Chip Danych', 'quest', 'uncommon', 'Chip zawierający zaszyfrowane informacje.', 0, 0)
ON CONFLICT (item_id) DO NOTHING;

-- Komentarz
COMMENT ON TABLE public.items IS 'Wszystkie przedmioty dostępne w grze - zsynchronizowane z src/data/items.ts';
