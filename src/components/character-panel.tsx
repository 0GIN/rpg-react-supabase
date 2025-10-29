"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shirt, Scissors, Palette } from "lucide-react"
import { CharacterAvatar } from "./character-avatar"

interface CharacterCustomization {
  hair: string
  outfit: string
  accessories: string
  skinTone: string
}

interface CharacterPanelProps {
  nick?: string
  level?: number
}

export function CharacterPanel({ nick = 'GHOST_RUNNER', level = 1 }: CharacterPanelProps) {
  const [customization, setCustomization] = useState<CharacterCustomization>({
    hair: "cyber-mohawk",
    outfit: "tactical-jacket",
    accessories: "visor",
    skinTone: "default",
  })

  const cycleHair = () => {
    const hairStyles = ["cyber-mohawk", "long-ponytail", "buzz-cut"]
    const currentIndex = hairStyles.indexOf(customization.hair)
    const nextIndex = (currentIndex + 1) % hairStyles.length
    setCustomization({ ...customization, hair: hairStyles[nextIndex] })
  }

  const cycleOutfit = () => {
    const outfits = ["tactical-jacket", "street-hoodie"]
    const currentIndex = outfits.indexOf(customization.outfit)
    const nextIndex = (currentIndex + 1) % outfits.length
    setCustomization({ ...customization, outfit: outfits[nextIndex] })
  }

  const cycleAccessories = () => {
    const accessories = ["visor", "face-mask", "neural-implant", "none"]
    const currentIndex = accessories.indexOf(customization.accessories)
    const nextIndex = (currentIndex + 1) % accessories.length
    setCustomization({ ...customization, accessories: accessories[nextIndex] })
  }

  return (
    <Card className="bg-card border-primary/30">
      <CardHeader>
        <CardTitle className="text-primary font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          POSTAĆ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 bg-muted/20 border-2 border-primary/50 rounded-sm flex items-center justify-center group">
            <CharacterAvatar customization={customization} size="md" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-primary hover:text-accent"
                onClick={cycleHair}
                title="Zmień fryzurę"
              >
                <Scissors className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-primary hover:text-accent"
                onClick={cycleOutfit}
                title="Zmień ubranie"
              >
                <Shirt className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-primary hover:text-accent"
                onClick={cycleAccessories}
                title="Zmień akcesoria"
              >
                <Palette className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold text-primary font-mono">{nick}</h3>
            <Badge variant="outline" className="border-accent text-accent font-mono">
              POZIOM {level}
            </Badge>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">DOŚWIADCZENIE</span>
                <span className="text-foreground">8,450 / 10,000</span>
              </div>
              <Progress value={84.5} className="h-2" />
            </div>
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
