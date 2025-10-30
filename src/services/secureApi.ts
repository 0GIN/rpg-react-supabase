/**
 * Secure API client for calling Edge Functions
 * All critical game operations should go through these functions
 */

import { supabase } from './supabaseClient'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1'

/**
 * Get current session token for authentication
 */
async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

/**
 * Generic function caller with auth
 */
async function callFunction<T>(
  functionName: string,
  payload?: any
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: 'Not authenticated' }
    }

    const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload || {}),
    })

    const result = await response.json()

    if (!response.ok) {
      return { success: false, error: result.error || result.details || 'Request failed' }
    }

    return result
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error)
    return { success: false, error: (error as Error).message }
  }
}

// ==========================================
// STAT MANAGEMENT
// ==========================================

/**
 * Increase a character stat (server-side validation)
 * @param stat - The stat to increase (strength, intelligence, etc.)
 */
export async function increaseStat(
  stat: 'strength' | 'intelligence' | 'endurance' | 'agility' | 'charisma' | 'luck'
) {
  return callFunction('increase-stat', { stat })
}

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================

/**
 * Use an item from inventory (server-side effects)
 * @param itemId - ID of the item to use
 */
export async function useItem(itemId: string) {
  return callFunction('use-item', { itemId })
}

/**
 * Equip or unequip an item (server-side validation)
 * @param itemId - ID of the item
 * @param action - 'equip' or 'unequip'
 */
export async function equipItem(itemId: string, action: 'equip' | 'unequip') {
  return callFunction('equip-item', { itemId, action })
}

// ==========================================
// EXPERIENCE AND LEVELING
// ==========================================

/**
 * Give experience to character (called by mission completion, combat, etc.)
 * NOTE: This should only be called from server-verified events!
 * For now, keeping it here but should be moved to mission completion functions
 */
export async function giveExperience(expAmount: number, source: string) {
  return callFunction('give-experience', { expAmount, source })
}

// ==========================================
// MISSIONS
// ==========================================

/**
 * Start a mission (already secured)
 */
export async function rozpocznijZlecenie(zlecenieDefId: number) {
  const raw = await callFunction<any>('rozpocznij-zlecenie', { zlecenie_id: zlecenieDefId })
  if ((raw as any)?.success === false) return raw as any
  return { success: true, data: raw, message: (raw as any)?.message }
}

/**
 * Claim mission reward (already secured)
 */
export async function odbierjNagrode(aktywneZlecenieId: number) {
  const raw = await callFunction<any>('odbierz-nagrode', { aktywne_zlecenie_id: aktywneZlecenieId })
  if ((raw as any)?.success === false) return raw as any
  return { success: true, data: raw }
}

// ==========================================
// SHOP (TODO)
// ==========================================

/**
 * Buy an item from shop (server validates price and inventory)
 */
export async function buyItem(itemId: string, quantity: number = 1) {
  return callFunction('buy-item', { itemId, quantity })
}

// ==========================================
// ARENA (TODO)
// ==========================================

/**
 * Start an arena fight (server calculates outcome)
 */
export async function startArenaFight(opponentId?: number) {
  return callFunction('arena-fight', { opponentId })
}

// ==========================================
// TRADING (TODO)
// ==========================================

/**
 * Initiate trade with another player
 */
export async function initiateTrade(targetPlayerId: number, offeredItems: string[]) {
  return callFunction('initiate-trade', { targetPlayerId, offeredItems })
}

/**
 * Accept or reject a trade offer
 */
export async function respondToTrade(tradeId: number, accept: boolean) {
  return callFunction('respond-trade', { tradeId, accept })
}

// ==========================================
// UTILITY
// ==========================================

/**
 * Check if function call was successful
 */
export function isSuccess<T>(result: { success: boolean; data?: T }): result is { success: true; data: T } {
  return result.success === true
}

export default {
  // Stats
  increaseStat,
  
  // Inventory
  useItem,
  equipItem,
  
  // Experience
  giveExperience,
  
  // Missions
  rozpocznijZlecenie,
  odbierjNagrode,
  
  // Shop (TODO)
  buyItem,
  
  // Arena (TODO)
  startArenaFight,
  
  // Trading (TODO)
  initiateTrade,
  respondToTrade,
  
  // Utility
  isSuccess,
}
