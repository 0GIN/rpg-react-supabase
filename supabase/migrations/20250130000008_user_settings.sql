-- Tabela ustawień użytkownika
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Audio settings
    sound_volume INTEGER DEFAULT 70 CHECK (sound_volume >= 0 AND sound_volume <= 100),
    music_volume INTEGER DEFAULT 50 CHECK (music_volume >= 0 AND music_volume <= 100),
    
    -- Notification settings
    notifications_missions BOOLEAN DEFAULT TRUE,
    notifications_levelup BOOLEAN DEFAULT TRUE,
    notifications_trades BOOLEAN DEFAULT TRUE,
    
    -- Graphics settings
    graphics_animations BOOLEAN DEFAULT TRUE,
    graphics_effects BOOLEAN DEFAULT TRUE,
    graphics_quality TEXT DEFAULT 'high' CHECK (graphics_quality IN ('low', 'medium', 'high', 'ultra')),
    
    -- Theme
    theme TEXT DEFAULT 'cyberpunk' CHECK (theme IN ('cyberpunk', 'neon', 'matrix', 'midnight')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Jeden użytkownik może mieć tylko jeden zestaw ustawień
    UNIQUE(user_id)
);

-- Index dla szybkiego wyszukiwania po user_id
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- RLS policies
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Użytkownik może tylko czytać swoje ustawienia
CREATE POLICY "Users can view own settings"
    ON public.user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Użytkownik może tylko wstawiać swoje ustawienia
CREATE POLICY "Users can insert own settings"
    ON public.user_settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Użytkownik może tylko aktualizować swoje ustawienia
CREATE POLICY "Users can update own settings"
    ON public.user_settings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Trigger do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_settings_updated_at();

-- Funkcja do upsert ustawień (insert or update)
CREATE OR REPLACE FUNCTION public.upsert_user_settings(
    p_user_id UUID,
    p_sound_volume INTEGER DEFAULT NULL,
    p_music_volume INTEGER DEFAULT NULL,
    p_notifications_missions BOOLEAN DEFAULT NULL,
    p_notifications_levelup BOOLEAN DEFAULT NULL,
    p_notifications_trades BOOLEAN DEFAULT NULL,
    p_graphics_animations BOOLEAN DEFAULT NULL,
    p_graphics_effects BOOLEAN DEFAULT NULL,
    p_graphics_quality TEXT DEFAULT NULL,
    p_theme TEXT DEFAULT NULL
)
RETURNS SETOF public.user_settings AS $$
BEGIN
    -- Sprawdź czy użytkownik aktualizuje swoje własne ustawienia
    IF auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized: Cannot modify other users settings';
    END IF;

    -- Insert lub update ustawień
    RETURN QUERY
    INSERT INTO public.user_settings (
        user_id,
        sound_volume,
        music_volume,
        notifications_missions,
        notifications_levelup,
        notifications_trades,
        graphics_animations,
        graphics_effects,
        graphics_quality,
        theme
    ) VALUES (
        p_user_id,
        COALESCE(p_sound_volume, 70),
        COALESCE(p_music_volume, 50),
        COALESCE(p_notifications_missions, TRUE),
        COALESCE(p_notifications_levelup, TRUE),
        COALESCE(p_notifications_trades, TRUE),
        COALESCE(p_graphics_animations, TRUE),
        COALESCE(p_graphics_effects, TRUE),
        COALESCE(p_graphics_quality, 'high'),
        COALESCE(p_theme, 'cyberpunk')
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        sound_volume = COALESCE(p_sound_volume, user_settings.sound_volume),
        music_volume = COALESCE(p_music_volume, user_settings.music_volume),
        notifications_missions = COALESCE(p_notifications_missions, user_settings.notifications_missions),
        notifications_levelup = COALESCE(p_notifications_levelup, user_settings.notifications_levelup),
        notifications_trades = COALESCE(p_notifications_trades, user_settings.notifications_trades),
        graphics_animations = COALESCE(p_graphics_animations, user_settings.graphics_animations),
        graphics_effects = COALESCE(p_graphics_effects, user_settings.graphics_effects),
        graphics_quality = COALESCE(p_graphics_quality, user_settings.graphics_quality),
        theme = COALESCE(p_theme, user_settings.theme),
        updated_at = NOW()
    RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.user_settings TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_user_settings TO authenticated;

-- Komentarze
COMMENT ON TABLE public.user_settings IS 'Przechowuje ustawienia użytkownika (audio, grafika, powiadomienia, motyw)';
COMMENT ON FUNCTION public.upsert_user_settings IS 'Funkcja do zapisywania ustawień użytkownika (insert lub update)';
