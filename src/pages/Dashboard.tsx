import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import type { Postac, ZlecenieDefinicja, AktywneZlecenie } from '../types/gameTypes'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Trophy, Zap, LogOut } from 'lucide-react'

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#16213e] to-[#1a1a2e] text-white">
      {/* Header */}
      <header className="border-b border-cyan/30 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">
                NEON CITY
              </h1>
              <p className="text-sm text-muted-foreground">Cyberpunk RPG Dashboard</p>
            </div>
            
            {postac && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Runner</p>
                    <p className="font-bold text-cyan">{postac.nick}</p>
                  </div>
                  <div className="h-10 w-px bg-border"></div>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-cyan/10 px-3 py-1.5 rounded-full border border-cyan/30">
                      <Zap className="w-4 h-4 text-cyan" />
                      <span className="font-bold text-cyan">{postac.kredyty}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-magenta/10 px-3 py-1.5 rounded-full border border-magenta/30">
                      <Trophy className="w-4 h-4 text-magenta" />
                      <span className="font-bold text-magenta">{postac.street_cred}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {aktywne && activeZlecenieDefinicja ? (
          <ActiveMissionCard 
            aktywne={aktywne}
            zlecenie={activeZlecenieDefinicja}
            onClaim={collectReward}
            loading={loading}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Dostępne Zlecenia</h2>
              <p className="text-muted-foreground">Wybierz zlecenie i zacznij zarabiać w Neon City</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zlecenia.map(z => (
                <MissionCardComponent
                  key={z.id}
                  zlecenie={z}
                  onStart={startMission}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Active Mission Component
function ActiveMissionCard({ 
  aktywne, 
  zlecenie, 
  onClaim, 
  loading 
}: { 
  aktywne: AktywneZlecenie
  zlecenie: ZlecenieDefinicja
  onClaim: () => void
  loading: boolean
}) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const calculateTime = () => {
      const end = new Date(aktywne.koniec_zlecenia_o).getTime()
      const now = Date.now()
      const diff = Math.max(0, end - now)
      setTimeLeft(diff)
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [aktywne])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const isComplete = timeLeft === 0
  const progress = 100 - (timeLeft / (zlecenie.czas_trwania_sekundy * 1000)) * 100

  return (
    <Card className="border-magenta/50 bg-gradient-to-br from-magenta/10 to-cyan/10 shadow-xl shadow-magenta/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-magenta">🔴 Aktywne Zlecenie</CardTitle>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-cyan/20 text-cyan'}`}>
            {isComplete ? '✓ Ukończone' : '⟳ W trakcie'}
          </div>
        </div>
        <CardDescription className="text-lg font-semibold text-cyan mt-2">
          {zlecenie.nazwa}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{zlecenie.opis}</p>
        
        {/* Timer */}
        <div className="bg-black/40 rounded-lg p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Pozostały czas</p>
          <p className={`text-5xl font-mono font-bold ${isComplete ? 'text-green-400' : 'text-cyan'}`}>
            {formatTime(timeLeft)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-magenta to-cyan transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-2 bg-cyan/10 px-4 py-2 rounded-lg border border-cyan/30">
            <Zap className="w-5 h-5 text-cyan" />
            <span className="font-bold">+{zlecenie.nagrody.kredyty || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-magenta/10 px-4 py-2 rounded-lg border border-magenta/30">
            <Trophy className="w-5 h-5 text-magenta" />
            <span className="font-bold">+{zlecenie.nagrody.street_cred || 0}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          size="lg" 
          className="w-full text-lg" 
          onClick={onClaim}
          disabled={!isComplete || loading}
        >
          {isComplete ? 'Odbierz Nagrodę' : 'Oczekiwanie na ukończenie...'}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Mission Card Component
function MissionCardComponent({ 
  zlecenie, 
  onStart, 
  loading 
}: { 
  zlecenie: ZlecenieDefinicja
  onStart: (id: number) => void
  loading: boolean
}) {
  const durationMinutes = Math.ceil(zlecenie.czas_trwania_sekundy / 60)

  return (
    <Card className="border-cyan/30 hover:border-cyan transition-all hover:shadow-xl hover:shadow-cyan/20 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-cyan">{zlecenie.nazwa}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          {durationMinutes} min
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{zlecenie.opis}</p>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-cyan/10 px-3 py-1.5 rounded-md border border-cyan/30 text-sm">
            <Zap className="w-4 h-4 text-cyan" />
            <span className="font-bold">+{zlecenie.nagrody.kredyty || 0}</span>
          </div>
          <div className="flex items-center gap-2 bg-magenta/10 px-3 py-1.5 rounded-md border border-magenta/30 text-sm">
            <Trophy className="w-4 h-4 text-magenta" />
            <span className="font-bold">+{zlecenie.nagrody.street_cred || 0}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full" 
          onClick={() => onStart(zlecenie.id)}
          disabled={loading}
        >
          Rozpocznij Zlecenie
        </Button>
      </CardFooter>
    </Card>
  )
}
