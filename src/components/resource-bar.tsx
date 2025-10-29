import type React from "react"
import { Progress } from "@/components/ui/progress"
import { Zap, Cpu, DollarSign, Trophy } from "lucide-react"

interface ResourceBarProps {
  energy?: number
  maxEnergy?: number
  neural?: number
  maxNeural?: number
  credits?: number
  rank?: number
}

export function ResourceBar({ 
  energy = 85, 
  maxEnergy = 100, 
  neural = 1250, 
  maxNeural = 2000, 
  credits = 0, 
  rank = 0 
}: ResourceBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <ResourceItem icon={<Zap className="h-5 w-5" />} label="ENERGY" current={energy} max={maxEnergy} color="text-primary" />
      <ResourceItem icon={<Cpu className="h-5 w-5" />} label="NEURAL" current={neural} max={maxNeural} color="text-accent" />
      <ResourceItem
        icon={<DollarSign className="h-5 w-5" />}
        label="CREDITS"
        current={credits}
        max={null}
        color="text-secondary"
      />
      <ResourceItem icon={<Trophy className="h-5 w-5" />} label="RANK" current={rank} max={null} color="text-primary" />
    </div>
  )
}

function ResourceItem({
  icon,
  label,
  current,
  max,
  color,
}: {
  icon: React.ReactNode
  label: string
  current: number
  max: number | null
  color: string
}) {
  return (
    <div className="bg-card border border-border p-4 rounded-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className="text-xs font-mono text-muted-foreground">{label}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold font-mono ${color}`}>{current.toLocaleString()}</span>
          {max && <span className="text-sm text-muted-foreground font-mono">/ {max.toLocaleString()}</span>}
        </div>
        {max && <Progress value={(current / max) * 100} className="h-1" />}
      </div>
    </div>
  )
}
