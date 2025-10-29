import { MissionPanel } from "@/components/mission-panel"
import { ActivityLog } from "@/components/activity-log"
import type { ZlecenieDefinicja, AktywneZlecenie } from '@/types/gameTypes'

interface MissionsSectionProps {
  zlecenia: ZlecenieDefinicja[]
  aktywne: AktywneZlecenie | null
  onStartMission: (id: number) => void
  onCollectReward: () => void
  loading: boolean
}

export function MissionsSection({ 
  zlecenia, 
  aktywne, 
  onStartMission, 
  onCollectReward, 
  loading 
}: MissionsSectionProps) {
  return (
    <div className="space-y-4">
      <MissionPanel 
        zlecenia={zlecenia}
        aktywne={aktywne}
        onStartMission={onStartMission}
        onCollectReward={onCollectReward}
        loading={loading}
      />
      <ActivityLog />
    </div>
  )
}
