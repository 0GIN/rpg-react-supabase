-- Tabela administratorów
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT TRUE NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    
    -- Jeden użytkownik może mieć tylko jeden wpis
    UNIQUE(user_id)
);

-- Index dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_admin ON public.admin_users(is_admin) WHERE is_admin = TRUE;

-- RLS policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Wszyscy mogą sprawdzić czy ktoś jest adminem (potrzebne do UI)
CREATE POLICY "Anyone can check admin status"
    ON public.admin_users
    FOR SELECT
    USING (TRUE);

-- Tylko admini mogą dodawać nowych adminów
CREATE POLICY "Only admins can grant admin rights"
    ON public.admin_users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid() AND is_admin = TRUE
        )
    );

-- Tylko admini mogą odbierać uprawnienia
CREATE POLICY "Only admins can revoke admin rights"
    ON public.admin_users
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid() AND is_admin = TRUE
        )
    );

-- Funkcja pomocnicza do sprawdzania czy użytkownik jest adminem
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE user_id = COALESCE(check_user_id, auth.uid()) 
        AND is_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON public.admin_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Komentarze
COMMENT ON TABLE public.admin_users IS 'Lista administratorów gry';
COMMENT ON FUNCTION public.is_admin IS 'Sprawdza czy użytkownik ma uprawnienia admina';

-- WAŻNE: Dodaj pierwszego admina (zmień UUID na swój user_id!)
-- INSERT INTO public.admin_users (user_id, notes) 
-- VALUES ('TWOJ-USER-ID-TUTAJ', 'Initial admin account');
