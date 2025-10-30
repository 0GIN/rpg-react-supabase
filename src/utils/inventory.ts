import type { InventoryItem } from '@/types/gameTypes'
import { supabase } from '@/services/supabaseClient'

/**
 * Add item(s) to player's inventory
 * If item already exists and is stackable, increases quantity
 * Otherwise adds as new inventory slot
 */
export async function addItemToInventory(
  postacId: number,
  itemId: string,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current character data
    const { data: postac, error: fetchError } = await supabase
      .from('postacie')
      .select('inventory')
      .eq('id', postacId)
      .single()

    if (fetchError || !postac) {
      return { success: false, error: 'Failed to fetch character' }
    }

    const currentInventory: InventoryItem[] = postac.inventory || []

    // Check if item already exists in inventory
    const existingItemIndex = currentInventory.findIndex(
      (item) => item.itemId === itemId
    )

    let updatedInventory: InventoryItem[]

    if (existingItemIndex !== -1) {
      // Item exists - increase quantity
      updatedInventory = currentInventory.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      // Item doesn't exist - add new entry
      const newItem: InventoryItem = {
        itemId,
        quantity,
        obtainedAt: new Date().toISOString(),
      }
      updatedInventory = [...currentInventory, newItem]
    }

    // Update database
    const { error: updateError } = await supabase
      .from('postacie')
      .update({ inventory: updatedInventory })
      .eq('id', postacId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * Remove item(s) from inventory
 * Decreases quantity or removes item completely if quantity reaches 0
 */
export async function removeItemFromInventory(
  postacId: number,
  itemId: string,
  quantity: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: postac, error: fetchError } = await supabase
      .from('postacie')
      .select('inventory')
      .eq('id', postacId)
      .single()

    if (fetchError || !postac) {
      return { success: false, error: 'Failed to fetch character' }
    }

    const currentInventory: InventoryItem[] = postac.inventory || []

    const updatedInventory = currentInventory
      .map((item) => {
        if (item.itemId === itemId) {
          const newQuantity = item.quantity - quantity
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null
        }
        return item
      })
      .filter((item): item is InventoryItem => item !== null)

    const { error: updateError } = await supabase
      .from('postacie')
      .update({ inventory: updatedInventory })
      .eq('id', postacId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * Add multiple items at once (useful for mission rewards)
 */
export async function addMultipleItems(
  postacId: number,
  items: Array<{ itemId: string; quantity: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: postac, error: fetchError } = await supabase
      .from('postacie')
      .select('inventory')
      .eq('id', postacId)
      .single()

    if (fetchError || !postac) {
      return { success: false, error: 'Failed to fetch character' }
    }

    let updatedInventory: InventoryItem[] = postac.inventory || []

    // Process each item
    for (const { itemId, quantity } of items) {
      const existingItemIndex = updatedInventory.findIndex(
        (item) => item.itemId === itemId
      )

      if (existingItemIndex !== -1) {
        // Increase existing item quantity
        updatedInventory = updatedInventory.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        updatedInventory.push({
          itemId,
          quantity,
          obtainedAt: new Date().toISOString(),
        })
      }
    }

    const { error: updateError } = await supabase
      .from('postacie')
      .update({ inventory: updatedInventory })
      .eq('id', postacId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * Give starter items to a new character
 */
export async function giveStarterItems(postacId: number): Promise<void> {
  await addMultipleItems(postacId, [
    { itemId: 'medkit', quantity: 3 },
    { itemId: 'energy_drink', quantity: 5 },
    { itemId: 'pistol_9mm', quantity: 1 },
    { itemId: 'combat_boots', quantity: 1 },
    { itemId: 'cargo_pants', quantity: 1 },
    { itemId: 'scrap_metal', quantity: 10 },
  ])
}

/**
 * Dev helper: Give all items for testing
 */
export async function giveAllItemsForTesting(postacId: number): Promise<void> {
  const { ITEM_DEFINITIONS } = await import('@/data/items')
  
  const allItems = Object.keys(ITEM_DEFINITIONS).map(itemId => ({
    itemId,
    quantity: ITEM_DEFINITIONS[itemId].stackable ? 10 : 1
  }))
  
  await addMultipleItems(postacId, allItems)
}
