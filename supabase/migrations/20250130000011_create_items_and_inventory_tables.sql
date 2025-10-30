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

CREATE POLICY "Anyone can view items"
    ON public.items
    FOR SELECT
    USING (TRUE);

-- RLS policies dla ekwipunek (tylko własny ekwipunek)
ALTER TABLE public.ekwipunek ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inventory"
    ON public.ekwipunek
    FOR SELECT
    USING (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert into own inventory"
    ON public.ekwipunek
    FOR INSERT
    WITH CHECK (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own inventory"
    ON public.ekwipunek
    FOR UPDATE
    USING (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete from own inventory"
    ON public.ekwipunek
    FOR DELETE
    USING (
        postac_id IN (
            SELECT id FROM public.postacie WHERE user_id = auth.uid()
        )
    );

-- Grant permissions
GRANT SELECT ON public.items TO authenticated;
GRANT ALL ON public.ekwipunek TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE ekwipunek_id_seq TO authenticated;

-- Komentarze
COMMENT ON TABLE public.items IS 'Definicje wszystkich przedmiotów dostępnych w grze';
COMMENT ON TABLE public.ekwipunek IS 'Ekwipunek gracza - jakie przedmioty posiada i które są założone';
COMMENT ON COLUMN public.ekwipunek.zalozony IS 'TRUE jeśli item jest aktualnie założony/wyposażony';
