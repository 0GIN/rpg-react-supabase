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

    const { targetNick, amount } = await req.json()

    // Walidacja
    if (!targetNick || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: targetNick, amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Amount must be positive' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Znajdź postać po nicku
    const { data: targetChar, error: charError } = await supabaseAdmin
      .from('postacie')
      .select('id, nick, kredyty')
      .ilike('nick', targetNick)
      .single()

    if (charError || !targetChar) {
      return new Response(
        JSON.stringify({ error: `Character with nick "${targetNick}" not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Dodaj kredyty
    const newAmount = (targetChar.kredyty || 0) + amount
    const { error: updateError } = await supabaseAdmin
      .from('postacie')
      .update({ kredyty: newAmount })
      .eq('id', targetChar.id)

    if (updateError) throw updateError

    // Zapisz w audit logu
    const { error: auditError } = await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: user.id,
        postac_id: targetChar.id,
        akcja: 'admin_give_credits',
        szczegoly: {
          amount: amount,
          old_balance: targetChar.kredyty || 0,
          new_balance: newAmount,
          target_nick: targetChar.nick
        }
      })

    if (auditError) {
      console.error('Audit log error:', auditError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Added ${amount} credits to ${targetChar.nick}`,
        targetChar: targetChar.nick,
        newBalance: newAmount
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
