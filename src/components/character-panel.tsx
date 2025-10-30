/**
 * character-panel.tsx - Panel statystyk postaci
 * 
 * Wyświetla kompleksowy widok postaci gracza:
 * - Avatar i manekin 3D z wyposażeniem
 * - Statystyki bazowe (siła, zręczność, itd.) z bonusami z ekwipunku
 * - Pasek poziomu i doświadczenia
 * - Informacje o klasie i poziomie
 * - Przycisk do otwierania garderoby
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CharacterMannequin } from "./character-mannequin"
import type { Postac } from "@/types/gameTypes"
import { Button } from "@/components/ui/button"
import { Shirt } from "lucide-react"
import { calculateExpForNextLevel, calculateTotalStats, calculateEquipmentBonuses } from "@/utils/levelSystem"
import { getItemDefinition } from "@/data/items"

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
  const experience = postac.experience || 0
  const expForNext = calculateExpForNextLevel(level)
  const expProgress = (experience / expForNext) * 100

  // Calculate stats with equipment bonuses
  const baseStats = postac.stats || {
    strength: 1,
    intelligence: 1,
    endurance: 1,
    agility: 1,
    charisma: 1,
    luck: 1
  }

  // Get equipped items
  const equippedItems = (postac.inventory || [])
    .filter(item => item.equipped)
    .map(item => {
      const def = getItemDefinition(item.itemId)
      return def ? { ...item, definition: def } : null
    })
    .filter(item => item !== null)

  // Calculate total stats (base + equipment)
  const equipmentBonuses = calculateEquipmentBonuses(equippedItems as any)
  const totalStats = calculateTotalStats(baseStats, equipmentBonuses)

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
              <span className="text-foreground">{experience.toLocaleString()} / {expForNext.toLocaleString()}</span>
            </div>
            <Progress value={expProgress} className="h-2" />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <StatRow label="SIŁA" value={totalStats.strength} max={100} />
          <StatRow label="INTELIGENCJA" value={totalStats.intelligence} max={100} />
          <StatRow label="WYTRZYMAŁOŚĆ" value={totalStats.endurance} max={100} />
          <StatRow label="ZRĘCZNOŚĆ" value={totalStats.agility} max={100} />
          <StatRow label="CHARYZMA" value={totalStats.charisma} max={100} />
          <StatRow label="SZCZĘŚCIE" value={totalStats.luck} max={100} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatRow({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const percentage = Math.min((value / max) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-muted-foreground w-28">{label}</span>
      <Progress value={percentage} className="h-2 flex-1" />
      <span className="text-sm font-mono text-foreground w-8 text-right">{value}</span>
    </div>
  )
}
