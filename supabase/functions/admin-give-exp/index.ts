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

    // TODO: Enable admin check when admin_users table is created in production
    // const { data: adminCheck } = await supabaseAdmin
    //   .from('admin_users')
    //   .select('is_admin')
    //   .eq('user_id', user.id)
    //   .eq('is_admin', true)
    //   .single()

    // if (!adminCheck) {
    //   return new Response(
    //     JSON.stringify({ error: 'Forbidden: Admin access required' }),
    //     { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    //   )
    // }

    const { targetNick, expAmount } = await req.json()

    // Walidacja
    if (!targetNick || !expAmount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: targetNick, expAmount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (expAmount <= 0) {
      return new Response(
        JSON.stringify({ error: 'EXP amount must be positive' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Znajdź postać po nicku
    const { data: targetChar, error: charError } = await supabaseAdmin
      .from('postacie')
      .select('id, nick, experience, level, stat_points')
      .ilike('nick', targetNick)
      .single()

    if (charError || !targetChar) {
      return new Response(
        JSON.stringify({ error: `Character with nick "${targetNick}" not found` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Oblicz nowe EXP i poziom
    let currentExp = targetChar.experience || 0
    let currentLevel = targetChar.level || 1
    let statPoints = targetChar.stat_points || 0
    
    currentExp += expAmount
    
    // Sprawdź awanse poziomu (formula: 100 * level^1.5)
    let levelsGained = 0
    let expForNextLevel = Math.floor(100 * Math.pow(currentLevel, 1.5))
    
    while (currentExp >= expForNextLevel && currentLevel < 100) {
      currentExp -= expForNextLevel
      currentLevel++
      levelsGained++
      statPoints += 5 // 5 punktów statów za każdy poziom
      expForNextLevel = Math.floor(100 * Math.pow(currentLevel, 1.5))
    }

    // Zaktualizuj postać
    const { error: updateError } = await supabaseAdmin
      .from('postacie')
      .update({ 
        experience: currentExp,
        level: currentLevel,
        stat_points: statPoints
      })
      .eq('id', targetChar.id)

    if (updateError) throw updateError

    // Zapisz w audit logu
    const { error: auditError } = await supabaseAdmin
      .from('audit_log')
      .insert({
        admin_id: user.id,
        postac_id: targetChar.id,
        akcja: 'admin_give_exp',
        szczegoly: {
          exp_amount: expAmount,
          old_level: targetChar.level || 1,
          new_level: currentLevel,
          levels_gained: levelsGained,
          stat_points_gained: levelsGained * 5,
          target_nick: targetChar.nick
        }
      })

    if (auditError) {
      console.error('Audit log error:', auditError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Added ${expAmount} EXP to ${targetChar.nick}`,
        targetChar: targetChar.nick,
        levelsGained,
        newLevel: currentLevel,
        statPointsGained: levelsGained * 5
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
