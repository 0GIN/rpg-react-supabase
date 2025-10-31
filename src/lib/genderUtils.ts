/**
 * Gender Utilities
 * 
 * Funkcje pomocnicze do obsługi płci postaci i dostosowywania ścieżek do grafik.
 * Używane jako fallback gdy Edge Function nie jest dostępna lub dla lokalnych operacji.
 */

import type { CharacterAppearance } from '@/types/gameTypes'

export type Gender = 'male' | 'female'

/**
 * Pobiera płeć z appearance obiektu
 */
export function getGenderFromAppearance(appearance: CharacterAppearance | null | undefined): Gender {
  return (appearance as any)?.gender || 'female'
}

/**
 * Dostosowuje ścieżkę do grafiki w zależności od płci
 * Podmienia /female/ na /male/ lub odwrotnie
 * 
 * @example
 * adjustPathForGender('/clothing/female/top/jacket.png', 'male')
 * // returns '/clothing/male/top/jacket.png'
 */
export function adjustPathForGender(path: string | null | undefined, gender: Gender): string | null {
  if (!path) return null
  
  if (path.includes('/female/')) {
    return gender === 'male' ? path.replace('/female/', '/male/') : path
  } else if (path.includes('/male/')) {
    return gender === 'female' ? path.replace('/male/', '/female/') : path
  }
  
  return path
}

/**
 * Dostosowuje wszystkie ścieżki w obiekcie clothing
 */
export function adjustClothingForGender(
  clothing: Record<string, string | null> | null | undefined,
  gender: Gender
): Record<string, string | null> {
  if (!clothing) return {}
  
  const adjusted: Record<string, string | null> = {}
  
  for (const [key, value] of Object.entries(clothing)) {
    adjusted[key] = adjustPathForGender(value, gender)
  }
  
  return adjusted
}
