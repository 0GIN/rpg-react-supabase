import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Trophy, Calendar, Star } from "lucide-react"
import type { Postac } from "@/types/gameTypes"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postac: Postac | null
}

export function ProfileModal({ open, onOpenChange, postac }: ProfileModalProps) {
  if (!postac) return null

  const joinDate = new Date(postac.created_at || '').toLocaleDateString('pl-PL')
  const totalStats = Object.values(postac.stats || {}).reduce((sum: number, val) => sum + (val as number), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-accent">
            <User className="inline-block w-6 h-6 mr-2" />
            PROFIL GRACZA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Character Info */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-mono text-primary">{postac.nick}</h3>
                <Badge variant="outline" className="text-accent border-accent">
                  POZIOM {postac.level || 1}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Doświadczenie</p>
                  <p className="font-mono text-primary">{postac.experience || 0} / {Math.floor(100 * Math.pow(postac.level || 1, 1.5))} EXP</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Punkty statystyk</p>
                  <p className="font-mono text-yellow-400">{postac.stat_points || 0} dostępnych</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kredyty</p>
                  <p className="font-mono text-green-400">{postac.kredyty} ¤</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Street Cred</p>
                  <p className="font-mono text-purple-400">{postac.street_cred || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                STATYSTYKI
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(postac.stats || {}).map(([stat, value]) => (
                  <div key={stat} className="bg-background/50 rounded p-2 text-center">
                    <p className="text-xs text-muted-foreground uppercase">{stat}</p>
                    <p className="text-lg font-mono text-primary">{value as number}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                Suma statystyk: <span className="text-primary font-mono">{totalStats}</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                INFORMACJE O KONCIE
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data dołączenia:</span>
                  <span className="font-mono">{joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID postaci:</span>
                  <span className="font-mono text-xs text-muted-foreground">{postac.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements (mockup) */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                OSIĄGNIĘCIA
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Pierwszy Krok', unlocked: true },
                  { name: 'Łowca Nagród', unlocked: (postac.level || 1) >= 5 },
                  { name: 'Weteran', unlocked: (postac.level || 1) >= 10 },
                  { name: 'Legenda', unlocked: (postac.level || 1) >= 20 },
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded border flex items-center justify-center text-xs text-center p-2 ${
                      achievement.unlocked
                        ? 'bg-accent/20 border-accent text-accent'
                        : 'bg-muted border-border text-muted-foreground opacity-50'
                    }`}
                    title={achievement.name}
                  >
                    <Trophy className={`w-6 h-6 ${achievement.unlocked ? '' : 'opacity-30'}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
