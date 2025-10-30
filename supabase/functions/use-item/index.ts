import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

// Item definitions with their effects
const ITEM_EFFECTS: Record<string, {
  type: 'heal' | 'buff' | 'restore_energy' | 'restore_neural' | 'quest'
  value?: number
  duration?: number // in seconds for buffs
}> = {
  'medkit': { type: 'heal', value: 50 },
  'stimpack': { type: 'heal', value: 100 },
  'energy_drink': { type: 'restore_energy', value: 25 },
  'neural_boost': { type: 'restore_neural', value: 30 },
  'rare_crystal': { type: 'quest' }, // Quest items can't be used
  // Add more item effects as needed
}

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
    const { itemId } = await req.json()

    if (!itemId) {
      return new Response(
        JSON.stringify({ error: 'Missing itemId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if item has defined effects
    const itemEffect = ITEM_EFFECTS[itemId]
    if (!itemEffect) {
      return new Response(
        JSON.stringify({ error: 'Item cannot be used or does not exist' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get character data
    const { data: postac, error: fetchError } = await supabaseAdmin
      .from('postacie')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !postac) {
      return new Response(
        JSON.stringify({ error: 'Character not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate item exists in inventory
    const inventory = postac.inventory || []
    const invItem = inventory.find((item: any) => item.itemId === itemId)

    if (!invItem || invItem.quantity < 1) {
      return new Response(
        JSON.stringify({ error: 'Item not found in inventory' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if item is equipped (can't use equipped items)
    if (invItem.equipped) {
      return new Response(
        JSON.stringify({ error: 'Cannot use equipped items. Unequip first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Apply item effect
    const updateData: any = {}
    let effectMessage = ''

    switch (itemEffect.type) {
      case 'heal':
        // TODO: Implement health system
        // For now, just acknowledge the heal
        effectMessage = `Restored ${itemEffect.value} health`
        break

      case 'restore_energy':
        const currentEnergy = postac.energia || 0
        const maxEnergy = 100 // TODO: Make this dynamic based on stats
        const newEnergy = Math.min(currentEnergy + (itemEffect.value || 0), maxEnergy)
        updateData.energia = newEnergy
        effectMessage = `Restored ${newEnergy - currentEnergy} energy`
        break

      case 'restore_neural':
        const currentNeural = postac.neural_power || 0
        const maxNeural = 2000 // TODO: Make this dynamic
        const newNeural = Math.min(currentNeural + (itemEffect.value || 0), maxNeural)
        updateData.neural_power = newNeural
        effectMessage = `Restored ${newNeural - currentNeural} neural power`
        break

      case 'quest':
        return new Response(
          JSON.stringify({ error: 'Quest items cannot be used directly' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        effectMessage = 'Item used'
    }

    // Remove item from inventory
    let updatedInventory
    if (invItem.quantity > 1) {
      // Decrease quantity
      updatedInventory = inventory.map((item: any) =>
        item.itemId === itemId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    } else {
      // Remove item completely
      updatedInventory = inventory.filter((item: any) => item.itemId !== itemId)
    }

  updateData.inventory = updatedInventory

    // Update character - separated UPDATE and SELECT
    const { error: updateError } = await supabaseAdmin
      .from('postacie')
      .update(updateData)
      .eq('id', postac.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to use item: ' + updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log action for audit
    const { error: auditError } = await supabaseAdmin.from('audit_log').insert({
      user_id: user.id,
      postac_id: postac.id,
      action: 'use_item',
      details: {
        item_id: itemId,
        effect_type: itemEffect.type,
        effect_value: itemEffect.value,
        quantity_before: invItem.quantity,
        quantity_after: invItem.quantity - 1
      },
      timestamp: new Date().toISOString()
    })
    if (auditError) console.error('Audit log error:', auditError)

    // Fetch updated character (if this fails, we still return success because UPDATE succeeded)
    const { data: updatedPostac } = await supabaseAdmin
      .from('postacie')
      .select('*')
      .eq('id', postac.id)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedPostac || { ...postac, ...updateData },
        message: effectMessage,
        effect: itemEffect
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
