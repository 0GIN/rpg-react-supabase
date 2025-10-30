import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

const VALID_STATS = ['strength', 'intelligence', 'endurance', 'agility', 'charisma', 'luck']

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'))
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with admin privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    let stat: string
    try {
      const body = await req.json()
      stat = body?.stat
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate stat name
    if (!stat || !VALID_STATS.includes(stat)) {
      return new Response(
        JSON.stringify({ error: `Invalid stat. Must be one of: ${VALID_STATS.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get character data
    const { data: postac, error: fetchError } = await supabaseAdmin
      .from('postacie')
      .select('id, user_id, stats, stat_points, nick')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !postac) {
      return new Response(
        JSON.stringify({ error: 'Character not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate stat points availability
    const currentStatPoints = postac.stat_points || 0
    if (currentStatPoints < 1) {
      return new Response(
        JSON.stringify({ 
          error: 'No stat points available',
          currentStatPoints 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate new stats
    const currentStats = postac.stats || {
      strength: 1,
      intelligence: 1,
      endurance: 1,
      agility: 1,
      charisma: 1,
      luck: 1
    }

    const currentValue = currentStats[stat] || 1
    const newStats = {
      ...currentStats,
      [stat]: currentValue + 1
    }

    // Update character
    const { error: updateError } = await supabaseAdmin
      .from('postacie')
      .update({
        stats: newStats,
        stat_points: currentStatPoints - 1
      })
      .eq('id', postac.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update character',
          details: updateError.message,
          code: updateError.code,
          hint: updateError.hint
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch updated character (separate select to avoid any representation issues)
    const { data: updatedPostac, error: fetchUpdatedError } = await supabaseAdmin
      .from('postacie')
      .select('*')
      .eq('id', postac.id)
      .single()

    if (fetchUpdatedError) {
      console.error('Fetch-after-update error:', fetchUpdatedError)
      // Return success with minimal payload to avoid false negatives when update succeeded
      return new Response(
        JSON.stringify({
          success: true,
          message: `${stat.toUpperCase()} increased to ${currentValue + 1}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log action for audit (optional)
    await supabaseAdmin.from('audit_log').insert({
      user_id: user.id,
      postac_id: postac.id,
      action: 'increase_stat',
      details: {
        stat,
        old_value: currentValue,
        new_value: currentValue + 1,
        stat_points_before: currentStatPoints,
        stat_points_after: currentStatPoints - 1
      },
      timestamp: new Date().toISOString()
    }).then(() => {}).catch(err => {
      // Don't fail the request if audit log fails
      console.error('Audit log error:', err)
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedPostac,
        message: `${stat.toUpperCase()} increased to ${currentValue + 1}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const err = error as Error
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
