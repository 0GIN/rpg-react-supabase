// Item categories and types
export type ItemType = 'clothing' | 'weapon' | 'consumable' | 'quest_item' | 'material' | 'other'
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type ClothingSlot = 'top' | 'bottom' | 'shoes' | 'accessory' | 'implant'

// Base item definition (can be from database or hardcoded)
export interface ItemDefinition {
  id: string
  name: string
  type: ItemType
  rarity: ItemRarity
  description?: string
  imagePath?: string  // Icon or image for the item
  stats?: Record<string, number>  // e.g., {"strength": 5, "defense": 10}
  price?: number  // Buy price in kredyty
  sellPrice?: number  // Sell price (usually lower than buy price)
  clothingSlot?: ClothingSlot  // Only for clothing items
  clothingPath?: string  // Path to PNG overlay for clothing (e.g., '/clothing/female/tops/jacket.png')
  stackable?: boolean  // Can multiple items stack in one inventory slot?
  maxStack?: number  // Maximum stack size (e.g., 99 for consumables)
}

// Item in player's inventory
export interface InventoryItem {
  itemId: string  // References ItemDefinition.id
  quantity: number
  equipped?: boolean  // Is this item currently equipped?
  obtainedAt?: string  // Timestamp when obtained
}

// Character appearance customization
export interface CharacterAppearance {
  gender: 'male' | 'female'
  // Store base overlays in appearance (paths to PNGs)
  body?: string   // e.g., '/clothing/female/body/female_body_01.png'
  hair?: string   // e.g., '/clothing/female/hair/female_hair_01.png'
  skinTone?: string  // Optional: future use for skin color variants
}

// Equipped clothing items - paths include gender folder
export interface EquippedClothing {
  // moved body + hair to appearance; keep backward-compat optional reads in UI
  top?: string        // Top: '/clothing/female/tops/cyber-jacket.png'
  bottom?: string     // Bottom: '/clothing/female/bottoms/tactical-pants.png'
  shoes?: string      // Shoes: '/clothing/female/shoes/combat-boots.png'
  accessory?: string  // Accessory: '/clothing/female/accessories/visor.png'
  implant?: string    // Implant: '/clothing/female/implants/cyber-arm.png'
}

// Character statistics (can be increased infinitely)
export interface CharacterStats {
  strength: number      // Siła - zwiększa obrażenia fizyczne
  intelligence: number  // Inteligencja - zwiększa hacking, rewards
  endurance: number     // Wytrzymałość - zwiększa HP
  agility: number       // Zwinność - zwiększa szanse na unik, krytyki
  charisma: number      // Charyzma - lepsze ceny, dialogi
  luck: number          // Szczęście - wpływa na losowe eventy, loot
}

// Level progression data
export interface LevelData {
  level: number
  experience: number
  experienceToNextLevel: number
  statPoints: number  // Unused stat points available to spend
}

export interface Postac {
  id: number
  nick: string
  kredyty: number
  street_cred: number
  user_id: string
  level?: number  // Player level (1-∞)
  experience?: number  // Current experience points
  stat_points?: number  // Unspent stat points
  stats?: CharacterStats  // JSONB - character statistics
  inventory?: InventoryItem[]  // JSONB array of items
  appearance?: CharacterAppearance  // JSONB - character base appearance
  clothing?: EquippedClothing  // JSONB - equipped clothing items
  created_at?: string
  last_mission_started_at?: string
}

// Mission requirements (prerequisites to start mission)
export interface MissionRequirements {
  min_level?: number
  max_level?: number
  min_street_cred?: number
  required_items?: string[]  // item IDs that player must have
  completed_missions?: string[]  // mission IDs that must be completed first
}

// Mission rewards (what player gets on completion)
export interface MissionRewards {
  kredyty?: number
  street_cred?: number
  experience?: number
  items?: Array<{ id: string; quantity: number }>
}

export interface ZlecenieDefinicja {
  id: number
  nazwa: string
  opis: string
  czas_trwania_sekundy: number
  nagrody: MissionRewards  // JSONB - extended structure
  wymagania?: MissionRequirements  // JSONB - prerequisites
  visible?: boolean
  created_at?: string
}

export interface AktywneZlecenie {
  id: number
  postac_id: number
  zlecenie_id: number
  koniec_zlecenia_o: string
  created_at?: string
}
