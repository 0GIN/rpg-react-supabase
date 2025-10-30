import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import type { Postac, ZlecenieDefinicja, AktywneZlecenie } from '../types/gameTypes'
import { GameHeader } from '@/components/game-header'
import { GameNavbar } from '@/components/game-navbar'
import { CharacterPanel } from '@/components/character-panel'
import { ResourceBar } from '@/components/resource-bar'
import { InventoryPanel } from '@/components/inventory-panel'
import { MissionsSection } from '@/components/sections/missions-section'
import { SkillsSection } from '@/components/sections/skills-section'
import { ArenaSection } from '@/components/sections/arena-section'
import { RankingsSection } from '@/components/sections/rankings-section'
import { GangsSection } from '@/components/sections/gangs-section'
import { DefaultSection } from '@/components/sections/default-section'
import { WardrobeSection } from '@/components/sections/wardrobe-section'

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

  useEffect(() => {
    loadData()
    const sub = supabase.auth.onAuthStateChange(() => {
      loadData()
    })
    return () => { sub.data.subscription.unsubscribe() }
  }, [])

  async function startMission(zlecenieId: number) {
    setLoading(true)
    const { error } = await supabase.functions.invoke('rozpocznij-zlecenie', {
      body: { zlecenie_id: zlecenieId }
    })
    if (error) {
      alert('Błąd: ' + error.message)
    } else {
      await loadData()
    }
    setLoading(false)
  }

  async function collectReward() {
    setLoading(true)
    const res: any = await supabase.functions.invoke('odbierz-nagrode')
    console.log('odbierz-nagrode response:', res)
    const { error } = res
    if (error) {
      alert('Błąd przy odbieraniu nagrody: ' + (error.message || JSON.stringify(error)))
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
        return <SkillsSection />
      case 'equipment':
      case 'items':
        return <InventoryPanel />
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
        <ResourceBar 
          energy={85}
          maxEnergy={100}
          neural={1250}
          maxNeural={2000}
          credits={postac?.kredyty || 0}
          rank={postac?.street_cred || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-4">
            <CharacterPanel postac={postac} onOpenWardrobe={() => setActiveSection('wardrobe')} />
            <InventoryPanel />
          </div>

          <div className="lg:col-span-2 space-y-4">{renderSection()}</div>
        </div>
      </main>
    </div>
  )
}
