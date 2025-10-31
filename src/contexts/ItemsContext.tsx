/**
 * ItemsContext.tsx - Globalny kontekst definicji przedmiotów
 * 
 * Zarządza globalnym stanem wszystkich definicji przedmiotów w grze.
 * Ładuje dane z tabeli 'items' w Supabase i zapewnia fallback do lokalnych definicji.
 * Wykorzystywany przez cały system inwentarza, sklepu i craftingu.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '@/services/supabaseClient'
import type { ItemDefinition } from '@/types/gameTypes'
import { ITEM_DEFINITIONS } from '@/data/items' // Fallback for DEV

interface ItemsContextType {
  items: Record<string, ItemDefinition>
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined)

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, ItemDefinition>>(ITEM_DEFINITIONS) // Start with fallback
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadItems() {
    try {
      setLoading(true)
      setError(null)

      // Pobierz session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        console.warn('⚠️ No session, using fallback items')
        setItems(ITEM_DEFINITIONS)
        setLoading(false)
        return
      }

      // Wywołaj Edge Function zamiast bezpośredniego query
      const { data: response, error: fetchError } = await supabase.functions.invoke('get-items', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (fetchError) throw fetchError

      if (response?.items && response.items.length > 0) {
        // Map DB items to ItemDefinition format
        // Edge Function już dostosował ścieżki do płci użytkownika
        const itemsMap: Record<string, ItemDefinition> = {}
        
        for (const dbItem of response.items) {
          itemsMap[dbItem.item_id] = {
            id: dbItem.item_id,
            name: dbItem.name,
            type: dbItem.type as ItemDefinition['type'],
            rarity: dbItem.rarity as ItemDefinition['rarity'],
            description: dbItem.description || undefined,
            imagePath: dbItem.image_path || undefined,
            clothingSlot: dbItem.clothing_slot as ItemDefinition['clothingSlot'] || undefined,
            clothingPath: dbItem.clothing_path || undefined,
            stats: dbItem.stats || undefined,
            price: dbItem.value || undefined,
            sellPrice: Math.floor((dbItem.value || 0) * 0.5) || undefined,
            stackable: dbItem.stackable || undefined,
            maxStack: dbItem.max_stack || undefined,
          }
        }

        setItems(itemsMap)
        console.log('✅ Loaded items from Edge Function (gender-adjusted):', Object.keys(itemsMap).length, `(${response.userGender})`)
      } else {
        // Fallback to static definitions if DB is empty
        console.warn('⚠️ No items from Edge Function, using fallback from items.ts')
        setItems(ITEM_DEFINITIONS)
      }
    } catch (err) {
      console.error('❌ Error loading items from Edge Function:', err)
      setError(err instanceof Error ? err.message : 'Failed to load items')
      // Keep fallback items on error
      setItems(ITEM_DEFINITIONS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  return (
    <ItemsContext.Provider value={{ items, loading, error, refetch: loadItems }}>
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const context = useContext(ItemsContext)
  if (context === undefined) {
    throw new Error('useItems must be used within ItemsProvider')
  }
  return context
}

// Helper functions using context
export function useItemDefinition(itemId: string): ItemDefinition | undefined {
  const { items } = useItems()
  return items[itemId]
}

export function useItemsByType(type: ItemDefinition['type']): ItemDefinition[] {
  const { items } = useItems()
  return Object.values(items).filter(item => item.type === type)
}

export function useClothingBySlot(slot: ItemDefinition['clothingSlot']): ItemDefinition[] {
  const { items } = useItems()
  return Object.values(items).filter(
    item => item.type === 'clothing' && item.clothingSlot === slot
  )
}
