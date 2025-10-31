/**
 * stats-management.tsx - Zarządzanie atrybutami postaci
 * 
 * Interfejs do rozdysponowywania punktów atrybutów:
 * - Wyświetla dostępne punkty do rozdania
 * - Lista atrybutów: Siła, Zręczność, Wytrzymałość, Inteligencja, Charyzma, Szczęście
 * - Przyciski zwiększania każdego atrybutu
 * - Opis wpływu każdego atrybutu na rozgrywkę
 * - Walidacja i zapis zmian w bazie danych
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Zap, 
  MessageCircle, 
  Clover,
  Plus,
  Info
} from 'lucide-react'
import type { Postac, CharacterStats } from '@/types/gameTypes'
import { 
  calculateLevelData, 
  getLevelProgress,
  calculateTotalStats,
  calculateEquipmentBonuses,
  calculateDerivedStats,
  getStatDisplayName,
  getStatDescription
} from '@/utils/levelSystem'
import { getItemDefinition } from '@/data/items'

interface StatsManagementProps {
  postac: Postac
  onStatIncrease: (stat: keyof CharacterStats) => Promise<void>
}

const STAT_ICONS: Record<keyof CharacterStats, React.ComponentType<{ className?: string }>> = {
  strength: TrendingUp,
  intelligence: Brain,
  endurance: Heart,
  agility: Zap,
  charisma: MessageCircle,
  luck: Clover,
}

export function StatsManagement({ postac, onStatIncrease }: StatsManagementProps) {
  const [loadingStat, setLoadingStat] = useState<keyof CharacterStats | null>(null)

  // Calculate level data
  const levelData = calculateLevelData(
    postac.experience || 0,
    postac.level || 1,
    postac.stat_points || 0
  )

  // Get base stats
  const baseStats: CharacterStats = postac.stats || {
    strength: 1,
    intelligence: 1,
    endurance: 1,
    agility: 1,
    charisma: 1,
    luck: 1,
  }

  // Calculate equipment bonuses
  const equippedItems = (postac.inventory || [])
    .filter(item => item.equipped)
    .map(item => getItemDefinition(item.itemId))
    .filter(def => def !== undefined)
  
  const equipmentBonuses = calculateEquipmentBonuses(equippedItems)
  const totalStats = calculateTotalStats(baseStats, equipmentBonuses)
  const derivedStats = calculateDerivedStats(totalStats)

  // Progress percentage
  const progressPercent = getLevelProgress(levelData.experience, levelData.experienceToNextLevel)

  async function handleIncreaseStat(stat: keyof CharacterStats) {
    if (levelData.statPoints <= 0) return
    setLoadingStat(stat)
    try {
      await onStatIncrease(stat)
    } finally {
      setLoadingStat(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Level Progress Card */}
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center justify-between">
            <span>POZIOM {levelData.level}</span>
            <Badge variant="outline" className="border-accent text-accent">
              {levelData.statPoints} punktów do rozdania
            </Badge>
          </CardTitle>
          <CardDescription>
            {levelData.experience} / {levelData.experienceToNextLevel} EXP do następnego poziomu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {progressPercent}% do poziomu {levelData.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono">STATYSTYKI</CardTitle>
          <CardDescription>
            Wydaj punkty aby ulepszać swoją postać
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.keys(baseStats) as Array<keyof CharacterStats>).map((stat) => {
            const Icon = STAT_ICONS[stat]
            const baseStat = baseStats[stat]
            const bonus = (equipmentBonuses[stat] || 0)
            const total = totalStats[stat]
            const hasBonus = bonus > 0

            return (
              <div
                key={stat}
                className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-sm hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-background border border-border rounded-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-foreground uppercase">
                        {getStatDisplayName(stat)}
                      </p>
                      <div className="group relative">
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        <div className="absolute left-0 top-full mt-1 w-48 p-2 bg-popover border border-border rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                          {getStatDescription(stat)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getStatDescription(stat).substring(0, 40)}...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold">
                      {baseStat}
                      {hasBonus && (
                        <span className="text-green-400 text-sm ml-1">
                          +{bonus}
                        </span>
                      )}
                    </p>
                    {hasBonus && (
                      <p className="text-xs text-green-400">
                        = {total} total
                      </p>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    disabled={levelData.statPoints <= 0 || loadingStat !== null}
                    onClick={() => handleIncreaseStat(stat)}
                    className="w-8 h-8 p-0"
                  >
                    {loadingStat === stat ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Derived Stats Card */}
      <Card className="bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono text-sm">STATYSTYKI POCHODNE</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Max HP:</span>
            <span className="font-mono text-foreground">{derivedStats.maxHealth}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">HP Regen:</span>
            <span className="font-mono text-foreground">{derivedStats.healthRegen}/s</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Obrażenia:</span>
            <span className="font-mono text-foreground">{derivedStats.physicalDamage}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Krytyk:</span>
            <span className="font-mono text-foreground">{derivedStats.critChance.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Unik:</span>
            <span className="font-mono text-foreground">{derivedStats.dodgeChance.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Hacking:</span>
            <span className="font-mono text-foreground">{derivedStats.hackingPower}</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Bonus cen:</span>
            <span className="font-mono text-foreground">{derivedStats.negotiationBonus}%</span>
          </div>
          <div className="flex justify-between p-2 bg-muted/50 rounded">
            <span className="text-muted-foreground">Bonus loot:</span>
            <span className="font-mono text-foreground">{derivedStats.lootBonus.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
