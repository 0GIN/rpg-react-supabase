import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Users, Swords, MapPin, Trophy, TrendingUp } from 'lucide-react'

const myGang = {
  name: 'Cyber Phantoms',
  members: 12,
  level: 5,
  reputation: 2450,
  territory: 3,
  rank: 15,
  perks: [
    { name: '+10% EXP', active: true },
    { name: '+5% Credits', active: true },
    { name: 'Gang Warehouse', active: true }
  ]
}

const gangMembers = [
  { id: 1, nick: 'ShadowRunner', level: 15, role: 'Lider', contribution: 1200, online: true },
  { id: 2, nick: 'NetCrawler', level: 12, role: 'Vice', contribution: 950, online: true },
  { id: 3, nick: 'ChromeKnight', level: 10, role: 'Członek', contribution: 650, online: false },
  { id: 4, nick: 'NeonGhost', level: 8, role: 'Członek', contribution: 420, online: true },
  { id: 5, nick: 'DataThief', level: 7, role: 'Członek', contribution: 380, online: false }
]

const gangWars = [
  {
    id: 1,
    opponent: 'Street Samurai',
    status: 'active',
    timeLeft: 3600,
    ourScore: 45,
    theirScore: 38,
    reward: 5000
  },
  {
    id: 2,
    opponent: 'Neon Raiders',
    status: 'scheduled',
    startsIn: 7200,
    reward: 7500
  }
]

export function GangSection() {
  return (
    <div className="space-y-4">
      {/* Gang Info */}
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-accent font-mono flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {myGang.name}
              </CardTitle>
              <CardDescription>
                Twój gang w Neon City
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              #{myGang.rank}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 p-3 rounded">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Users className="w-3 h-3" />
                Członkowie
              </div>
              <p className="font-mono text-xl text-accent">{myGang.members}/50</p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                Poziom Gangu
              </div>
              <p className="font-mono text-xl text-cyan">{myGang.level}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <Trophy className="w-3 h-3" />
                Reputacja
              </div>
              <p className="font-mono text-xl text-magenta">{myGang.reputation}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                <MapPin className="w-3 h-3" />
                Terytoria
              </div>
              <p className="font-mono text-xl text-yellow-500">{myGang.territory}</p>
            </div>
          </div>

          {/* Gang perks */}
          <div className="mb-6">
            <h3 className="text-sm font-mono text-muted-foreground mb-2">AKTYWNE BONUSY GANGU:</h3>
            <div className="flex flex-wrap gap-2">
              {myGang.perks.map((perk, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  ✓ {perk.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Users className="w-4 h-4 mr-2" />
              Zaproś gracza
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Swords className="w-4 h-4 mr-2" />
              Wypowiedz wojnę
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gang Wars */}
      <Card className="bg-card border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-500 font-mono flex items-center gap-2">
            <Swords className="w-5 h-5" />
            WOJNY GANGÓW
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gangWars.map(war => (
            <Card key={war.id} className={`border ${war.status === 'active' ? 'border-red-500' : 'border-yellow-500'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold">{myGang.name} vs {war.opponent}</p>
                    <Badge variant={war.status === 'active' ? 'destructive' : 'secondary'} className="text-xs mt-1">
                      {war.status === 'active' ? 'W trakcie' : 'Zaplanowana'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Nagroda</p>
                    <p className="font-mono text-cyan">{war.reward} ⚡</p>
                  </div>
                </div>

                {war.status === 'active' && war.ourScore !== undefined && war.theirScore !== undefined && war.timeLeft !== undefined ? (
                  <>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-mono text-cyan">{war.ourScore}</span>
                      <span className="text-muted-foreground">VS</span>
                      <span className="font-mono text-red-500">{war.theirScore}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-cyan transition-all"
                        style={{ width: `${(war.ourScore / (war.ourScore + war.theirScore)) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Pozostało: {Math.floor(war.timeLeft / 60)}m {war.timeLeft % 60}s
                    </p>
                  </>
                ) : war.startsIn !== undefined ? (
                  <p className="text-xs text-muted-foreground text-center">
                    Rozpoczyna się za: {Math.floor(war.startsIn / 3600)}h {Math.floor((war.startsIn % 3600) / 60)}m
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Members */}
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            CZŁONKOWIE GANGU
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gangMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${member.online ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <div>
                    <p className="font-mono text-sm">{member.nick}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        LVL {member.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Wkład</p>
                  <p className="font-mono text-xs text-accent">{member.contribution}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
