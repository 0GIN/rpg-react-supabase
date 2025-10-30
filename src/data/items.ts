import type { ItemDefinition } from '../types/gameTypes'

// Database of all available items in the game
export const ITEM_DEFINITIONS: Record<string, ItemDefinition> = {
  // ===== CLOTHING - TOPS =====
  'cyber_jacket_f': {
    id: 'cyber_jacket_f',
    name: 'Cyber Jacket',
    type: 'clothing',
    rarity: 'uncommon',
    description: 'Stylowa kurtka z wbudowanymi portami cybernetycznymi.',
    clothingSlot: 'top',
    imagePath: '/clothing/female/tops/cyber_jacket_f.png',  // Icon for inventory
    clothingPath: '/clothing/female/tops/cyber_jacket_f.png',  // Overlay for mannequin
    stats: { defense: 5, style: 10 },
    price: 500,
    sellPrice: 200,
  },
  'tactical_vest': {
    id: 'tactical_vest',
    name: 'Tactical Vest',
    type: 'clothing',
    rarity: 'rare',
    description: 'Wzmocniona kamizelka taktyczna z kieszeniami na amunicję.',
    clothingSlot: 'top',
    imagePath: '/clothing/female/tops/tactical_vest.png',
    clothingPath: '/clothing/female/tops/tactical_vest.png',
    stats: { defense: 15, combat: 5 },
    price: 1200,
    sellPrice: 500,
  },

  // ===== CLOTHING - BOTTOMS =====
  'cargo_pants': {
    id: 'cargo_pants',
    name: 'Cargo Pants',
    type: 'clothing',
    rarity: 'common',
    description: 'Wygodne spodnie cargo z wieloma kieszeniami.',
    clothingSlot: 'bottom',
    imagePath: '/clothing/female/bottoms/cargo_pants.png',
    clothingPath: '/clothing/female/bottoms/cargo_pants.png',
    stats: { defense: 3 },
    price: 300,
    sellPrice: 100,
  },
  'armored_jeans': {
    id: 'armored_jeans',
    name: 'Armored Jeans',
    type: 'clothing',
    rarity: 'uncommon',
    description: 'Dżinsy wzmocnione kevlarową wyściółką.',
    clothingSlot: 'bottom',
    imagePath: '/clothing/female/bottoms/armored_jeans.png',
    clothingPath: '/clothing/female/bottoms/armored_jeans.png',
    stats: { defense: 8, style: 5 },
    price: 600,
    sellPrice: 250,
  },
  'cyber_pants_f': {
    id: 'cyber_pants_f',
    name: 'Cyber Pants',
    type: 'clothing',
    rarity: 'uncommon',
    description: 'Dżinsy wzmocnione kevlarową wyściółką.',
    clothingSlot: 'bottom',
    imagePath: '/clothing/female/bottoms/cyber_pants_f.png',
    clothingPath: '/clothing/female/bottoms/cyber_pants_f.png',
    stats: { defense: 8, style: 5 },
    price: 600,
    sellPrice: 250,
  },

  // ===== CLOTHING - SHOES =====
  'combat_boots': {
    id: 'combat_boots',
    name: 'Combat Boots',
    type: 'clothing',
    rarity: 'common',
    description: 'Solidne buty bojowe, idealne do akcji.',
    clothingSlot: 'shoes',
    imagePath: '/clothing/female/shoes/combat_boots.png',
    clothingPath: '/clothing/female/shoes/combat_boots.png',
    stats: { defense: 5, mobility: 5 },
    price: 400,
    sellPrice: 150,
  },
  'stealth_sneakers': {
    id: 'stealth_sneakers',
    name: 'Stealth Sneakers',
    type: 'clothing',
    rarity: 'rare',
    description: 'Buty ze specjalną podeszwą tłumiącą dźwięk.',
    clothingSlot: 'shoes',
    imagePath: '/clothing/female/shoes/stealth_sneakers.png',
    clothingPath: '/clothing/female/shoes/stealth_sneakers.png',
    stats: { mobility: 15, stealth: 10 },
    price: 1000,
    sellPrice: 400,
  },

  // ===== CLOTHING - ACCESSORIES =====
  'smart_glasses': {
    id: 'smart_glasses',
    name: 'Smart Glasses',
    type: 'clothing',
    rarity: 'uncommon',
    description: 'Okulary z wyświetlaczem AR i skanowaniem otoczenia.',
    clothingSlot: 'accessory',
    imagePath: '/clothing/female/accessories/smart_glasses.png',
    clothingPath: '/clothing/female/accessories/smart_glasses.png',
    stats: { hacking: 10, perception: 5 },
    price: 800,
    sellPrice: 300,
  },
  'neural_link': {
    id: 'neural_link',
    name: 'Neural Link',
    type: 'clothing',
    rarity: 'epic',
    description: 'Zaawansowany interfejs neuralny umożliwiający szybkie hakowanie.',
    clothingSlot: 'accessory',
    imagePath: '/clothing/female/accessories/neural_link.png',
    clothingPath: '/clothing/female/accessories/neural_link.png',
    stats: { hacking: 20, intelligence: 10 },
    price: 2500,
    sellPrice: 1000,
  },

  // ===== CLOTHING - IMPLANTS =====
  'basic_cyberarm': {
    id: 'basic_cyberarm',
    name: 'Basic Cyberarm',
    type: 'clothing',
    rarity: 'uncommon',
    description: 'Podstawowy implant ramienia zwiększający siłę.',
    clothingSlot: 'implant',
    imagePath: '/clothing/female/implants/basic_cyberarm.png',
    clothingPath: '/clothing/female/implants/basic_cyberarm.png',
    stats: { strength: 10, combat: 5 },
    price: 1500,
    sellPrice: 600,
  },
  'military_cyberarm': {
    id: 'military_cyberarm',
    name: 'Military Cyberarm',
    type: 'clothing',
    rarity: 'legendary',
    description: 'Wojskowy implant ramienia z wbudowanym uzbrojeniem.',
    clothingSlot: 'implant',
    imagePath: '/clothing/female/implants/military_cyberarm.png',
    clothingPath: '/clothing/female/implants/military_cyberarm.png',
    stats: { strength: 25, combat: 20, defense: 10 },
    price: 5000,
    sellPrice: 2000,
  },

  // ===== WEAPONS =====
  'pistol_9mm': {
    id: 'pistol_9mm',
    name: 'Pistol 9mm',
    type: 'weapon',
    rarity: 'common',
    description: 'Standardowy pistolet 9mm.',
    stats: { combat: 10, damage: 15 },
    price: 500,
    sellPrice: 200,
  },
  'plasma_rifle': {
    id: 'plasma_rifle',
    name: 'Plasma Rifle',
    type: 'weapon',
    rarity: 'epic',
    description: 'Zaawansowany karabin plazmowy.',
    stats: { combat: 25, damage: 50 },
    price: 3000,
    sellPrice: 1200,
  },

  // ===== CONSUMABLES =====
  'medkit': {
    id: 'medkit',
    name: 'Medkit',
    type: 'consumable',
    rarity: 'common',
    description: 'Apteczka przywracająca zdrowie.',
    stackable: true,
    maxStack: 99,
    price: 100,
    sellPrice: 30,
  },
  'energy_drink': {
    id: 'energy_drink',
    name: 'Energy Drink',
    type: 'consumable',
    rarity: 'common',
    description: 'Napój energetyczny zwiększający stamina.',
    stackable: true,
    maxStack: 99,
    price: 50,
    sellPrice: 15,
  },
  'stimpack': {
    id: 'stimpack',
    name: 'Stimpack',
    type: 'consumable',
    rarity: 'uncommon',
    description: 'Stymulator medyczny natychmiastowo przywracający zdrowie.',
    stackable: true,
    maxStack: 50,
    price: 250,
    sellPrice: 80,
  },

  // ===== MATERIALS =====
  'scrap_metal': {
    id: 'scrap_metal',
    name: 'Scrap Metal',
    type: 'material',
    rarity: 'common',
    description: 'Złom metalowy przydatny do craftingu.',
    stackable: true,
    maxStack: 999,
    price: 10,
    sellPrice: 3,
  },
  'electronics': {
    id: 'electronics',
    name: 'Electronics',
    type: 'material',
    rarity: 'uncommon',
    description: 'Komponenty elektroniczne.',
    stackable: true,
    maxStack: 999,
    price: 50,
    sellPrice: 15,
  },
  'rare_crystal': {
    id: 'rare_crystal',
    name: 'Rare Crystal',
    type: 'material',
    rarity: 'rare',
    description: 'Rzadki kryształ używany w zaawansowanej technologii.',
    stackable: true,
    maxStack: 99,
    price: 500,
    sellPrice: 200,
  },

  // ===== QUEST ITEMS =====
  'data_chip': {
    id: 'data_chip',
    name: 'Data Chip',
    type: 'quest_item',
    rarity: 'uncommon',
    description: 'Chip z zaszyfrowanymi danymi.',
    price: 0,  // Quest items usually can't be bought
    sellPrice: 0,  // And can't be sold
  },
}

// Helper function to get item by ID
export function getItemDefinition(itemId: string): ItemDefinition | undefined {
  return ITEM_DEFINITIONS[itemId]
}

// Helper function to get all items of a specific type
export function getItemsByType(type: ItemDefinition['type']): ItemDefinition[] {
  return Object.values(ITEM_DEFINITIONS).filter(item => item.type === type)
}

// Helper function to get all clothing items for a specific slot
export function getClothingBySlot(slot: ItemDefinition['clothingSlot']): ItemDefinition[] {
  return Object.values(ITEM_DEFINITIONS).filter(
    item => item.type === 'clothing' && item.clothingSlot === slot
  )
}

// Rarity colors for UI
export const RARITY_COLORS: Record<ItemDefinition['rarity'], string> = {
  common: 'text-gray-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-orange-400',
}
