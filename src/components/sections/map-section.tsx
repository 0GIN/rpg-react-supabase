import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Lock, CheckCircle } from 'lucide-react'

const districts = [
  {
    id: 1,
    name: 'Downtown Core',
    description: 'Centrum biznesowe miasta pełne drapaczy chmur',
    level: 1,
    unlocked: true,
    danger: 'low',
    locations: ['Sklep Tech', 'Bank Danych', 'Arena']
  },
  {
    id: 2,
    name: 'Red Light District',
    description: 'Neonowe ulice pełne klubów i czarnego rynku',
    level: 5,
    unlocked: true,
    danger: 'medium',
    locations: ['Czarny Rynek', 'Klub Nocny', 'Implant Shop']
  },
  {
    id: 3,
    name: 'Industrial Zone',
    description: 'Opuszczone fabryki i składy',
    level: 10,
    unlocked: false,
    danger: 'high',
    locations: ['Warsztat', 'Gang HQ', 'Secret Lab']
  },
  {
    id: 4,
    name: 'The Undercity',
    description: 'Labirynt tuneli pod miastem',
    level: 20,
    unlocked: false,
    danger: 'extreme',
    locations: ['Black Market Hub', 'Fight Pits', 'Data Haven']
  }
]

export function MapSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            MAPA NEON CITY
          </CardTitle>
          <CardDescription>
            Odkryj dzielnice miasta i znajdź ukryte lokacje
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Map placeholder */}
          <div className="bg-muted/50 border border-border rounded-lg h-[400px] mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-magenta/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-muted-foreground font-mono text-sm">
                [INTERACTIVE MAP - Coming Soon]
              </div>
            </div>
            
            {/* District markers */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan rounded-full animate-pulse" />
            <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-magenta rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full" />
          </div>

          {/* Districts list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {districts.map(district => (
              <Card key={district.id} className={`border ${district.unlocked ? 'border-accent/50' : 'border-muted'}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-mono flex items-center gap-2">
                        {district.unlocked ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                        {district.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {district.description}
                      </CardDescription>
                    </div>
                    <Badge variant={
                      district.danger === 'low' ? 'default' :
                      district.danger === 'medium' ? 'secondary' :
                      district.danger === 'high' ? 'destructive' : 'outline'
                    } className="font-mono text-xs">
                      {district.danger === 'low' && '●'}
                      {district.danger === 'medium' && '●●'}
                      {district.danger === 'high' && '●●●'}
                      {district.danger === 'extreme' && '●●●●'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Wymagany poziom:</span>
                    <span className="font-mono text-accent">{district.level}</span>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Lokacje:</p>
                    <div className="flex flex-wrap gap-1">
                      {district.locations.map((loc, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {loc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {district.unlocked ? (
                    <Button size="sm" className="w-full">
                      Podróżuj
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" disabled>
                      <Lock className="w-3 h-3 mr-2" />
                      Zablokowane
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
