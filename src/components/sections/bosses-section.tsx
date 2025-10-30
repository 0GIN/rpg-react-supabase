import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skull, Swords, Crown, Trophy, AlertTriangle } from 'lucide-react'

const bosses = [
  {
    id: 1,
    name: 'Chrome Reaper',
    description: 'Cyborg zabójca kontrolujący przemysłową dzielnicę',
    level: 10,
    hp: 5000,
    rewards: {
      exp: 1000,
      credits: 2500,
      street_cred: 50,
      drops: ['Cyborg Parts', 'Advanced Chip', 'Reaper\'s Blade']
    },
    difficulty: 'medium',
    unlocked: true,
    defeated: false
  },
  {
    id: 2,
    name: 'Netrunner Phantom',
    description: 'Legendarny hacker który opanował Deep Net',
    level: 15,
    hp: 8000,
    rewards: {
      exp: 2000,
      credits: 5000,
      street_cred: 100,
      drops: ['Quantum Deck', 'Neural Uplink', 'Ghost Protocol']
    },
    difficulty: 'hard',
    unlocked: true,
    defeated: false
  },
  {
    id: 3,
    name: 'Steel Dragon',
    description: 'Potężny gang lord kontrolujący czarny rynek',
    level: 20,
    hp: 12000,
    rewards: {
      exp: 3500,
      credits: 10000,
      street_cred: 200,
      drops: ['Dragon Scale Armor', 'Golden SMG', 'Crime Lord\'s Ring']
    },
    difficulty: 'extreme',
    unlocked: false,
    defeated: false
  },
  {
    id: 4,
    name: 'NEMESIS Protocol',
    description: 'Zbuntowana AI sterująca systemami obronnymi miasta',
    level: 30,
    hp: 25000,
    rewards: {
      exp: 10000,
      credits: 50000,
      street_cred: 500,
      drops: ['AI Core', 'Quantum Processor', 'System Override Key']
    },
    difficulty: 'legendary',
    unlocked: false,
    defeated: false
  }
]

export function BossesSection() {
  const playerLevel = 7

  return (
    <div className="space-y-4">
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center gap-2">
            <Skull className="w-5 h-5" />
            WALKI Z BOSSAMI
          </CardTitle>
          <CardDescription>
            Zmierz się z najpotężniejszymi przeciwnikami w Neon City
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Warning */}
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-red-500 mb-1">OSTRZEŻENIE</p>
              <p className="text-muted-foreground">
                Walki z bossami są ekstremalne trudne i wymagają odpowiedniego przygotowania. 
                Upewnij się że masz najlepszy ekwipunek i pełną energię przed rozpoczęciem walki.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bosses.map(boss => {
              const canFight = playerLevel >= boss.level && boss.unlocked

              return (
                <Card 
                  key={boss.id}
                  className={`border ${
                    boss.defeated ? 'border-green-500/50 bg-green-500/5' :
                    canFight ? 'border-red-500/50' :
                    'border-muted'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {boss.defeated ? (
                            <Trophy className="w-6 h-6 text-green-500" />
                          ) : (
                            <Skull className="w-6 h-6 text-red-500" />
                          )}
                          <CardTitle className="text-xl font-mono">
                            {boss.name}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge 
                            variant="outline"
                            className={
                              boss.difficulty === 'medium' ? 'border-yellow-500 text-yellow-500' :
                              boss.difficulty === 'hard' ? 'border-orange-500 text-orange-500' :
                              boss.difficulty === 'extreme' ? 'border-red-500 text-red-500' :
                              'border-purple-500 text-purple-500'
                            }
                          >
                            {boss.difficulty === 'medium' && '●●'}
                            {boss.difficulty === 'hard' && '●●●'}
                            {boss.difficulty === 'extreme' && '●●●●'}
                            {boss.difficulty === 'legendary' && '●●●●●'}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            LVL {boss.level}
                          </Badge>
                          {boss.defeated && (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500">
                              ✓ Pokonany
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Crown className="w-8 h-8 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {boss.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-xs text-muted-foreground">HP</p>
                        <p className="font-mono text-red-500 font-bold">{boss.hp.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Poziom</p>
                        <p className="font-mono text-accent font-bold">{boss.level}</p>
                      </div>
                    </div>

                    {/* Rewards */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                        <Trophy className="w-3 h-3" />
                        Nagrody za pokonanie:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="bg-muted/50 px-2 py-1 rounded">
                          <span className="text-muted-foreground">EXP:</span>
                          <span className="ml-2 font-mono text-cyan">{boss.rewards.exp}</span>
                        </div>
                        <div className="bg-muted/50 px-2 py-1 rounded">
                          <span className="text-muted-foreground">Kredyty:</span>
                          <span className="ml-2 font-mono text-cyan">{boss.rewards.credits}</span>
                        </div>
                        <div className="bg-muted/50 px-2 py-1 rounded col-span-2">
                          <span className="text-muted-foreground">Street Cred:</span>
                          <span className="ml-2 font-mono text-magenta">{boss.rewards.street_cred}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Możliwe dropy:</p>
                        {boss.rewards.drops.map((drop, i) => (
                          <Badge key={i} variant="outline" className="text-xs mr-1">
                            {drop}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {boss.defeated ? (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        ✓ Już pokonany - Comeback za 24h
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={!canFight}
                        variant={canFight ? 'destructive' : 'outline'}
                      >
                        <Swords className="w-4 h-4 mr-2" />
                        {!boss.unlocked ? 'Zablokowany' :
                         playerLevel < boss.level ? `Wymaga lvl ${boss.level}` :
                         'Rozpocznij walkę'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
