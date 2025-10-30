import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import type { Postac, ZlecenieDefinicja, AktywneZlecenie, CharacterStats } from '../types/gameTypes'
import * as secureApi from '@/services/secureApi'
import { GameHeader } from '@/components/game-header'
import { GameNavbar } from '@/components/game-navbar'
import { CharacterPanel } from '@/components/character-panel'
import { ResourceBar } from '@/components/resource-bar'
import { InventoryPanel } from '@/components/inventory-panel'
import { MissionsSection } from '@/components/sections/missions-section'
import { ArenaSection } from '@/components/sections/arena-section'
import { RankingsSection } from '@/components/sections/rankings-section'
import { GangsSection } from '@/components/sections/gangs-section'
import { DefaultSection } from '@/components/sections/default-section'
import { WardrobeSection } from '@/components/sections/wardrobe-section'
import { StatsManagement } from '@/components/stats-management'

export default function DashboardNew() {
  const [postac, setPostac] = useState<Postac | null>(null)
  const [zlecenia, setZlecenia] = useState<ZlecenieDefinicja[]>([])
  const [aktywne, setAktywne] = useState<AktywneZlecenie | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('missions')

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: postacData, error: postacError } = await supabase
      .from('postacie')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('loadData postacie:', { userId: user.id, postacData, postacError })

    if (postacData) {
      setPostac(postacData)
      
      const { data: zleceniaData } = await supabase.from('zlecenia_definicje').select('*')
      setZlecenia(zleceniaData || [])
      
      const { data: aktywneData } = await supabase
        .from('aktywne_zlecenia')
        .select('*')
        .eq('postac_id', postacData.id)
        .maybeSingle()
      setAktywne(aktywneData)
    }
  }

  // Handle equipping clothing items - SECURE VERSION (calls Edge Function)
  async function handleEquipItem(itemId: string) {
    if (!postac) return

    const result = await secureApi.equipItem(itemId, 'equip')

    if (!result.success) {
      console.error('Error equipping item:', result.error)
      alert('❌ Błąd: ' + result.error)
    } else if (result.data) {
      setPostac(result.data as Postac)
      alert(`✅ ${result.message || 'Przedmiot założony!'}`)
    }
  }

  // Handle unequipping clothing items - SECURE VERSION (calls Edge Function)
  async function handleUnequipItem(itemId: string) {
    if (!postac) return

    const result = await secureApi.equipItem(itemId, 'unequip')

    if (!result.success) {
      console.error('Error unequipping item:', result.error)
      alert('❌ Błąd: ' + result.error)
    } else if (result.data) {
      setPostac(result.data as Postac)
      alert(`✅ ${result.message || 'Przedmiot zdjęty!'}`)
    }
  }

  // Handle using consumable items - SECURE VERSION (calls Edge Function)
  async function handleUseItem(itemId: string) {
    if (!postac) return

    const result = await secureApi.useItem(itemId)

    if (!result.success) {
      console.error('Error using item:', result.error)
      alert('❌ Błąd: ' + result.error)
    } else if (result.data) {
      setPostac(result.data as Postac)
      alert(`✅ ${result.message || 'Przedmiot użyty!'}`)
    }
  }

  // DEV HELPER: Add test items
  async function devAddTestItems() {
    if (!postac) return
    
    const { addMultipleItems } = await import('@/utils/inventory')
    const result = await addMultipleItems(postac.id, [
      { itemId: 'cyber_jacket_f', quantity: 1 },
      { itemId: 'tactical_vest', quantity: 1 },
      { itemId: 'plasma_rifle', quantity: 1 },
      { itemId: 'smart_glasses', quantity: 1 },
      { itemId: 'military_cyberarm', quantity: 1 },
      { itemId: 'stimpack', quantity: 10 },
      { itemId: 'rare_crystal', quantity: 5 },
    ])
    
    if (result.success) {
      await loadData() // Reload to see new items
      alert('✅ Dodano przedmioty testowe!')
    } else {
      alert('❌ Błąd: ' + result.error)
    }
  }

  // DEV HELPER: Add ALL items for testing
  async function devAddAllItems() {
    if (!postac) return
    
    const { giveAllItemsForTesting } = await import('@/utils/inventory')
    await giveAllItemsForTesting(postac.id)
    await loadData()
    alert('✅ Dodano WSZYSTKIE przedmioty!')
  }

  // Handle stat increase - SECURE VERSION (calls Edge Function)
  async function handleStatIncrease(stat: keyof CharacterStats) {
    if (!postac || !postac.stat_points || postac.stat_points <= 0) {
      alert('❌ Brak dostępnych punktów statystyk!')
      return
    }

    const result = await secureApi.increaseStat(stat)

    if (!result.success) {
      console.error('Error increasing stat:', result.error)
      alert('❌ Błąd: ' + result.error)
    } else if (result.data) {
      setPostac(result.data as Postac)
      alert(`✅ ${stat.toUpperCase()} zwiększone! ${result.message || ''}`)
    }
  }

  useEffect(() => {
    loadData()
    const sub = supabase.auth.onAuthStateChange(() => {
      loadData()
    })
    return () => { sub.data.subscription.unsubscribe() }
  }, [])

  async function startMission(zlecenieId: number) {
    setLoading(true)
    const result = await secureApi.rozpocznijZlecenie(zlecenieId)
    if (!result.success) {
      alert('Błąd startu zlecenia: ' + (result.error || 'Request failed'))
    } else {
      await loadData()
    }
    setLoading(false)
  }

  async function collectReward() {
    setLoading(true)
    const result = await secureApi.odbierjNagrode(0)
    // Note: backend ignores payload and uses auth.uid(); 0 is a placeholder
    if (!result.success) {
      alert('Błąd przy odbieraniu nagrody: ' + (result.error || 'Request failed'))
    } else {
      await loadData()
    }
    setLoading(false)
  }

  async function saveWardrobe(payload: { appearance: Postac['appearance']; clothing: Postac['clothing'] }) {
    if (!postac) return
    setLoading(true)
    const { data, error } = await supabase
      .from('postacie')
      .update({ appearance: payload.appearance, clothing: payload.clothing })
      .eq('id', postac.id)
      .select('*')
      .maybeSingle()
    if (error) {
      const msg = error.message || ''
      if (msg.includes("Could not find the 'clothing' column")) {
        alert("Błąd zapisu garderoby: brak kolumny 'clothing' w tabeli 'postacie'. Uruchom migrację dodającą kolumny appearance/clothing (z repo: supabase/migrations/20251030000001_add_character_customization.sql) lub wykonaj odpowiednie ALTER TABLE w bazie.")
      } else if (msg.includes("Could not find the 'appearance' column")) {
        alert("Błąd zapisu garderoby: brak kolumny 'appearance' w tabeli 'postacie'. Uruchom migrację dodającą kolumny appearance/clothing.")
      } else {
        alert('Błąd zapisu garderoby: ' + msg)
      }
    } else if (data) {
      setPostac(data)
    }
    setLoading(false)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'missions':
        return <MissionsSection 
          zlecenia={zlecenia}
          aktywne={aktywne}
          onStartMission={startMission}
          onCollectReward={collectReward}
          loading={loading}
        />
      case 'arena':
        return <ArenaSection />
      case 'bosses':
        return <DefaultSection />
      case 'skills':
      case 'stats':
        return postac ? (
          <StatsManagement 
            postac={postac} 
            onStatIncrease={handleStatIncrease}
          />
        ) : null
      case 'equipment':
      case 'items':
      case 'inventory':
        return postac ? (
          <InventoryPanel 
            postac={postac} 
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onUseItem={handleUseItem}
          />
        ) : null
      case 'rankings':
        return <RankingsSection />
      case 'wardrobe':
        return (
          <WardrobeSection 
            postac={postac}
            onSave={saveWardrobe}
            onBack={() => setActiveSection('missions')}
          />
        )
      case 'my-gang':
      case 'gang-list':
      case 'gang-wars':
      case 'territory':
      case 'gangs':
        return <GangsSection />
      default:
        return <DefaultSection />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GameHeader />
      <GameNavbar onNavigate={setActiveSection} />

      <main className="container mx-auto p-4 space-y-4">
        {/* DEV TOOLS - Remove in production */}
        {import.meta.env.DEV && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded p-2 flex flex-wrap gap-2">
            <button
              onClick={devAddTestItems}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-xs rounded"
            >
              [DEV] Dodaj przedmioty testowe
            </button>
            <button
              onClick={devAddAllItems}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-xs rounded"
            >
              [DEV] Dodaj WSZYSTKIE przedmioty
            </button>
            <button
              onClick={async () => {
                if (!postac) return
                const { devGiveExp } = await import('@/utils/experience')
                const result = await devGiveExp(postac.id, 1000)
                if (result.success) {
                  await loadData()
                  if (result.leveledUp) {
                    alert(`🎉 LEVEL UP! Nowy poziom: ${result.newLevel}!`)
                  } else {
                    alert('✅ Dodano 1000 EXP')
                  }
                } else {
                  alert('❌ Błąd: ' + result.error)
                }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded"
            >
              [DEV] Dodaj 1000 EXP
            </button>
          </div>
        )}

        <ResourceBar 
          energy={85}
          maxEnergy={100}
          neural={1250}
          maxNeural={2000}
          credits={postac?.kredyty || 0}
          street_cred={postac?.street_cred || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <CharacterPanel postac={postac} onOpenWardrobe={() => setActiveSection('wardrobe')} />
            {activeSection !== 'inventory' && postac && (
              <InventoryPanel 
                postac={postac} 
                onEquipItem={handleEquipItem}
                onUnequipItem={handleUnequipItem}
                onUseItem={handleUseItem}
              />
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">{renderSection()}</div>
        </div>
      </main>
    </div>
  )
}
