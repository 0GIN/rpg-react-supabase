/**
 * Edge Function: get-items
 * 
 * Pobiera listę itemów z bazy danych i automatycznie dostosowuje
 * ścieżki do grafik (clothing_path, image_path) w zależności od płci postaci użytkownika.
 * 
 * Endpoint: /functions/v1/get-items
 * Method: GET
 * Auth: Required
 * 
 * Response: { items: Item[], userGender: 'male' | 'female' }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'
import { corsHeaders } from '../_shared/cors.ts'

interface Item {
  item_id: string
  name: string
  description: string | null
  type: string
  subtype: string | null
  rarity: string
  value: number
  weight: number
  stackable: boolean
  max_stack: number | null
  equippable: boolean
  consumable: boolean
  requirements: Record<string, any> | null
  effects: Record<string, any> | null
  stats: Record<string, any> | null
  clothing_slot: string | null
  clothing_path: string | null
  image_path: string | null
  created_at: string
  updated_at: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Weryfikacja autentykacji
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Pobierz płeć postaci użytkownika
    const { data: postacData, error: postacError } = await supabaseClient
      .from('postacie')
      .select('appearance')
      .eq('user_id', user.id)
      .maybeSingle()

    if (postacError) {
      console.error('Error fetching character:', postacError)
    }

    const userGender: 'male' | 'female' = postacData?.appearance?.gender || 'female'

    // Pobierz wszystkie itemy z bazy
    const { data: items, error: itemsError } = await supabaseClient
      .from('items')
      .select('*')
      .order('name', { ascending: true })

    if (itemsError) {
      throw new Error(`Failed to fetch items: ${itemsError.message}`)
    }

    // Funkcja pomocnicza do podmiany płci w ścieżce
    function adjustPathForGender(path: string | null, gender: 'male' | 'female'): string | null {
      if (!path) return null
      
      // Jeśli ścieżka zawiera /female/ lub /male/, podmień na odpowiednią płeć
      if (path.includes('/female/')) {
        return gender === 'male' ? path.replace('/female/', '/male/') : path
      } else if (path.includes('/male/')) {
        return gender === 'female' ? path.replace('/male/', '/female/') : path
      }
      
      return path
    }

    // Dostosuj ścieżki do płci użytkownika
    const adjustedItems = items.map((item: Item) => ({
      ...item,
      clothing_path: adjustPathForGender(item.clothing_path, userGender),
      image_path: adjustPathForGender(item.image_path, userGender),
    }))

    return new Response(
      JSON.stringify({
        items: adjustedItems,
        userGender,
        count: adjustedItems.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in get-items function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
