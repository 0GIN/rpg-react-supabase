import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, ArrowRightLeft, Package, Clock } from 'lucide-react'

const onlinePlayers = [
  { id: 1, nick: 'NetRunner99', level: 12, wantsToBuy: ['Plasma Rifle', 'Stimpacks'], online: true },
  { id: 2, nick: 'CyberPunk2077', level: 15, wantsToBuy: ['Cyberware', 'Credits'], online: true },
  { id: 3, nick: 'GhostInShell', level: 8, wantsToBuy: ['Armor', 'Ammo'], online: true }
]

const tradeOffers = [
  {
    id: 1,
    from: 'ShadowMerc',
    offers: ['Combat Jacket', '500 Credits'],
    wants: ['Plasma Rifle'],
    status: 'pending',
    expiresIn: 1800
  },
  {
    id: 2,
    from: 'TechWizard',
    offers: ['Neural Chip'],
    wants: ['2000 Credits'],
    status: 'pending',
    expiresIn: 3600
  }
]

export function TradeSection() {
  return (
    <div className="space-y-4">
      {/* Active trade offers */}
      {tradeOffers.length > 0 && (
        <Card className="bg-card border-cyan/50">
          <CardHeader>
            <CardTitle className="text-cyan font-mono text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              OTRZYMANE OFERTY HANDLOWE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tradeOffers.map(offer => (
              <Card key={offer.id} className="border border-accent/50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm font-bold">{offer.from}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Wygasa za {Math.floor(offer.expiresIn / 60)}min
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 items-center text-xs mb-3">
                    <div className="bg-green-500/10 p-2 rounded border border-green-500/30">
                      <p className="text-muted-foreground mb-1">Oferuje:</p>
                      {offer.offers.map((item, i) => (
                        <p key={i} className="font-mono text-green-500">{item}</p>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <ArrowRightLeft className="w-4 h-4 text-accent" />
                    </div>
                    <div className="bg-blue-500/10 p-2 rounded border border-blue-500/30">
                      <p className="text-muted-foreground mb-1">Chce:</p>
                      {offer.wants.map((item, i) => (
                        <p key={i} className="font-mono text-blue-500">{item}</p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                      Akceptuj
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Odrzuć
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            HANDEL Z GRACZAMI
          </CardTitle>
          <CardDescription>
            Wymieniaj przedmioty z innymi graczami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted/50 border border-border rounded">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-accent mb-1">JAK HANDLOWAĆ?</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>1. Wybierz gracza z listy poniżej</li>
                  <li>2. Zaproponuj wymianę przedmiotów lub kredytów</li>
                  <li>3. Poczekaj na akceptację drugiej strony</li>
                  <li>4. Handel zostanie automatycznie zrealizowany</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono text-muted-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              GRACZE ONLINE ({onlinePlayers.length})
            </h3>
            <div className="space-y-2">
              {onlinePlayers.map(player => (
                <Card key={player.id} className="border border-accent/30 hover:border-accent transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div>
                          <p className="font-mono text-sm font-bold">{player.nick}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            LVL {player.level}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">
                        Zaproponuj handel
                      </Button>
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground mb-1">Szuka:</p>
                      <div className="flex flex-wrap gap-1">
                        {player.wantsToBuy.map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
