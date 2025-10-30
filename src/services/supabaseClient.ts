/**
 * supabaseClient.ts - Konfiguracja klienta Supabase
 * 
 * Inicjalizuje i eksportuje klienta Supabase do komunikacji z backendem.
 * Używa zmiennych środowiskowych VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.
 * Zawiera guard sprawdzający obecność wymaganych zmiennych środowiskowych.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Minimal runtime guard to help diagnose missing envs on Vercel
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// eslint-disable-next-line no-console
	console.error('[Supabase] Missing env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.\n' +
		'Go to Vercel → Project Settings → Environment Variables and add both. Then redeploy.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
