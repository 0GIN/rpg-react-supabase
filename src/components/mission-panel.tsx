import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Trophy } from "lucide-react"
import type { ZlecenieDefinicja, AktywneZlecenie } from '@/types/gameTypes'
import { useEffect, useState } from 'react'

interface MissionPanelProps {
  zlecenia: ZlecenieDefinicja[]
  aktywne: AktywneZlecenie | null
  onStartMission: (id: number) => void
  onCollectReward: () => void
  loading: boolean
}

export function MissionPanel({ zlecenia, aktywne, onStartMission, onCollectReward, loading }: MissionPanelProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  
  useEffect(() => {
    if (!aktywne) return
    
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
    return `${hours}h ${minutes}m ${seconds}s`
  }
  
  const isComplete = timeLeft === 0
  
  return (
    <Card className="bg-card border-secondary/30">
      <CardHeader>
        <CardTitle className="text-secondary font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          DOSTĘPNE ZLECENIA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {zlecenia.map((zlecenie) => {
          const isActive = aktywne?.zlecenie_id === zlecenie.id
          const durationMinutes = Math.ceil(zlecenie.czas_trwania_sekundy / 60)
          
          return (
          <div key={zlecenie.id} className="bg-muted/50 border border-border p-4 rounded-sm space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-foreground font-mono mb-1">{zlecenie.nazwa}</h4>
                <p className="text-sm text-muted-foreground mb-2">{zlecenie.opis}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Clock className="h-3 w-3" />
                    {durationMinutes}m
                  </div>
                  <div className="flex items-center gap-1 text-xs text-secondary font-mono">
                    <DollarSign className="h-3 w-3" />
                    +{zlecenie.nagrody.kredyty || 0}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary font-mono">
                    <Trophy className="h-3 w-3" />
                    +{zlecenie.nagrody.street_cred || 0}
                  </div>
                </div>
              </div>
              {isActive ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="font-mono"
                  onClick={onCollectReward}
                  disabled={!isComplete || loading}
                >
                  {isComplete ? 'ODBIERZ' : formatTime(timeLeft)}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  className="font-mono"
                  onClick={() => onStartMission(zlecenie.id)}
                  disabled={loading || !!aktywne}
                >
                  START
                </Button>
              )}
            </div>
          </div>
        )})}
      </CardContent>
    </Card>
  )
}
