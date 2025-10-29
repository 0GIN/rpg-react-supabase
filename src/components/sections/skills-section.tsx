import { SkillsPanel } from "@/components/skills-panel"

export function SkillsSection() {
  return (
    <div className="space-y-4">
      <SkillsPanel />
      <div className="bg-card border border-border p-6 rounded-sm">
        <h2 className="text-xl font-bold font-mono text-primary mb-4">SKILL TREE</h2>
        <p className="text-muted-foreground font-mono text-sm">Advanced skill tree system coming soon...</p>
      </div>
    </div>
  )
}
