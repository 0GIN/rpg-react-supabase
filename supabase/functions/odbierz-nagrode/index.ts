// /supabase/functions/odbierz-nagrode/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
// Używamy naszego skrótu "shared/" (tak jak robiliśmy "dobrze")
import { getCorsHeaders } from 'shared/cors.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
console.log('Gotowa do wydawania nagród!');
serve(async (req: Request)=>{
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Obsługa OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // 1. Sprawdź czy gracz wysłał token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Brak tokena autoryzacji!' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 2. Stwórz klienta Supabase, który działa jako GRACZ
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });
    // 2. ZAWOŁAJ "PRAWDZIWY MÓZG" (funkcję SQL)
    const { data, error } = await supabase.rpc('odbierz_ukonczone_zlecenie');
    if (error) {
      // Błędy SQL functions to błędy gracza (400), nie serwera (500)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    // 3. Opoślij sukces razem z nowymi statystykami
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    // Obsługa błędów
    const err = error as Error;
    return new Response(JSON.stringify({
      error: err.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
