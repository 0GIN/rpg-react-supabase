/**
 * missions-section.tsx - Sekcja zleceń w grze
 * 
 * Główny widok systemu zleceń:
 * - Wyświetla panel ze wszystkimi dostępnymi zleceniami
 * - Pokazuje aktywne zlecenie z licznikiem czasu
 * - Log aktywności gracza
 * Obsługuje rozpoczynanie zleceń i odbieranie nagród.
 */

import { MissionPanel } from "@/components/panels/mission-panel"
import { ActivityLog } from "@/components/logs/activity-log"
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
