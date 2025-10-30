import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Pobierz użytkownika z tokena
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sprawdź czy użytkownik jest adminem
    const { data: adminCheck } = await supabaseAdmin
      .from('admin_users')
      .select('is_admin')
      .eq('user_id', user.id)
      .eq('is_admin', true)
      .single()

    if (!adminCheck) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { targetNick, itemId, quantity } = await req.json()

    // Walidacja
    if (!targetNick || !itemId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: targetNick, itemId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const finalQuantity = quantity || 1

    // Znajdź postać po nicku
    const { data: targetChar, error: charError } = await supabaseAdmin
      .from('postacie')
      .select('id, nick')
      .ilike('nick', targetNick)
      .single()

    if (charError || !targetChar) {
      return new Response(
        JSON.stringify({ error: `Character with nick "${targetNick}" not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sprawdź czy item już istnieje w ekwipunku
    const { data: existingItem } = await supabaseAdmin
      .from('ekwipunek')
      .select('ilosc')
      .eq('postac_id', targetChar.id)
      .eq('item_id', itemId)
      .single()

    if (existingItem) {
      // Zaktualizuj ilość
      const { error: updateError } = await supabaseAdmin
        .from('ekwipunek')
        .update({ ilosc: existingItem.ilosc + finalQuantity })
        .eq('postac_id', targetChar.id)
        .eq('item_id', itemId)

      if (updateError) throw updateError
    } else {
      // Dodaj nowy item
      const { error: insertError } = await supabaseAdmin
        .from('ekwipunek')
        .insert({
          postac_id: targetChar.id,
          item_id: itemId,
          ilosc: finalQuantity,
          zalozony: false
        })

      if (insertError) throw insertError
    }

    // Zapisz w audit logu
    const { error: auditError } = await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: user.id,
        postac_id: targetChar.id,
        akcja: 'admin_add_item',
        szczegoly: {
          item_id: itemId,
          quantity: finalQuantity,
          target_nick: targetChar.nick
        }
      })

    if (auditError) {
      console.error('Audit log error:', auditError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Added ${finalQuantity}x ${itemId} to ${targetChar.nick}`,
        targetChar: targetChar.nick
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
