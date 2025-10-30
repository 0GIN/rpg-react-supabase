import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cpu, Zap, Eye, Skull, Lock, TrendingUp } from 'lucide-react'

const augmentations = [
  {
    id: 1,
    name: 'Neural Link',
    description: 'Bezpośrednie połączenie z siecią',
    slot: 'brain',
    level: 5,
    installed: true,
    bonus: { intelligence: 5, hacking: 10 },
    cost: 5000
  },
  {
    id: 2,
    name: 'Cybereyes MK-II',
    description: 'Ulepszone oczy z trybem nocnym',
    slot: 'eyes',
    level: 8,
    installed: false,
    bonus: { agility: 3, critChance: 5 },
    cost: 8000
  },
  {
    id: 3,
    name: 'Reflex Booster',
    description: 'Przyspiesza reakcje i ruchy',
    slot: 'nervous',
    level: 10,
    installed: false,
    bonus: { agility: 8, dodge: 15 },
    cost: 12000
  },
  {
    id: 4,
    name: 'Dermal Armor',
    description: 'Podskórna warstwa pancerza',
    slot: 'skin',
    level: 12,
    installed: false,
    bonus: { endurance: 10, defense: 20 },
    cost: 15000
  },
  {
    id: 5,
    name: 'Adrenaline Pump',
    description: 'Automatyczny zastrzyk adrenaliny w krytycznych chwilach',
    slot: 'cardiovascular',
    level: 15,
    installed: false,
    bonus: { strength: 5, endurance: 5, healthRegen: 3 },
    cost: 20000
  },
  {
    id: 6,
    name: 'Sandevistan',
    description: 'Legendarne zwiększenie czasu reakcji',
    slot: 'spine',
    level: 25,
    installed: false,
    bonus: { agility: 15, critChance: 25, dodge: 30 },
    cost: 100000
  }
]

export function AugmentsSection() {
  const playerLevel = 7
  const playerCredits = 420

  return (
    <div className="space-y-4">
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AUGMENTACJE CYBERNETYCZNE
          </CardTitle>
          <CardDescription>
            Ulepsz swoje ciało cybernetycznymi implantami i przekrocz ludzkie możliwości
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Stats summary */}
          <div className="mb-6 p-4 bg-muted/50 border border-border rounded">
            <h3 className="text-sm font-mono text-accent mb-3">AKTYWNE BONUSY</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan" />
                <div>
                  <p className="text-muted-foreground">Inteligencja</p>
                  <p className="font-mono text-cyan">+5</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-muted-foreground">Hacking</p>
                  <p className="font-mono text-yellow-500">+10</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-magenta" />
                <div>
                  <p className="text-muted-foreground">Krytyk</p>
                  <p className="font-mono text-magenta">+0%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-muted-foreground">Obrona</p>
                  <p className="font-mono text-red-500">+0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Augmentation slots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {augmentations.map(aug => {
              const canInstall = playerLevel >= aug.level && playerCredits >= aug.cost
              
              return (
                <Card 
                  key={aug.id} 
                  className={`border ${
                    aug.installed ? 'border-cyan bg-cyan/5' : 
                    canInstall ? 'border-accent/50' : 
                    'border-muted'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-mono flex items-center gap-2">
                          {aug.installed && <Cpu className="w-4 h-4 text-cyan animate-pulse" />}
                          {aug.name}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {aug.slot}
                          </Badge>
                          {aug.installed && (
                            <Badge className="text-xs bg-cyan/20 text-cyan border-cyan">
                              Zainstalowana
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!canInstall && !aug.installed && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {aug.description}
                    </p>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Bonusy:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(aug.bonus).map(([stat, value]) => (
                          <Badge key={stat} variant="secondary" className="text-xs">
                            {stat}: +{value}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wymagany poziom:</span>
                        <span className={`font-mono ${playerLevel >= aug.level ? 'text-accent' : 'text-red-500'}`}>
                          {aug.level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Koszt instalacji:</span>
                        <span className={`font-mono ${playerCredits >= aug.cost ? 'text-cyan' : 'text-red-500'}`}>
                          {aug.cost} ⚡
                        </span>
                      </div>
                    </div>

                    {aug.installed ? (
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        ✓ Zainstalowana
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={!canInstall}
                        variant={canInstall ? 'default' : 'outline'}
                      >
                        {playerLevel < aug.level ? `Wymaga lvl ${aug.level}` :
                         playerCredits < aug.cost ? 'Za mało kredytów' :
                         'Zainstaluj'}
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
