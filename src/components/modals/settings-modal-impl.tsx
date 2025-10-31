import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Volume2, Bell, Eye, Palette } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from '@/services/supabaseClient'
import { useToast } from '@/hooks/use-toast'

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  
  // Audio
  const [soundVolume, setSoundVolume] = useState(70)
  const [musicVolume, setMusicVolume] = useState(50)
  
  // Notifications
  const [notificationsMissions, setNotificationsMissions] = useState(true)
  const [notificationsLevelup, setNotificationsLevelup] = useState(true)
  const [notificationsTrades, setNotificationsTrades] = useState(true)
  
  // Graphics
  const [graphicsAnimations, setGraphicsAnimations] = useState(true)
  const [graphicsEffects, setGraphicsEffects] = useState(true)
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high')
  
  // Theme
  const [theme, setTheme] = useState<'cyberpunk' | 'neon' | 'matrix' | 'midnight'>('cyberpunk')

  // Load settings from database on mount
  useEffect(() => {
    if (open) {
      loadSettings()
    }
  }, [open])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }

      if (data) {
        setSoundVolume(data.sound_volume)
        setMusicVolume(data.music_volume)
        setNotificationsMissions(data.notifications_missions)
        setNotificationsLevelup(data.notifications_levelup)
        setNotificationsTrades(data.notifications_trades)
        setGraphicsAnimations(data.graphics_animations)
        setGraphicsEffects(data.graphics_effects)
        setGraphicsQuality(data.graphics_quality)
        setTheme(data.theme)
      }
    } catch (err) {
      console.error('Error loading settings:', err)
      toast({
        title: 'Błąd',
        description: 'Nie udało się wczytać ustawień',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.rpc('upsert_user_settings', {
        p_user_id: user.id,
        p_sound_volume: soundVolume,
        p_music_volume: musicVolume,
        p_notifications_missions: notificationsMissions,
        p_notifications_levelup: notificationsLevelup,
        p_notifications_trades: notificationsTrades,
        p_graphics_animations: graphicsAnimations,
        p_graphics_effects: graphicsEffects,
        p_graphics_quality: graphicsQuality,
        p_theme: theme
      })

      if (error) throw error

      toast({
        title: 'Zapisano',
        description: 'Ustawienia zostały zaktualizowane'
      })
    } catch (err) {
      console.error('Error saving settings:', err)
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać ustawień',
        variant: 'destructive'
      })
    }
  }

  // Auto-save on any setting change (debounced would be better in production)
  useEffect(() => {
    if (!loading && open) {
      const timeoutId = setTimeout(() => {
        saveSettings()
      }, 500) // Save 500ms after last change
      
      return () => clearTimeout(timeoutId)
    }
  }, [soundVolume, musicVolume, notificationsMissions, notificationsLevelup, notificationsTrades, 
      graphicsAnimations, graphicsEffects, graphicsQuality, theme, loading, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-accent">
            <Settings className="inline-block w-6 h-6 mr-2" />
            USTAWIENIA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Audio Settings */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4 space-y-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                DŹWIĘK
              </h4>

              <div className="space-y-2">
                <Label htmlFor="sound-volume" className="text-sm">
                  Głośność efektów dźwiękowych: {soundVolume}%
                </Label>
                <Slider
                  id="sound-volume"
                  value={[soundVolume]}
                  onValueChange={(value) => setSoundVolume(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="music-volume" className="text-sm">
                  Głośność muzyki: {musicVolume}%
                </Label>
                <Slider
                  id="music-volume"
                  value={[musicVolume]}
                  onValueChange={(value) => setMusicVolume(value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                POWIADOMIENIA
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-missions" className="text-sm">
                    Powiadomienia o zakończeniu misji
                  </Label>
                  <Switch
                    id="notifications-missions"
                    checked={notificationsMissions}
                    onCheckedChange={setNotificationsMissions}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-levelup" className="text-sm">
                    Powiadomienia o awansie poziomu
                  </Label>
                  <Switch 
                    id="notifications-levelup" 
                    checked={notificationsLevelup}
                    onCheckedChange={setNotificationsLevelup}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications-trades" className="text-sm">
                    Powiadomienia o ofertach handlowych
                  </Label>
                  <Switch 
                    id="notifications-trades" 
                    checked={notificationsTrades}
                    onCheckedChange={setNotificationsTrades}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphics */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                GRAFIKA
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="graphics-animations" className="text-sm">
                    Animacje interfejsu
                  </Label>
                  <Switch
                    id="graphics-animations"
                    checked={graphicsAnimations}
                    onCheckedChange={setGraphicsAnimations}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="graphics-effects" className="text-sm">
                    Efekty świetlne (neon glow)
                  </Label>
                  <Switch 
                    id="graphics-effects" 
                    checked={graphicsEffects}
                    onCheckedChange={setGraphicsEffects}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graphics-quality" className="text-sm">
                    Jakość grafiki
                  </Label>
                  <Select value={graphicsQuality} onValueChange={(value) => setGraphicsQuality(value as any)}>
                    <SelectTrigger id="graphics-quality">
                      <SelectValue placeholder="Wybierz jakość" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Niska</SelectItem>
                      <SelectItem value="medium">Średnia</SelectItem>
                      <SelectItem value="high">Wysoka</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card className="bg-muted/50 border-accent/30">
            <CardContent className="p-4">
              <h4 className="font-mono text-accent mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                MOTYW
              </h4>

              <div className="space-y-2">
                <Label htmlFor="theme" className="text-sm">
                  Schemat kolorów
                </Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Wybierz motyw" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyberpunk">Cyberpunk (Domyślny)</SelectItem>
                    <SelectItem value="neon">Neon City</SelectItem>
                    <SelectItem value="matrix">Matrix Green</SelectItem>
                    <SelectItem value="midnight">Midnight Blue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            <p>Wersja gry: 0.1.0 (Alpha)</p>
            <p className="mt-1">Zmiany są zapisywane automatycznie</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
