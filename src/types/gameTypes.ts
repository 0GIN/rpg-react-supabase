// Item in player's inventory
export interface InventoryItem {
  id: string
  name: string
  type: 'augmentation' | 'weapon' | 'consumable' | 'quest_item' | 'other'
  stats?: Record<string, number>  // e.g., {"hacking": 5, "combat": 2}
  quantity: number
  equipped?: boolean
  description?: string
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

export interface Postac {
  id: number
  nick: string
  kredyty: number
  street_cred: number
  user_id: string
  level?: number  // Player level (1-100)
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
