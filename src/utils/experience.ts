import { supabase } from '@/services/supabaseClient'
import type { Postac } from '@/types/gameTypes'
import { calculateLevelData } from './levelSystem'

/**
 * Give experience to character and handle level ups
 * Returns updated character data
 */
export async function giveExperience(
  postacId: number,
  expAmount: number
): Promise<{ success: boolean; data?: Postac; leveledUp?: boolean; newLevel?: number; error?: string }> {
  try {
    // Get current character data
    const { data: postac, error: fetchError } = await supabase
      .from('postacie')
      .select('*')
      .eq('id', postacId)
      .single()

    if (fetchError || !postac) {
      return { success: false, error: 'Failed to fetch character' }
    }

    const currentLevel = postac.level || 1
    const currentExp = postac.experience || 0
    const currentStatPoints = postac.stat_points || 0

    // Calculate new level data
    const newTotalExp = currentExp + expAmount
    const levelData = calculateLevelData(newTotalExp, currentLevel, currentStatPoints)

    const leveledUp = levelData.level > currentLevel

    // Update database
    const { data: updatedPostac, error: updateError } = await supabase
      .from('postacie')
      .update({
        experience: levelData.experience,
        level: levelData.level,
        stat_points: levelData.statPoints,
      })
      .eq('id', postacId)
      .select('*')
      .single()

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return {
      success: true,
      data: updatedPostac,
      leveledUp,
      newLevel: levelData.level,
    }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * Give experience and credits as mission reward
 */
export async function giveMissionRewards(
  postacId: number,
  rewards: {
    experience?: number
    kredyty?: number
    street_cred?: number
  }
): Promise<{ success: boolean; data?: Postac; leveledUp?: boolean; newLevel?: number; error?: string }> {
  try {
    // First, give experience (handles level up)
    const expResult = await giveExperience(postacId, rewards.experience || 0)
    
    if (!expResult.success || !expResult.data) {
      return expResult
    }

    // Then update credits and street cred if needed
    if (rewards.kredyty || rewards.street_cred) {
      const { data: updatedPostac, error: updateError } = await supabase
        .from('postacie')
        .update({
          kredyty: (expResult.data.kredyty || 0) + (rewards.kredyty || 0),
          street_cred: (expResult.data.street_cred || 0) + (rewards.street_cred || 0),
        })
        .eq('id', postacId)
        .select('*')
        .single()

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return {
        success: true,
        data: updatedPostac,
        leveledUp: expResult.leveledUp,
        newLevel: expResult.newLevel,
      }
    }

    return expResult
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

/**
 * DEV HELPER: Give lots of exp for testing
 */
export async function devGiveExp(postacId: number, amount: number = 1000) {
  return await giveExperience(postacId, amount)
}
