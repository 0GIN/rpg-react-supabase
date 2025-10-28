// /supabase/functions/rozpocznij-zlecenie/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { corsHeaders } from '../_shared/cors.ts';
console.log('Gotowa do przyjmowania zleceń!');
serve(async (req: Request)=>{
  // To jest potrzebne, żeby przeglądarka mogła gadać z naszą funkcją
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // 1. Pobieramy dane, które wysłał gracz (czyli ID zlecenia, które chce zacząć)
    const { zlecenie_id } = await req.json();
    if (!zlecenie_id) {
      throw new Error('Nie podałeś ID zlecenia (zlecenie_id).');
    }
    // 2. Tworzymy klienta Supabase, który działa jako TEN KONKRETNY GRACZ
    // To jest super-bezpieczne. Działa w imieniu gracza, który wysłał prośbę.
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    // 3. Pobieramy ID postaci (z tabeli 'postacie') na podstawie ID gracza (z 'auth')
    // Używamy funkcji, którą stworzyliśmy w SQL!
    const { data: postacIdData, error: postacIdError } = await supabase.rpc('get_postac_id_for_auth_user');
    if (postacIdError) throw postacIdError;
    const postac_id = postacIdData;
    if (!postac_id) {
      throw new Error('Nie udało się znaleźć Twojej postaci.');
    }
    
    // 3a. RATE LIMITING: Check if player started a mission too recently (cooldown)
    const { data: postacData, error: postacError } = await supabase
      .from('postacie')
      .select('last_mission_started_at')
      .eq('id', postac_id)
      .single();
    
    if (postacError) throw postacError;
    
    // Enforce 2-second cooldown between mission starts (prevents spam/exploits)
    if (postacData.last_mission_started_at) {
      const lastStartTime = new Date(postacData.last_mission_started_at).getTime();
      const now = Date.now();
      const cooldownMs = 2000; // 2 seconds
      
      if (now - lastStartTime < cooldownMs) {
        const remainingMs = cooldownMs - (now - lastStartTime);
        return new Response(JSON.stringify({
          error: `Poczekaj ${Math.ceil(remainingMs / 1000)}s przed rozpoczęciem kolejnej misji.`
        }), {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 429 // Too Many Requests
        });
      }
    }
    
    // 4. SPRAWDZAMY CZY GRACZ JUŻ JEST NA MISJI (Kluczowe zabezpieczenie!)
    const { data: aktywneZlecenie, error: checkError } = await supabase.from('aktywne_zlecenia').select('id').eq('postac_id', postac_id).maybeSingle() // Sprawdź, czy istnieje taki wiersz (może być null)
    ;
    if (checkError) throw checkError;
    if (aktywneZlecenie) {
      // Gracz próbował oszukać i zacząć drugą misję!
      return new Response(JSON.stringify({
        error: 'Już jesteś na misji, choom.'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      } // 400 = Złe zapytanie
      );
    }
    // 5. Pobieramy dane zlecenia (ile trwa), żeby gracz nam ich nie sfałszował
    // VALIDATION: Also check if mission is visible/available
    const { data: definicja, error: definicjaError } = await supabase.from('zlecenia_definicje').select('czas_trwania_sekundy, visible').eq('id', zlecenie_id).single() // Oczekujemy dokładnie jednego wyniku
    ;
    if (definicjaError) throw definicjaError;
    if (!definicja) {
      throw new Error('Nie znaleziono zlecenia o takim ID.');
    }
    
    // Security: Check if mission is available (visible = true)
    if (definicja.visible === false) {
      return new Response(JSON.stringify({
        error: 'To zlecenie nie jest obecnie dostępne.'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 403 // Forbidden
      });
    }
    
    // 6. Obliczamy czas zakończenia misji
    const czasRozpoczecia = new Date();
    const czasZakonczenia = new Date(czasRozpoczecia.getTime() + definicja.czas_trwania_sekundy * 1000);
    // 7. Wstawiamy nowe "aktywne zlecenie" do bazy
    const { error: insertError } = await supabase.from('aktywne_zlecenia').insert({
      postac_id: postac_id,
      zlecenie_id: zlecenie_id,
      koniec_zlecenia_o: czasZakonczenia.toISOString()
    });
    if (insertError) throw insertError;
    
    // 7a. Update last_mission_started_at for rate limiting
    const { error: updateError } = await supabase
      .from('postacie')
      .update({ last_mission_started_at: czasRozpoczecia.toISOString() })
      .eq('id', postac_id);
    
    if (updateError) throw updateError;
    
    // 8. Odsyłamy sukces!
    return new Response(JSON.stringify({
      message: 'Zlecenie rozpoczęte!',
      koniec_o: czasZakonczenia.toISOString()
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    } // 200 = OK
    );
  } catch (error) {
    // Jakikolwiek inny błąd
    const err = error as Error;
    return new Response(JSON.stringify({
      error: err.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 500
    } // 500 = Błąd serwera
    );
  }
});
