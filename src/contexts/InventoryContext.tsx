import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '@/services/supabaseClient'
import type { InventoryItem } from '@/types/gameTypes'

interface InventoryContextType {
  inventory: InventoryItem[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children, postacId }: { children: ReactNode; postacId?: number }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadInventory() {
    if (!postacId) {
      setInventory([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Try loading from ekwipunek table first
      const { data: ekwipunekData, error: ekwipunekError } = await supabase
        .from('ekwipunek')
        .select('*')
        .eq('postac_id', postacId)

      if (ekwipunekError) {
        // Check if table doesn't exist (code 42P01) or other permission error
        const tableNotFound = ekwipunekError.code === '42P01' || ekwipunekError.message.includes('does not exist')
        
        if (tableNotFound) {
          console.warn('⚠️ Ekwipunek table not found, falling back to JSON inventory:', ekwipunekError)
          
          // Fallback to postacie.inventory JSON
          const { data: postacData, error: postacError } = await supabase
            .from('postacie')
            .select('inventory')
            .eq('id', postacId)
            .single()

          if (postacError) throw postacError

          const jsonInventory = (postacData?.inventory || []) as InventoryItem[]
          setInventory(jsonInventory)
          console.log('✅ Loaded inventory from JSON fallback:', jsonInventory.length, 'items')
        } else {
          // Other error, rethrow
          throw ekwipunekError
        }
      } else {
        // Map ekwipunek table to InventoryItem format
        const inventoryItems: InventoryItem[] = ekwipunekData.map(row => ({
          itemId: row.item_id,
          quantity: row.ilosc,
          equipped: row.zalozony,
          obtainedAt: row.created_at
        }))

        setInventory(inventoryItems)
        console.log('✅ Loaded inventory from ekwipunek table:', inventoryItems.length, 'items')
      }
    } catch (err) {
      console.error('❌ Error loading inventory:', err)
      setError(err instanceof Error ? err.message : 'Failed to load inventory')
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [postacId])

  // Listen for inventory changes event
  useEffect(() => {
    const handleInventoryChange = () => {
      console.log('🔄 Inventory changed event received, reloading...')
      loadInventory()
    }

    window.addEventListener('inventory-changed', handleInventoryChange)
    return () => window.removeEventListener('inventory-changed', handleInventoryChange)
  }, [postacId])

  return (
    <InventoryContext.Provider value={{ inventory, loading, error, refetch: loadInventory }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}
