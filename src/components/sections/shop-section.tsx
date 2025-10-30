import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Zap, Lock } from 'lucide-react'

const shopItems = [
  {
    id: 1,
    name: 'Stimpack',
    description: 'Przywraca 50 energii natychmiast',
    price: 100,
    category: 'consumable',
    icon: '💉',
    stock: 99,
    level: 1
  },
  {
    id: 2,
    name: 'Neural Booster',
    description: '+20 Neural na 1 godzinę',
    price: 250,
    category: 'consumable',
    icon: '🧠',
    stock: 50,
    level: 3
  },
  {
    id: 3,
    name: 'Combat Jacket',
    description: '+5 Wytrzymałość, +3 Zręczność',
    price: 1500,
    category: 'armor',
    icon: '🧥',
    stock: 5,
    level: 5
  },
  {
    id: 4,
    name: 'Plasma Rifle',
    description: '+15 Obrażeń, +5% Krytyk',
    price: 3000,
    category: 'weapon',
    icon: '🔫',
    stock: 2,
    level: 10
  },
  {
    id: 5,
    name: 'Cyberware Implant',
    description: '+10 do wszystkich statystyk',
    price: 10000,
    category: 'augment',
    icon: '⚙️',
    stock: 1,
    level: 15
  },
  {
    id: 6,
    name: 'Hacking Tool Pro',
    description: 'Zwiększa szanse na hack o 25%',
    price: 5000,
    category: 'tool',
    icon: '💻',
    stock: 3,
    level: 12
  }
]

export function ShopSection() {
  const playerCredits = 420 // Mock data
  const playerLevel = 7 // Mock data

  return (
    <div className="space-y-4">
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-accent font-mono flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                SKLEP TECH
              </CardTitle>
              <CardDescription>
                Najlepszy sprzęt w mieście - jeśli masz na to kredyty
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-cyan/10 px-4 py-2 rounded border border-cyan/30">
              <Zap className="w-4 h-4 text-cyan" />
              <span className="font-bold font-mono text-cyan">{playerCredits}</span>
              <span className="text-xs text-muted-foreground">kredytów</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map(item => {
              const canAfford = playerCredits >= item.price
              const canEquip = playerLevel >= item.level
              const canBuy = canAfford && canEquip

              return (
                <Card key={item.id} className={`border ${canBuy ? 'border-accent/50 hover:border-accent' : 'border-muted'} transition-colors`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.icon}</div>
                        <div>
                          <CardTitle className="text-base font-mono">
                            {item.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      {!canEquip && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cena:</span>
                        <span className={`font-mono font-bold ${canAfford ? 'text-cyan' : 'text-red-500'}`}>
                          {item.price} ⚡
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Poziom:</span>
                        <span className={`font-mono ${canEquip ? 'text-accent' : 'text-red-500'}`}>
                          {item.level}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">W magazynie:</span>
                        <span className="font-mono text-foreground">
                          {item.stock > 0 ? item.stock : 'Wyprzedane'}
                        </span>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full"
                      disabled={!canBuy || item.stock === 0}
                      variant={canBuy ? 'default' : 'outline'}
                    >
                      {!canEquip ? 'Wymaga poziomu ' + item.level :
                       !canAfford ? 'Za mało kredytów' :
                       item.stock === 0 ? 'Wyprzedane' :
                       'Kup'}
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
