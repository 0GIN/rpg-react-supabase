import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Hammer, Sparkles, Clock, CheckCircle } from 'lucide-react'

const recipes = [
  {
    id: 1,
    name: 'Улучшенный Stimpack',
    description: 'Przywraca 100 energii zamiast 50',
    tier: 'common',
    craftTime: 300, // sekund
    requirements: [
      { item: 'Stimpack', quantity: 2 },
      { item: 'Medical Supplies', quantity: 1 }
    ],
    result: { item: 'Enhanced Stimpack', quantity: 1 },
    level: 5,
    unlocked: true
  },
  {
    id: 2,
    name: 'Plasma Cell',
    description: 'Amunicja do broni plazmowej',
    tier: 'uncommon',
    craftTime: 600,
    requirements: [
      { item: 'Energy Core', quantity: 1 },
      { item: 'Metal Scraps', quantity: 5 }
    ],
    result: { item: 'Plasma Cell', quantity: 10 },
    level: 8,
    unlocked: true
  },
  {
    id: 3,
    name: 'Armor Plating',
    description: 'Wzmocniony pancerz +15 obrony',
    tier: 'rare',
    craftTime: 1800,
    requirements: [
      { item: 'Steel Plate', quantity: 3 },
      { item: 'Synthetic Fiber', quantity: 2 },
      { item: 'Circuit Board', quantity: 1 }
    ],
    result: { item: 'Armor Plating', quantity: 1 },
    level: 12,
    unlocked: false
  },
  {
    id: 4,
    name: 'Cyberware Component',
    description: 'Komponent do augmentacji',
    tier: 'epic',
    craftTime: 3600,
    requirements: [
      { item: 'Neural Chip', quantity: 1 },
      { item: 'Nano-Wire', quantity: 5 },
      { item: 'Bio-Gel', quantity: 3 }
    ],
    result: { item: 'Cyberware Component', quantity: 1 },
    level: 15,
    unlocked: false
  }
]

const activeCrafts = [
  {
    id: 1,
    recipeName: 'Enhanced Stimpack',
    startedAt: Date.now() - 120000, // 2 min ago
    finishesAt: Date.now() + 180000, // 3 min from now
    progress: 40
  }
]

export function CraftingSection() {
  const playerLevel = 7

  return (
    <div className="space-y-4">
      {/* Active crafts */}
      {activeCrafts.length > 0 && (
        <Card className="bg-card border-cyan/50">
          <CardHeader>
            <CardTitle className="text-cyan font-mono text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              TRWA CRAFTING
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeCrafts.map(craft => (
              <div key={craft.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{craft.recipeName}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor((craft.finishesAt - Date.now()) / 1000)}s pozostało
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan transition-all duration-1000"
                    style={{ width: `${craft.progress}%` }}
                  />
                </div>
                <Button size="sm" className="w-full">
                  Odbierz (3:00)
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center gap-2">
            <Hammer className="w-5 h-5" />
            CRAFTING & WYTWARZANIE
          </CardTitle>
          <CardDescription>
            Twórz zaawansowane przedmioty z surowców
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recipes.map(recipe => {
              const canCraft = playerLevel >= recipe.level && recipe.unlocked

              return (
                <Card 
                  key={recipe.id}
                  className={`border ${canCraft ? 'border-accent/50' : 'border-muted'}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-mono flex items-center gap-2">
                          {recipe.name}
                          {recipe.unlocked && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className={
                              recipe.tier === 'common' ? 'border-gray-500' :
                              recipe.tier === 'uncommon' ? 'border-green-500' :
                              recipe.tier === 'rare' ? 'border-blue-500' :
                              'border-purple-500'
                            }
                          >
                            {recipe.tier}
                          </Badge>
                        </div>
                      </div>
                      <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {recipe.description}
                    </p>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Wymagane materiały:</p>
                      <div className="space-y-1">
                        {recipe.requirements.map((req, i) => (
                          <div key={i} className="flex justify-between text-xs bg-muted/50 px-2 py-1 rounded">
                            <span>{req.item}</span>
                            <span className="font-mono">x{req.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Rezultat:</p>
                      <div className="flex justify-between text-xs bg-accent/10 px-2 py-1 rounded border border-accent/30">
                        <span className="text-accent font-mono">{recipe.result.item}</span>
                        <span className="font-mono">x{recipe.result.quantity}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs pt-2 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Czas craftu:</span>
                        <span className="font-mono">{Math.floor(recipe.craftTime / 60)}m {recipe.craftTime % 60}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wymagany poziom:</span>
                        <span className={`font-mono ${playerLevel >= recipe.level ? 'text-accent' : 'text-red-500'}`}>
                          {recipe.level}
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!canCraft}
                      variant={canCraft ? 'default' : 'outline'}
                    >
                      {!recipe.unlocked ? 'Zablokowany przepis' :
                       playerLevel < recipe.level ? `Wymaga lvl ${recipe.level}` :
                       'Stwórz'}
                    </Button>
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
