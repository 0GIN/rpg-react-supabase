import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, User, LogOut, Shield } from "lucide-react"
import { supabase } from "@/services/supabaseClient"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GameHeaderProps {
  isAdmin?: boolean
  onOpenProfile?: () => void
  onOpenSettings?: () => void
  onOpenAdmin?: () => void
}

export function GameHeader({ isAdmin = false, onOpenProfile, onOpenSettings, onOpenAdmin }: GameHeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
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
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-500 hover:text-yellow-400"
                onClick={onOpenAdmin}
                title="Panel Administratora"
              >
                <Shield className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={onOpenProfile}
              title="Profil"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
              onClick={onOpenSettings}
              title="Ustawienia"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setShowLogoutConfirm(true)}
              title="Wyloguj"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wylogowanie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz się wylogować?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Wyloguj się
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
