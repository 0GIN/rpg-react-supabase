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

export interface Postac {
  id: number
  nick: string
  kredyty: number
  street_cred: number
  user_id: string
  level?: number  // Player level (1-100)
  inventory?: InventoryItem[]  // JSONB array of items
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
