"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export function SkillsPanel() {
  const [skills, setSkills] = useState([
    { id: 1, name: "HAKOWANIE", level: 8, points: 2 },
    { id: 2, name: "WALKA", level: 6, points: 4 },
    { id: 3, name: "SKRADANIE", level: 7, points: 3 },
    { id: 4, name: "INŻYNIERIA", level: 5, points: 5 },
  ])

  const [availablePoints, setAvailablePoints] = useState(5)

  const upgradeSkill = (skillId: number) => {
    if (availablePoints > 0) {
      setSkills(
        skills.map((skill) =>
          skill.id === skillId ? { ...skill, level: skill.level + 1, points: skill.points + 1 } : skill,
        ),
      )
      setAvailablePoints(availablePoints - 1)
    }
  }

  return (
    <Card className="bg-card border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary font-mono flex items-center gap-2">
            <span className="text-accent">▸</span>
            UMIEJĘTNOŚCI
          </CardTitle>
          <Badge variant="outline" className="border-primary text-primary font-mono">
            PUNKTY: {availablePoints}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="bg-muted/50 border border-border p-4 rounded-sm flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-bold text-foreground font-mono">{skill.name}</h4>
                <span className="text-sm text-muted-foreground font-mono">POZIOM {skill.level}</span>
                <span className="text-xs text-accent font-mono">+{skill.points * 5}%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(skill.level, 20) }).map((_, i) => (
                  <div key={i} className="h-2 w-3 rounded-full bg-primary" />
                ))}
                {skill.level > 20 && <span className="text-xs text-primary font-mono ml-2">+{skill.level - 20}</span>}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono bg-transparent"
              disabled={availablePoints === 0}
              onClick={() => upgradeSkill(skill.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
