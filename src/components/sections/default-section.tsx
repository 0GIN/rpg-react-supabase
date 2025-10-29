import { MissionPanel } from "@/components/mission-panel"
import { SkillsPanel } from "@/components/skills-panel"
import { ActivityLog } from "@/components/activity-log"

export function DefaultSection() {
  return (
    <>
      <MissionPanel />
      <SkillsPanel />
      <ActivityLog />
    </>
  )
}
