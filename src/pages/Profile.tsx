/**
 * Profile.tsx - Kreator postaci
 * 
 * Ekran tworzenia nowej postaci po pierwszym zalogowaniu.
 * Pozwala graczowi wybrać:
 * - Nick postaci
 * - Płeć (male/female)
 * - Wygląd (kolor włosów, skóry, odzież)
 * Tworzy nowy rekord w tabeli 'postacie'.
 */

import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, LogOut } from 'lucide-react'
import { CharacterMannequin } from '@/components/avatar/character-mannequin'
import type { CharacterAppearance, EquippedClothing } from '@/types/gameTypes'

interface Props {
  user: any
  onProfileCreated: () => void
}

export default function Profile({ user, onProfileCreated }: Props) {
  const [nick, setNick] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('female')
  const [selectedBody, setSelectedBody] = useState<number>(1)
  const [selectedHair, setSelectedHair] = useState<number>(1)
  
  // Available body types per gender
  const availableBodies = selectedGender === 'female' ? [1, 2, 3, 4, 5] : [1]
  const availableHairs = [1] // Currently only 1 hair per gender
  
  // Dynamic appearance based on selections
  const appearance: CharacterAppearance = {
    gender: selectedGender,
    body: `/clothing/${selectedGender}/body/${selectedGender}_body_${String(selectedBody).padStart(2, '0')}.png`,
    hair: `/clothing/${selectedGender}/hair/${selectedGender}_hair_${String(selectedHair).padStart(2, '0')}.png`,
    skinTone: 'medium'
  }
  
  // Default starting clothing (empty - just mannequin + body + hair)
  const clothing: EquippedClothing = {}

  async function handleCreateProfile() {
    if (!nick.trim()) return
    setLoading(true)
    try {
      // Starting inventory - give player some basic items
      const startingInventory = [
        { itemId: 'medkit', quantity: 3, obtainedAt: new Date().toISOString() },
        { itemId: 'energy_drink', quantity: 5, obtainedAt: new Date().toISOString() },
        { itemId: 'pistol_9mm', quantity: 1, obtainedAt: new Date().toISOString() },
        { itemId: 'combat_boots', quantity: 1, obtainedAt: new Date().toISOString() },
        { itemId: 'cargo_pants', quantity: 1, obtainedAt: new Date().toISOString() },
      ]
      
      // Starting stats - each stat begins at 1, with 5 free points to spend
      const startingStats = {
        strength: 1,
        intelligence: 1,
        endurance: 1,
        agility: 1,
        charisma: 1,
        luck: 1,
      }
      
      console.log('Creating profile:', { nick, userId: user.id, appearance, clothing, inventory: startingInventory, stats: startingStats })
      
      const { data, error } = await supabase.from('postacie').insert([{ 
        nick, 
        user_id: user.id,
        appearance,
        clothing,
        inventory: startingInventory,
        level: 1,
        experience: 0,
        stat_points: 5, // 5 free points to start
        stats: startingStats,
      }])
      
      console.log('Insert result:', { data, error })
      if (error) {
        if ((error as any)?.code === '23505') {
          console.log('Profile already exists (23505), redirecting...')
          onProfileCreated()
        } else {
          console.error('Insert error:', error)
          alert('Błąd: ' + error.message)
        }
      } else {
        console.log('Profile created successfully')
        onProfileCreated()
      }
    } catch (err) {
      console.error('Exception in handleCreateProfile:', err)
      alert('Błąd połączenia: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    console.log('Wylogowanie:', { error })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#16213e] to-[#1a1a2e] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-magenta/30 shadow-2xl shadow-magenta/20">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan to-magenta rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-magenta to-cyan bg-clip-text text-transparent">
            Stwórz Postać
          </CardTitle>
          <CardDescription className="text-base">
            Wybierz swoją tożsamość w Neon City
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold uppercase tracking-wider">
              Podgląd Postaci
            </Label>
            <div className="relative h-96 bg-muted/20 border-2 border-primary/50 rounded-lg overflow-hidden flex items-center justify-center shadow-inner">
              <CharacterMannequin 
                appearance={appearance}
                clothing={clothing}
                className="w-auto h-full scale-110"
              />
            </div>
          </div>

          {/* Nick Input - moved to top */}
          <div className="space-y-2">
            <Label htmlFor="nick" className="text-sm font-semibold uppercase tracking-wider">
              Nick Postaci
            </Label>
            <Input
              id="nick"
              type="text"
              placeholder="Wprowadź swój nick..."
              value={nick}
              onChange={e => setNick(e.target.value)}
              disabled={loading}
              maxLength={20}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Max 20 znaków. To będzie Twoja nazwa w grze.
            </p>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold uppercase tracking-wider">
              Płeć
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedGender === 'female' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedGender('female')
                  setSelectedBody(1) // Reset to first available body
                  setSelectedHair(1)
                }}
                disabled={loading}
                className="h-12"
              >
                Kobieta
              </Button>
              <Button
                type="button"
                variant={selectedGender === 'male' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedGender('male')
                  setSelectedBody(1)
                  setSelectedHair(1)
                }}
                disabled={loading}
                className="h-12"
              >
                Mężczyzna
              </Button>
            </div>
          </div>

          {/* Body Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold uppercase tracking-wider">
              Postura
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {availableBodies.map((bodyId) => (
                <Button
                  key={bodyId}
                  type="button"
                  variant={selectedBody === bodyId ? 'default' : 'outline'}
                  onClick={() => setSelectedBody(bodyId)}
                  disabled={loading}
                  className="h-12 px-2 text-xs"
                >
                  {bodyId}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Wybierz typ postury swojej postaci
            </p>
          </div>

          {/* Hair Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold uppercase tracking-wider">
              Fryzura
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {availableHairs.map((hairId) => (
                <Button
                  key={hairId}
                  type="button"
                  variant={selectedHair === hairId ? 'default' : 'outline'}
                  onClick={() => setSelectedHair(hairId)}
                  disabled={loading}
                  className="h-12 px-2 text-xs"
                >
                  {hairId}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Wybierz fryzurę swojej postaci
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleCreateProfile}
            disabled={loading || !nick.trim()}
          >
            {loading ? 'Tworzenie...' : 'Stwórz Postać'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Wyloguj
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
