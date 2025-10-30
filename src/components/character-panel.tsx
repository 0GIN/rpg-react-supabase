"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CharacterMannequin } from "./character-mannequin"
import type { Postac } from "@/types/gameTypes"
import { Button } from "@/components/ui/button"
import { Shirt } from "lucide-react"

interface CharacterPanelProps {
  postac: Postac | null
  onOpenWardrobe?: () => void
}

/**
 * CharacterPanel Component
 * 
 * Panel wyświetlający postać na stronie głównej (dashboard)
 * - Pokazuje manekina z ubraniami
 * - Nick i poziom
 * - Pasek doświadczenia
 * - Statystyki postaci
 */
export function CharacterPanel({ postac, onOpenWardrobe }: CharacterPanelProps) {
  if (!postac) {
    return (
      <Card className="bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono flex items-center gap-2">
            <span className="text-accent">▸</span>
            POSTAĆ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Ładowanie...</div>
        </CardContent>
      </Card>
    )
  }

  const nick = postac.nick || 'GHOST_RUNNER'
  const level = postac.level || 1

  return (
    <Card className="bg-card border-primary/30">
      <CardHeader>
        <CardTitle className="text-primary font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          POSTAĆ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Character Mannequin with Clothing */}
        <div className="relative w-full h-148 bg-muted/20 border-2 border-primary/50 rounded-sm overflow-hidden flex items-center justify-center">
          {/* Wardrobe quick action */}
          <div className="absolute top-2 right-2 z-10">
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs font-mono"
              onClick={onOpenWardrobe}
              title="Garderoba">
              <Shirt className="w-3 h-3 mr-1" />
              GARDEROBA
            </Button>
          </div>
          <CharacterMannequin 
            appearance={postac.appearance}
            clothing={postac.clothing}
            className="w-auto h-full"
          />
        </div>

        {/* Character Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary font-mono">{nick}</h3>
            <Badge variant="outline" className="border-accent text-accent font-mono">
              POZIOM {level}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">DOŚWIADCZENIE</span>
              <span className="text-foreground">8,450 / 10,000</span>
            </div>
            <Progress value={84.5} className="h-2" />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <StatRow label="SIŁA" value={45} />
          <StatRow label="REFLEKS" value={62} />
          <StatRow label="TECH" value={71} />
          <StatRow label="INTELIGENCJA" value={38} />
          <StatRow label="OPANOWANIE" value={54} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-muted-foreground w-28">{label}</span>
      <Progress value={value} className="h-2 flex-1" />
      <span className="text-sm font-mono text-foreground w-8 text-right">{value}</span>
    </div>
  )
}
