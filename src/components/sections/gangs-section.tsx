"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Users, Trophy, Swords, MapPin, Crown } from "lucide-react"

export function GangsSection() {
  return (
    <div className="space-y-4">
      {/* Mój Gang */}
      <Card className="bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono flex items-center gap-2">
            <Shield className="h-5 w-5" />
            MÓJ GANG
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-sm flex items-center justify-center">
              <Shield className="h-10 w-10 text-background" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-primary font-mono">NEON_RUNNERS</h3>
                <Badge variant="outline" className="border-accent text-accent font-mono">
                  [NR]
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                Elitarny gang kontrolujący północną dzielnicę. Specjalizacja: Hacking i Infiltracja.
              </p>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-primary" />
                  <span className="text-foreground">24/50 Członków</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-accent" />
                  <span className="text-foreground">Ranking: #7</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-yellow-500" />
                  <span className="text-foreground">Poziom: 15</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">DOŚWIADCZENIE GANGU</span>
              <span className="text-foreground">45,200 / 60,000</span>
            </div>
            <Progress value={75.3} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="font-mono text-xs bg-transparent">
              <Users className="h-3 w-3 mr-2" />
              Zarządzaj Członkami
            </Button>
            <Button variant="outline" className="font-mono text-xs bg-transparent">
              <MapPin className="h-3 w-3 mr-2" />
              Terytorium
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aktywne Wojny Gangów */}
      <Card className="bg-card border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive font-mono flex items-center gap-2">
            <Swords className="h-5 w-5" />
            AKTYWNE WOJNY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <GangWarItem
            enemyGang="CHROME_SKULLS"
            enemyTag="[CS]"
            score="12 - 8"
            timeLeft="2g 14m"
            territory="Sektor Watson"
          />
          <GangWarItem
            enemyGang="CYBER_WOLVES"
            enemyTag="[CW]"
            score="5 - 5"
            timeLeft="5g 03m"
            territory="Sektor Heywood"
          />
        </CardContent>
      </Card>

      {/* Top Gangi */}
      <Card className="bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            TOP 10 GANGÓW
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <TopGangItem rank={1} name="NIGHT_CITY_LEGENDS" tag="[NCL]" level={28} members={50} />
          <TopGangItem rank={2} name="DIGITAL_ASSASSINS" tag="[DA]" level={26} members={48} />
          <TopGangItem rank={3} name="NEON_SAMURAI" tag="[NS]" level={24} members={45} />
          <TopGangItem rank={4} name="CHROME_REAPERS" tag="[CR]" level={22} members={42} />
          <TopGangItem rank={5} name="CYBER_PHANTOMS" tag="[CP]" level={20} members={40} />
        </CardContent>
      </Card>

      {/* Akcje */}
      <Card className="bg-card border-accent/30">
        <CardContent className="pt-6 space-y-2">
          <Button className="w-full font-mono" variant="default">
            <Shield className="h-4 w-4 mr-2" />
            Stwórz Nowy Gang
          </Button>
          <Button className="w-full font-mono bg-transparent" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Przeglądaj Wszystkie Gangi
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function GangWarItem({
  enemyGang,
  enemyTag,
  score,
  timeLeft,
  territory,
}: {
  enemyGang: string
  enemyTag: string
  score: string
  timeLeft: string
  territory: string
}) {
  return (
    <div className="p-3 bg-muted/50 border border-destructive/20 rounded-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-destructive text-destructive font-mono text-xs">
            {enemyTag}
          </Badge>
          <span className="text-sm font-mono text-foreground">{enemyGang}</span>
        </div>
        <Badge variant="destructive" className="font-mono text-xs">
          {timeLeft}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-muted-foreground">{territory}</span>
        <span className="text-primary font-bold">{score}</span>
      </div>
      <Button size="sm" variant="destructive" className="w-full font-mono text-xs">
        <Swords className="h-3 w-3 mr-2" />
        Dołącz do Walki
      </Button>
    </div>
  )
}

function TopGangItem({
  rank,
  name,
  tag,
  level,
  members,
}: {
  rank: number
  name: string
  tag: string
  level: number
  members: number
}) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500"
    if (rank === 2) return "text-gray-400"
    if (rank === 3) return "text-orange-600"
    return "text-muted-foreground"
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-sm hover:bg-muted/50 transition-colors">
      <span className={`text-lg font-bold font-mono w-8 ${getRankColor(rank)}`}>#{rank}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary font-mono text-xs">
            {tag}
          </Badge>
          <span className="text-sm font-mono text-foreground">{name}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
        <span>Lvl {level}</span>
        <span>{members}/50</span>
      </div>
    </div>
  )
}
