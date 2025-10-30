import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skull } from 'lucide-react'

const blackMarketItems = [
  {
    id: 1,
    name: 'Stolen Cyberware',
    description: 'Wysokiej jakości implant nieznanego pochodzenia',
    price: 7500,
    rarity: 'rare',
    icon: '🔧',
    danger: 'high'
  },
  {
    id: 2,
    name: 'Military-Grade Weapon',
    description: 'Zakazana broń z wojskowych magazynów',
    price: 12000,
    rarity: 'epic',
    icon: '🔫',
    danger: 'extreme'
  },
  {
    id: 3,
    name: 'Hacking Toolkit',
    description: 'Zestaw narzędzi do nielegalnego hackowania',
    price: 5000,
    rarity: 'uncommon',
    icon: '💻',
    danger: 'medium'
  },
  {
    id: 4,
    name: 'Counterfeit Credits',
    description: 'Fałszywe kredyty - użyj ostrożnie',
    price: 2000,
    rarity: 'common',
    icon: '💰',
    danger: 'low'
  }
]

export function BlackMarketSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-card border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-500 font-mono flex items-center gap-2">
            <Skull className="w-5 h-5" />
            CZARNY RYNEK
          </CardTitle>
          <CardDescription className="text-red-400/70">
            Nielegalne towary i usługi - wchodzisz na własne ryzyko
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Warning */}
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-sm text-red-400">
              ⚠️ Transakcje na czarnym rynku są śledzone przez policję. 
              Każdy zakup zwiększa twój poziom poszukiwania.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blackMarketItems.map(item => (
              <Card key={item.id} className="border border-red-500/30 bg-red-500/5">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <p className="font-mono text-sm font-bold">{item.name}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge 
                            variant="outline" 
                            className={
                              item.rarity === 'common' ? 'border-gray-500' :
                              item.rarity === 'uncommon' ? 'border-green-500' :
                              item.rarity === 'rare' ? 'border-blue-500' :
                              'border-purple-500'
                            }
                          >
                            {item.rarity}
                          </Badge>
                          <Badge variant="destructive" className="text-xs">
                            {item.danger}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-mono text-red-500 font-bold">{item.price} ⚡</span>
                    <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 text-xs rounded border border-red-500/50 transition-colors">
                      Kup (ryzyko)
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
