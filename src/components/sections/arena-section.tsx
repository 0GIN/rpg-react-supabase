import { Trophy, Swords, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ArenaSection() {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border p-6 rounded-sm">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold font-mono text-primary">ARENA</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background border border-primary/20 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-3">
              <Swords className="h-5 w-5 text-accent" />
              <h3 className="font-mono text-sm text-accent">POJEDYNEK 1v1</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Wyzwij innych runnerów i udowodnij swoją wartość</p>
            <Button className="w-full">ZNAJDŹ PRZECIWNIKA</Button>
          </div>

          <div className="bg-background border border-secondary/20 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-secondary" />
              <h3 className="font-mono text-sm text-secondary">BITWA DRUŻYNOWA</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Stwórz ekipę i zdominuj arenę</p>
            <Button className="w-full" variant="secondary">
              DOŁĄCZ DO KOLEJKI
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
