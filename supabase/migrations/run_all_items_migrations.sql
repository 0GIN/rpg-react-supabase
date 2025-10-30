-- ========================================
-- RUN ALL ITEMS AND INVENTORY MIGRATIONS
-- ========================================
-- Execute this in Supabase Dashboard → SQL Editor
-- This combines all 4 migrations in correct order

-- ========================================
-- 1. CREATE TABLES (20250130000011)
-- ========================================

-- Tabela przedmiotów w grze
CREATE TABLE IF NOT EXISTS public.items (
    id BIGSERIAL PRIMARY KEY,
    item_id TEXT NOT NULL UNIQUE,  -- ID z items.ts (np. 'cyber_jacket_f')
    nazwa TEXT NOT NULL,
    typ TEXT NOT NULL CHECK (typ IN ('weapon', 'clothing', 'cyberware', 'consumable', 'quest', 'misc')),
    rzadkosc TEXT NOT NULL CHECK (rzadkosc IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    opis TEXT,
    cena INTEGER DEFAULT 0,
    cena_sprzedazy INTEGER DEFAULT 0,
    wymagania JSONB DEFAULT '{}'::jsonb,
    staty JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela ekwipunku gracza
CREATE TABLE IF NOT EXISTS public.ekwipunek (
    id BIGSERIAL PRIMARY KEY,
    postac_id BIGINT NOT NULL REFERENCES public.postacie(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,  -- Odnosi się do items.item_id
    ilosc INTEGER NOT NULL DEFAULT 1 CHECK (ilosc > 0),
    zalozony BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Jeden gracz może mieć wiele tych samych itemów, ale każdy wpis jest unikalny
    UNIQUE(postac_id, item_id)
);

-- Indeksy dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_items_item_id ON public.items(item_id);
CREATE INDEX IF NOT EXISTS idx_items_typ ON public.items(typ);
CREATE INDEX IF NOT EXISTS idx_ekwipunek_postac_id ON public.ekwipunek(postac_id);
CREATE INDEX IF NOT EXISTS idx_ekwipunek_item_id ON public.ekwipunek(item_id);
CREATE INDEX IF NOT EXISTS idx_ekwipunek_zalozony ON public.ekwipunek(postac_id, zalozony) WHERE zalozony = TRUE;

-- RLS policies dla items (wszyscy mogą czytać)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view items" ON public.items;
CREATE POLICY "Anyone can view items"
    ON public.items
    FOR SELECT
    USING (TRUE);

-- RLS policies dla ekwipunek (tylko własny ekwipunek)
ALTER TABLE public.ekwipunek ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own inventory" ON public.ekwipunek;
CREATE POLICY "Users can view own inventory"
    ON public.ekwipunek
    FOR SELECT
    USING (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert into own inventory" ON public.ekwipunek;
CREATE POLICY "Users can insert into own inventory"
    ON public.ekwipunek
    FOR INSERT
    WITH CHECK (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update own inventory" ON public.ekwipunek;
CREATE POLICY "Users can update own inventory"
    ON public.ekwipunek
    FOR UPDATE
    USING (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete from own inventory" ON public.ekwipunek;
CREATE POLICY "Users can delete from own inventory"
    ON public.ekwipunek
    FOR DELETE
    USING (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

-- Policy for service_role (Edge Functions) to manage all inventory
DROP POLICY IF EXISTS "Service role can manage all inventory" ON public.ekwipunek;
CREATE POLICY "Service role can manage all inventory"
    ON public.ekwipunek
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Grant permissions
GRANT SELECT ON public.items TO authenticated;
GRANT SELECT ON public.items TO anon;
GRANT ALL ON public.ekwipunek TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE ekwipunek_id_seq TO authenticated;

-- Komentarze
COMMENT ON TABLE public.items IS 'Definicje wszystkich przedmiotów dostępnych w grze';
COMMENT ON TABLE public.ekwipunek IS 'Ekwipunek gracza - jakie przedmioty posiada i które są założone';
COMMENT ON COLUMN public.ekwipunek.zalozony IS 'TRUE jeśli item jest aktualnie założony/wyposażony';

-- ========================================
-- 2. EXTEND SCHEMA (20250130000012)
-- ========================================

-- Extend items table with fields needed by app/UI and server functions
ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS clothing_slot TEXT CHECK (clothing_slot IN ('top','bottom','shoes','accessory','implant')),
  ADD COLUMN IF NOT EXISTS clothing_path TEXT,
  ADD COLUMN IF NOT EXISTS image_path TEXT,
  ADD COLUMN IF NOT EXISTS stackable BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS max_stack INTEGER,
  ADD COLUMN IF NOT EXISTS required_level INTEGER,
  ADD COLUMN IF NOT EXISTS required_stats JSONB;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_items_clothing_slot ON public.items(clothing_slot) WHERE typ = 'clothing';

-- Comments for documentation
COMMENT ON COLUMN public.items.clothing_slot IS 'Slot for clothing items: top/bottom/shoes/accessory/implant';
COMMENT ON COLUMN public.items.clothing_path IS 'Overlay PNG path used by mannequin when equipped';
COMMENT ON COLUMN public.items.image_path IS 'Item icon/image used in inventory UI';
COMMENT ON COLUMN public.items.stackable IS 'If true, multiple items can stack in one slot';
COMMENT ON COLUMN public.items.max_stack IS 'Maximum stack size when stackable=true';
COMMENT ON COLUMN public.items.required_level IS 'Minimum character level required to equip/use';
COMMENT ON COLUMN public.items.required_stats IS 'JSON object of stat requirements, e.g. {"strength": 10}';

-- ========================================
-- 3. SEED ITEMS (20250130000010)
-- ========================================

-- Dodanie cyber_pants_f i innych itemów do tabeli items
INSERT INTO public.items (item_id, nazwa, typ, rzadkosc, opis, cena, cena_sprzedazy) VALUES
  ('cyber_pants_f', 'Cyber Pants', 'clothing', 'uncommon', 'Dżinsy wzmocnione kevlarową wyściółką.', 600, 250),
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

-- ========================================
-- 4. SEED VISUALS (20250130000013)
-- ========================================

-- Seed clothing visuals and icons for known items
UPDATE public.items SET clothing_slot='top', clothing_path='/clothing/female/tops/cyber_jacket_f.png', image_path='/clothing/female/tops/cyber_jacket_f.png' WHERE item_id='cyber_jacket_f';
UPDATE public.items SET clothing_slot='top', clothing_path='/clothing/female/tops/tactical_vest.png', image_path='/clothing/female/tops/tactical_vest.png' WHERE item_id='tactical_vest';
UPDATE public.items SET clothing_slot='bottom', clothing_path='/clothing/female/bottoms/cargo_pants.png', image_path='/clothing/female/bottoms/cargo_pants.png' WHERE item_id='cargo_pants';
UPDATE public.items SET clothing_slot='bottom', clothing_path='/clothing/female/bottoms/armored_jeans.png', image_path='/clothing/female/bottoms/armored_jeans.png' WHERE item_id='armored_jeans';
UPDATE public.items SET clothing_slot='bottom', clothing_path='/clothing/female/bottoms/cyber_pants_f.png', image_path='/clothing/female/bottoms/cyber_pants_f.png' WHERE item_id='cyber_pants_f';
UPDATE public.items SET clothing_slot='shoes', clothing_path='/clothing/female/shoes/combat_boots.png', image_path='/clothing/female/shoes/combat_boots.png' WHERE item_id='combat_boots';
UPDATE public.items SET clothing_slot='shoes', clothing_path='/clothing/female/shoes/stealth_sneakers.png', image_path='/clothing/female/shoes/stealth_sneakers.png' WHERE item_id='stealth_sneakers';
UPDATE public.items SET clothing_slot='accessory', clothing_path='/clothing/female/accessories/smart_glasses.png', image_path='/clothing/female/accessories/smart_glasses.png' WHERE item_id='smart_glasses';
UPDATE public.items SET clothing_slot='accessory', clothing_path='/clothing/female/accessories/neural_link.png', image_path='/clothing/female/accessories/neural_link.png' WHERE item_id='neural_link';
UPDATE public.items SET clothing_slot='implant', clothing_path='/clothing/female/implants/basic_cyberarm.png', image_path='/clothing/female/implants/basic_cyberarm.png' WHERE item_id='basic_cyberarm';
UPDATE public.items SET clothing_slot='implant', clothing_path='/clothing/female/implants/military_cyberarm.png', image_path='/clothing/female/implants/military_cyberarm.png' WHERE item_id='military_cyberarm';

-- Basic icons for non-clothing where available
UPDATE public.items SET image_path='/weapons/pistol_9mm.png' WHERE item_id='pistol_9mm' AND image_path IS NULL;
UPDATE public.items SET image_path='/weapons/plasma_rifle.png' WHERE item_id='plasma_rifle' AND image_path IS NULL;
UPDATE public.items SET image_path='/consumables/medkit.png' WHERE item_id='medkit' AND image_path IS NULL;
UPDATE public.items SET image_path='/consumables/energy_drink.png' WHERE item_id='energy_drink' AND image_path IS NULL;
UPDATE public.items SET image_path='/consumables/stimpack.png' WHERE item_id='stimpack' AND image_path IS NULL;

-- ========================================
-- DONE! ✅
-- ========================================
-- Tables created: items, ekwipunek
-- Items seeded: 20 items with full definitions
-- Visuals configured: clothing slots and image paths
