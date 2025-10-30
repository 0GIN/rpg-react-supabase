/**
 * levelSystem.ts - Obliczenia systemu poziomów i statystyk
 * 
 * Funkcje pomocnicze do zarządzania systemem progresji:
 * - Obliczanie wymaganego doświadczenia na kolejny poziom
 * - Kalkulacja całkowitych statystyk postaci (bazowe + bonusy z ekwipunku)
 * - Wyznaczanie bonusów z ekwipunku
 * - System poziomów z wykładniczym skalowaniem trudności
 */

import type { CharacterStats, LevelData } from '@/types/gameTypes'

/**
 * Calculate experience required for next level
 * Formula: baseExp * level^1.5 (exponential scaling)
 */
export function calculateExpForNextLevel(currentLevel: number): number {
  const baseExp = 100
  return Math.floor(baseExp * Math.pow(currentLevel, 1.5))
}

/**
 * Calculate total experience needed to reach a specific level
 */
export function calculateTotalExpForLevel(targetLevel: number): number {
  let totalExp = 0
  for (let level = 1; level < targetLevel; level++) {
    totalExp += calculateExpForNextLevel(level)
  }
  return totalExp
}

/**
 * Calculate current level data from experience
 */
export function calculateLevelData(
  currentExp: number,
  currentLevel: number = 1,
  statPoints: number = 0
): LevelData {
  let level = currentLevel
  let exp = currentExp
  let expNeeded = calculateExpForNextLevel(level)
  let pointsEarned = statPoints

  // Check if player should level up
  while (exp >= expNeeded) {
    exp -= expNeeded
    level++
    pointsEarned += getStatPointsPerLevel(level)
    expNeeded = calculateExpForNextLevel(level)
  }

  return {
    level,
    experience: exp,
    experienceToNextLevel: expNeeded,
    statPoints: pointsEarned,
  }
}

/**
 * Get stat points earned per level
 * Can be scaled based on level thresholds
 */
export function getStatPointsPerLevel(level: number): number {
  if (level <= 10) return 3
  if (level <= 25) return 4
  if (level <= 50) return 5
  if (level <= 100) return 6
  return 7 // 100+ levels get even more points
}

/**
 * Calculate total stat points based on bonuses from equipment
 */
export function calculateTotalStats(
  baseStats: CharacterStats,
  equipmentBonuses: Partial<CharacterStats> = {}
): CharacterStats {
  return {
    strength: (baseStats.strength || 0) + (equipmentBonuses.strength || 0),
    intelligence: (baseStats.intelligence || 0) + (equipmentBonuses.intelligence || 0),
    endurance: (baseStats.endurance || 0) + (equipmentBonuses.endurance || 0),
    agility: (baseStats.agility || 0) + (equipmentBonuses.agility || 0),
    charisma: (baseStats.charisma || 0) + (equipmentBonuses.charisma || 0),
    luck: (baseStats.luck || 0) + (equipmentBonuses.luck || 0),
  }
}

/**
 * Calculate equipment stat bonuses from inventory
 */
export function calculateEquipmentBonuses(
  equippedItems: Array<{ stats?: Record<string, number> }>
): Partial<CharacterStats> {
  const bonuses: Partial<CharacterStats> = {
    strength: 0,
    intelligence: 0,
    endurance: 0,
    agility: 0,
    charisma: 0,
    luck: 0,
  }

  equippedItems.forEach((item) => {
    if (item.stats) {
      Object.entries(item.stats).forEach(([stat, value]) => {
        if (stat in bonuses) {
          bonuses[stat as keyof CharacterStats] =
            (bonuses[stat as keyof CharacterStats] || 0) + value
        }
      })
    }
  })

  return bonuses
}

/**
 * Get level progress percentage (0-100)
 */
export function getLevelProgress(currentExp: number, expToNext: number): number {
  if (expToNext === 0) return 100
  return Math.min(100, Math.floor((currentExp / expToNext) * 100))
}

/**
 * Calculate derived stats (HP, damage, etc.) from base stats
 */
export function calculateDerivedStats(stats: CharacterStats) {
  return {
    maxHealth: 100 + stats.endurance * 10, // 100 base + 10 per endurance
    healthRegen: Math.floor(stats.endurance / 5), // 1 HP/sec per 5 endurance
    maxEnergy: 100 + stats.intelligence * 5, // 100 base + 5 per intelligence
    physicalDamage: 10 + stats.strength * 2, // 10 base + 2 per strength
    critChance: 5 + stats.agility * 0.5, // 5% base + 0.5% per agility
    dodgeChance: 5 + stats.agility * 0.3, // 5% base + 0.3% per agility
    hackingPower: stats.intelligence * 3, // 3 per intelligence
    negotiationBonus: stats.charisma * 2, // 2% better prices per charisma
    lootBonus: stats.luck * 1.5, // 1.5% better loot per luck
  }
}

/**
 * Format stat name for display
 */
export function getStatDisplayName(stat: keyof CharacterStats): string {
  const names: Record<keyof CharacterStats, string> = {
    strength: 'Siła',
    intelligence: 'Inteligencja',
    endurance: 'Wytrzymałość',
    agility: 'Zwinność',
    charisma: 'Charyzma',
    luck: 'Szczęście',
  }
  return names[stat]
}

/**
 * Get stat description
 */
export function getStatDescription(stat: keyof CharacterStats): string {
  const descriptions: Record<keyof CharacterStats, string> = {
    strength: 'Zwiększa obrażenia fizyczne w walce',
    intelligence: 'Zwiększa moc hakowania i nagrody',
    endurance: 'Zwiększa maksymalne HP i regenerację',
    agility: 'Zwiększa szansę na krytyki i uniki',
    charisma: 'Lepsze ceny w sklepach i dialogi',
    luck: 'Wpływa na losowe eventy i jakość loot',
  }
  return descriptions[stat]
}
