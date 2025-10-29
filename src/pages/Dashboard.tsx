import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import type { Postac, ZlecenieDefinicja, AktywneZlecenie } from '../types/gameTypes'
import Layout from '../components/layout/Layout'
import MissionCard from '../components/dashboard/MissionCard'
import ActiveMission from '../components/dashboard/ActiveMission'
import './Dashboard.css'

export default function Dashboard() {
  const [postac, setPostac] = useState<Postac | null>(null)
  const [zlecenia, setZlecenia] = useState<ZlecenieDefinicja[]>([])
  const [aktywne, setAktywne] = useState<AktywneZlecenie | null>(null)
  const [loading, setLoading] = useState(false)

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

  // Find the full mission definition for the active mission
  const activeZlecenieDefinicja = aktywne 
    ? zlecenia.find(z => z.id === aktywne.zlecenie_id)
    : null

  return (
    <Layout 
      showUserInfo={!!postac}
      nick={postac?.nick}
      kredyty={postac?.kredyty}
      streetCred={postac?.street_cred}
    >
      <div className="dashboard-container">
        <h1 className="dashboard-title">Neon City — Dashboard</h1>
        
        {aktywne && activeZlecenieDefinicja ? (
          <ActiveMission
            aktywneZlecenie={aktywne}
            zlecenieDefinicja={activeZlecenieDefinicja}
            onClaim={collectReward}
            disabled={loading}
          />
        ) : (
          <div className="missions-section">
            <h2 className="section-title">Dostępne Zlecenia</h2>
            <div className="missions-grid">
              {zlecenia.map(z => (
                <MissionCard
                  key={z.id}
                  zlecenie={z}
                  onStart={startMission}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
