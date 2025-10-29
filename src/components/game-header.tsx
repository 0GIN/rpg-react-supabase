import { Button } from "@/components/ui/button"
import { Settings, User, LogOut } from "lucide-react"

export function GameHeader() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary neon-glow tracking-wider font-mono">
            {">>"}NEON<span className="text-secondary">CITY</span>_NET
          </h1>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="text-accent">●</span>
            <span>ONLINE</span>
            <span className="text-muted-foreground">|</span>
            <span>SERWER: EU-01</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
