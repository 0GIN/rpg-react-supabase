import { useEffect, useState, useRef } from 'react'
import { supabase } from '../services/supabaseClient'
import type { Postac, ZlecenieDefinicja, AktywneZlecenie } from '../types/gameTypes'

export default function Dashboard() {
  const [postac, setPostac] = useState<Postac | null>(null)
  const [zlecenia, setZlecenia] = useState<ZlecenieDefinicja[]>([])
  const [aktywne, setAktywne] = useState<AktywneZlecenie | null>(null)
  const [, forceRerender] = useState(0)
  const timerRef = useRef<number | null>(null)

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: postacData, error: postacError } = await supabase
      .from('postacie')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // Debug: log if we can't read the character (RLS / permissions / no row)
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
      forceRerender(n => n + 1)
    })
    return () => { sub.data.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (aktywne) {
      timerRef.current = window.setInterval(() => forceRerender(n => n + 1), 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [aktywne])

  async function startMission(zlecenieId: number) {
    const { error } = await supabase.functions.invoke('rozpocznij-zlecenie', {
      body: { zlecenie_id: zlecenieId }
    })
    if (error) {
      alert('Błąd: ' + error.message)
    } else {
      await loadData()
    }
  }

  async function collectReward() {
    // Capture full response for debugging (data, error, status)
    const res: any = await supabase.functions.invoke('odbierz-nagrode')
    console.log('odbierz-nagrode response:', res)
    // supabase.functions.invoke may return { data, error } or similar
    const { error } = res
    if (error) {
      // Show friendly alert and keep detailed object in console
      alert('Błąd przy odbieraniu nagrody: ' + (error.message || JSON.stringify(error)))
      return
    }
    // On success, reload data
    await loadData()
  }

  function getRemainingTime() {
    if (!aktywne) return null
    const end = new Date(aktywne.koniec_zlecenia_o).getTime()
    const now = Date.now()
    const diff = Math.max(0, Math.floor((end - now) / 1000))
    const mins = Math.floor(diff / 60)
    const secs = diff % 60
    return { total: diff, mins, secs }
  }

  const timeLeft = getRemainingTime()

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h2>Neon City — Dashboard</h2>
          {postac && <p><strong>{postac.nick}</strong> | Kredyty: {postac.kredyty} | Street Cred: {postac.street_cred}</p>}
        </div>
        <button onClick={() => supabase.auth.signOut()}>Wyloguj</button>
      </header>

      {aktywne ? (
        <div style={{ padding: '2rem', border: '2px solid cyan', marginTop: '2rem' }}>
          <h3>Misja w toku...</h3>
          {timeLeft && timeLeft.total > 0 ? (
            <p>Pozostało: {timeLeft.mins}m {timeLeft.secs}s</p>
          ) : (
            <div>
              <p>✅ Misja zakończona!</p>
              <button onClick={collectReward}>Odbierz nagrodę</button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <h3>Dostępne zlecenia:</h3>
          {zlecenia.map(z => (
            <div key={z.id} style={{ border: '1px solid gray', padding: '1rem', margin: '0.5rem 0' }}>
              <h4>{z.nazwa}</h4>
              <p>{z.opis}</p>
              <p>Czas: {z.czas_trwania_sekundy}s</p>
              <button onClick={() => startMission(z.id)}>Rozpocznij</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
