import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

// Temporary fallback item definitions while migrating to DB-backed items
const FALLBACK_ITEM_DATA: Record<string, {
  type: string
  clothingSlot?: 'top' | 'bottom' | 'shoes' | 'accessory' | 'implant'
  clothingPath?: string
  requiredLevel?: number
  requiredStats?: Record<string, number>
}> = {
  // Clothing (kept minimal; will be removed once DB is the single source)
  'cyber_jacket_f': { type: 'clothing', clothingSlot: 'top', clothingPath: '/clothing/female/tops/cyber_jacket_f.png' },
  'tactical_vest': { type: 'clothing', clothingSlot: 'top', clothingPath: '/clothing/unisex/tops/tactical_vest.png' },
  'cargo_pants': { type: 'clothing', clothingSlot: 'bottom', clothingPath: '/clothing/unisex/bottoms/cargo_pants.png' },
  'combat_boots': { type: 'clothing', clothingSlot: 'shoes', clothingPath: '/clothing/unisex/shoes/combat_boots.png' },
  'smart_glasses': { type: 'clothing', clothingSlot: 'accessory', clothingPath: '/clothing/unisex/accessories/smart_glasses.png' },
  'military_cyberarm': { type: 'clothing', clothingSlot: 'implant', clothingPath: '/clothing/unisex/implants/military_cyberarm.png', requiredLevel: 5 },
  
  // Weapons
  'pistol_9mm': { type: 'weapon' },
  'plasma_rifle': { type: 'weapon', requiredLevel: 10 },
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
    const { itemId, action } = await req.json()

    if (!itemId || !action || !['equip', 'unequip'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request. Provide itemId and action (equip/unequip)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch item definition from DB (single source of truth)
    const { data: dbItem } = await supabaseAdmin
      .from('items')
      .select('item_id, typ, required_level, required_stats, clothing_slot, clothing_path')
      .eq('item_id', itemId)
      .maybeSingle()

    const itemDef = dbItem ? {
      type: dbItem.typ as 'clothing' | 'weapon' | 'consumable' | 'quest' | 'misc' | 'cyberware',
      clothingSlot: dbItem.clothing_slot as 'top' | 'bottom' | 'shoes' | 'accessory' | 'implant' | undefined,
      clothingPath: dbItem.clothing_path as string | undefined,
      requiredLevel: (dbItem.required_level ?? undefined) as number | undefined,
      requiredStats: (dbItem.required_stats ?? undefined) as Record<string, number> | undefined,
    } : FALLBACK_ITEM_DATA[itemId]

    if (!itemDef) {
      return new Response(
        JSON.stringify({ error: 'Item definition not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const invItemIndex = inventory.findIndex((item: any) => item.itemId === itemId)

    if (invItemIndex === -1) {
      return new Response(
        JSON.stringify({ error: 'Item not found in inventory' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const invItem = inventory[invItemIndex]

    if (action === 'equip') {
      // Validate requirements
      if (itemDef.requiredLevel && postac.level < itemDef.requiredLevel) {
        return new Response(
          JSON.stringify({ 
            error: `Requires level ${itemDef.requiredLevel}. Current level: ${postac.level}` 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check stat requirements
      if (itemDef.requiredStats) {
        const stats = postac.stats || {}
        for (const [stat, required] of Object.entries(itemDef.requiredStats)) {
          if ((stats[stat] || 0) < required) {
            return new Response(
              JSON.stringify({ 
                error: `Requires ${stat} ${required}. Current: ${stats[stat] || 0}` 
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      }

      // Check if already equipped
      if (invItem.equipped) {
        return new Response(
          JSON.stringify({ error: 'Item is already equipped' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // For clothing items, unequip current item in same slot (DB-backed)
      if (itemDef.type === 'clothing' && itemDef.clothingSlot) {
        const slot = itemDef.clothingSlot

        // Fetch clothing slots for currently equipped items once from DB
        const equippedIds = inventory
          .filter((it: any) => it.equipped && it.itemId !== itemId)
          .map((it: any) => it.itemId)

        let slotMap: Record<string, string | null> = {}
        if (equippedIds.length > 0) {
          const { data: defs } = await supabaseAdmin
            .from('items')
            .select('item_id, clothing_slot')
            .in('item_id', equippedIds)
          if (defs) {
            for (const d of defs) slotMap[d.item_id] = d.clothing_slot
          }
        }

        // Fallback for any items not found in DB
        for (const id of equippedIds) {
          if (!(id in slotMap)) {
            const fb = FALLBACK_ITEM_DATA[id]
            slotMap[id] = fb?.clothingSlot ?? null
          }
        }

        // Unequip any item occupying the same slot
        for (let i = 0; i < inventory.length; i++) {
          const otherItem = inventory[i]
          if (otherItem.equipped && otherItem.itemId !== itemId) {
            const otherSlot = slotMap[otherItem.itemId] ?? null
            if (otherSlot === slot) {
              inventory[i] = { ...otherItem, equipped: false }
            }
          }
        }
      }

      // Equip item
      inventory[invItemIndex] = { ...invItem, equipped: true }

      // Update clothing paths for mannequin
      const updateData: any = { 
        inventory,
          // updated_at: new Date().toISOString() // Removed to prevent failures
      }

      if (itemDef.type === 'clothing' && itemDef.clothingSlot && itemDef.clothingPath) {
        const clothing = postac.clothing || {}
        updateData.clothing = {
          ...clothing,
          [itemDef.clothingSlot]: itemDef.clothingPath
        }
      }

      // Update database - separated UPDATE and SELECT
      const { error: updateError } = await supabaseAdmin
        .from('postacie')
        .update(updateData)
        .eq('id', postac.id)

      if (updateError) {
        console.error('Update error:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to equip item: ' + updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Log action
      const { error: auditError } = await supabaseAdmin.from('audit_log').insert({
        user_id: user.id,
        postac_id: postac.id,
        action: 'equip_item',
        details: { item_id: itemId, slot: itemDef.clothingSlot },
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
          data: updatedPostac || { ...postac, inventory: updateData.inventory, clothing: updateData.clothing },
          message: `Equipped ${itemId}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'unequip') {
      // Check if item is equipped
      if (!invItem.equipped) {
        return new Response(
          JSON.stringify({ error: 'Item is not equipped' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Unequip item
      inventory[invItemIndex] = { ...invItem, equipped: false }

      // Update clothing paths for mannequin
      const updateData: any = { 
        inventory,
          // updated_at: new Date().toISOString() // Removed to prevent failures
      }

      if (itemDef.type === 'clothing' && itemDef.clothingSlot) {
        const clothing = postac.clothing || {}
        updateData.clothing = {
          ...clothing,
          [itemDef.clothingSlot]: null
        }
      }

      // Update database - separated UPDATE and SELECT
      const { error: updateError } = await supabaseAdmin
        .from('postacie')
        .update(updateData)
        .eq('id', postac.id)

      if (updateError) {
        console.error('Update error:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to unequip item: ' + updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Log action
      const { error: auditError } = await supabaseAdmin.from('audit_log').insert({
        user_id: user.id,
        postac_id: postac.id,
        action: 'unequip_item',
        details: { item_id: itemId, slot: itemDef.clothingSlot },
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
          data: updatedPostac || { ...postac, inventory: updateData.inventory, clothing: updateData.clothing },
          message: `Unequipped ${itemId}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
