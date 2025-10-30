"use client"

import type { CharacterAppearance, EquippedClothing } from "@/types/gameTypes"

interface ClothingLayer {
  id: string
  type: 'body' | 'hair' | 'top' | 'bottom' | 'shoes' | 'accessory' | 'implant'
  imagePath: string
  zIndex: number
}

interface CharacterMannequinProps {
  appearance?: CharacterAppearance | null
  clothing?: EquippedClothing | null
  className?: string
}

/**
 * CharacterMannequin Component
 * 
 * Renders a character with base mannequin + clothing layers
 * - Takes appearance (gender, bodyType) and clothing data from database
 * - Converts to layered PNG images with proper z-index ordering
 * - Can be used anywhere: Profile, Dashboard, Wardrobe, etc.
 */
export function CharacterMannequin({ 
  appearance = null,
  clothing = null,
  className = '' 
}: CharacterMannequinProps) {
  
  // Default to female if no appearance data
  const gender = appearance?.gender || 'female'
  
  // Base mannequin image path (naked character base)
  const baseMannequin = gender === 'female' 
    ? '/female_manekin.png' 
    : '/male_manekin.png'

  // zIndex order (lower = behind, higher = in front):
  // 0: base mannequin (always visible)
  // 1: body type (optional overlay on mannequin)
  // 2: shoes
  // 3: bottom (pants, skirt)
  // 4: top (shirt, jacket)
  // 5: accessory (glasses, mask)
  // 6: hair
  // 7: implant (visible cybernetics)
  const zIndexMap = { 
    body: 1,
    shoes: 2, 
    bottom: 3, 
    top: 4, 
    accessory: 5, 
    hair: 6, 
    implant: 7 
  }

  // Convert database clothing format + appearance overlays to layered format
  const clothingLayers: ClothingLayer[] = []

  // From appearance: body + hair overlays
  const bodyPath = (appearance as any)?.body || (appearance as any)?.bodyType // support legacy bodyType
  if (bodyPath) {
    clothingLayers.push({ id: 'body', type: 'body', imagePath: bodyPath, zIndex: zIndexMap.body })
  }
  const hairPath = (appearance as any)?.hair || (clothing as any)?.hair // legacy: hair stored in clothing
  if (hairPath) {
    clothingLayers.push({ id: 'hair', type: 'hair', imagePath: hairPath, zIndex: zIndexMap.hair })
  }

  // From clothing: remaining equip slots (top, bottom, shoes, accessory, implant)
  if (clothing) {
    (['shoes','bottom','top','accessory','implant'] as ClothingLayer['type'][]).forEach((type) => {
      const path = (clothing as any)[type]
      if (path) {
        clothingLayers.push({
          id: type,
          type,
          imagePath: path,
          zIndex: zIndexMap[type]
        })
      }
    })
  }

  // Sort clothing by zIndex to ensure correct layering
  const sortedClothing = [...clothingLayers].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className={`relative ${className}`}>
      {/* Layer 0: Base Mannequin (always visible) */}
      <img 
        src={baseMannequin}
        alt={`${gender} character`}
        className="w-full h-full object-contain"
      />

      {/* Layers 1-7: Clothing items (rendered on top, sorted by zIndex) */}
      {sortedClothing.map((item) => (
        <img
          key={item.id}
          src={item.imagePath}
          alt={item.type}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ zIndex: item.zIndex }}
        />
      ))}
    </div>
  )
}
