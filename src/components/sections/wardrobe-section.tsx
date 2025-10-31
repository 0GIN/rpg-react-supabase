"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CharacterMannequin } from "@/components/avatar/character-mannequin"
import type { CharacterAppearance, EquippedClothing, Postac } from "@/types/gameTypes"
import { ArrowLeft, Save } from "lucide-react"

interface WardrobeSectionProps {
  postac: Postac | null
  onSave: (payload: { appearance: CharacterAppearance; clothing: EquippedClothing }) => void | Promise<void>
  onBack?: () => void
}

/**
 * WardrobeSection
 *
 * Proste UI garderoby pozwalające wybrać wariant "body" w zależności od płci.
 * Bazuje na plikach PNG znajdujących się w public/clothing/{gender}/body/.
 * Dla startu wykorzystujemy konwencję nazw: female_body_01.png ... female_body_03.png i male_body_01.png ... male_body_03.png.
 * Możesz dodać własne pliki trzymając tę konwencję lub później podpiąć manifest JSON.
 */
type Step = 'category' | 'body' | 'hair'

// Use Vite's import.meta.glob to discover all PNGs in clothing folders at build time
const allFemaleBodyFiles = import.meta.glob('/public/clothing/female/body/*.png', { eager: true, as: 'url' })
const allMaleBodyFiles = import.meta.glob('/public/clothing/male/body/*.png', { eager: true, as: 'url' })
const allFemaleHairFiles = import.meta.glob('/public/clothing/female/hair/*.png', { eager: true, as: 'url' })
const allMaleHairFiles = import.meta.glob('/public/clothing/male/hair/*.png', { eager: true, as: 'url' })

function extractPaths(globResult: Record<string, string>): string[] {
  return Object.keys(globResult).map(k => k.replace('/public', ''))
}

export function WardrobeSection({ postac, onSave, onBack }: WardrobeSectionProps) {
  if (!postac) {
    return (
      <Card className="bg-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary font-mono flex items-center gap-2">
            <span className="text-accent">▸</span>
            GARDEROBA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Ładowanie...</div>
        </CardContent>
      </Card>
    )
  }

  const initialAppearance: CharacterAppearance = postac.appearance || { gender: 'female' }
  const [workingAppearance, setWorkingAppearance] = useState<CharacterAppearance>(initialAppearance)
  const [step, setStep] = useState<Step>('category')
  const gender = workingAppearance.gender || "female"

  // Extract discovered file paths from Vite glob imports
  const discoveredFemaleBody = useMemo(() => extractPaths(allFemaleBodyFiles), [])
  const discoveredMaleBody = useMemo(() => extractPaths(allMaleBodyFiles), [])
  const discoveredFemaleHair = useMemo(() => extractPaths(allFemaleHairFiles), [])
  const discoveredMaleHair = useMemo(() => extractPaths(allMaleHairFiles), [])

  const bodyOptions = useMemo(() => {
    return gender === 'male' ? discoveredMaleBody : discoveredFemaleBody
  }, [gender, discoveredMaleBody, discoveredFemaleBody])

  const hairOptions = useMemo(() => {
    return gender === 'male' ? discoveredMaleHair : discoveredFemaleHair
  }, [gender, discoveredMaleHair, discoveredFemaleHair])

  const [workingClothing, setWorkingClothing] = useState<EquippedClothing>({ ...(postac.clothing || {}) })
  const selectBody = (path: string) => setWorkingAppearance(prev => ({ ...prev, body: path }))

  const handleSave = async () => {
    await onSave({ appearance: workingAppearance, clothing: workingClothing })
  }

  return (
    <Card className="bg-card border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          GARDEROBA
        </CardTitle>
        <div className="flex items-center gap-2">
          {/* Gender toggle */}
          <div className="flex items-center gap-1 mr-2">
            <Button
              size="sm"
              variant={gender === 'female' ? 'default' : 'outline'}
              onClick={() => {
                if (gender === 'female') return
                setWorkingAppearance(a => ({
                  ...a,
                  gender: 'female',
                  body: a.body?.includes('/clothing/female/') ? a.body : undefined,
                  hair: a.hair?.includes('/clothing/female/') ? a.hair : undefined,
                }))
                // reset clothing paths not matching new gender
                setWorkingClothing(c => ({
                  ...c,
                  top: c.top?.includes('/clothing/female/') ? c.top : undefined,
                  bottom: c.bottom?.includes('/clothing/female/') ? c.bottom : undefined,
                  shoes: c.shoes?.includes('/clothing/female/') ? c.shoes : undefined,
                  accessory: c.accessory?.includes('/clothing/female/') ? c.accessory : undefined,
                  implant: c.implant?.includes('/clothing/female/') ? c.implant : undefined,
                }))
              }}
              className="font-mono"
            >F</Button>
            <Button
              size="sm"
              variant={gender === 'male' ? 'default' : 'outline'}
              onClick={() => {
                if (gender === 'male') return
                setWorkingAppearance(a => ({
                  ...a,
                  gender: 'male',
                  body: a.body?.includes('/clothing/male/') ? a.body : undefined,
                  hair: a.hair?.includes('/clothing/male/') ? a.hair : undefined,
                }))
                setWorkingClothing(c => ({
                  ...c,
                  top: c.top?.includes('/clothing/male/') ? c.top : undefined,
                  bottom: c.bottom?.includes('/clothing/male/') ? c.bottom : undefined,
                  shoes: c.shoes?.includes('/clothing/male/') ? c.shoes : undefined,
                  accessory: c.accessory?.includes('/clothing/male/') ? c.accessory : undefined,
                  implant: c.implant?.includes('/clothing/male/') ? c.implant : undefined,
                }))
              }}
              className="font-mono"
            >M</Button>
          </div>
          {/* Back behavior: to category if deep, else exit */}
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (step !== 'category') setStep('category')
                else onBack()
              }}
              className="font-mono"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> POWRÓT
            </Button>
          )}
          <Button variant="default" size="sm" onClick={handleSave} className="font-mono">
            <Save className="w-4 h-4 mr-1" /> ZAPISZ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Podgląd postaci */}
        <div className="w-full h-64 bg-muted/20 border-2 border-primary/50 rounded-sm overflow-hidden flex items-center justify-center">
          <CharacterMannequin 
            appearance={workingAppearance}
            clothing={workingClothing}
            className="w-auto h-full"
          />
        </div>

        {/* Step switcher */}
        {step === 'category' && (
          <section className="space-y-2">
            <h3 className="text-sm font-mono text-muted-foreground">WYBIERZ PARTIĘ CIAŁA</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { id: 'body', label: 'KORPUS' },
                { id: 'hair', label: 'WŁOSY' },
              ].map(cat => (
                <Button key={cat.id} variant="outline" className="font-mono" onClick={() => setStep(cat.id as Step)}>
                  {cat.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Najpierw wybierz kategorię, a potem konkretny wariant. Możesz zmienić płeć przyciskiem F/M.
            </p>
          </section>
        )}

        {step === 'body' && (
          <section className="space-y-2">
            <h3 className="text-sm font-mono text-muted-foreground">KORPUS ({gender === 'female' ? 'F' : 'M'})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {bodyOptions.map((src: string) => {
                const active = workingAppearance.body === src
                return (
                  <button
                    key={src}
                    onClick={() => selectBody(src)}
                    className={`relative aspect-[3/4] border rounded-sm overflow-hidden group ${active ? 'border-accent ring-2 ring-accent/50' : 'border-primary/40 hover:border-accent/50'}`}
                    title={src.split('/').slice(-1)[0]}
                  >
                    <img src={src} alt="body option" className="object-contain w-full h-full bg-muted/5" />
                    {active && (
                      <div className="absolute inset-0 bg-accent/10" />
                    )}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Pliki: public/clothing/{gender}/body/…
            </p>
          </section>
        )}

        {step === 'hair' && (
          <section className="space-y-2">
            <h3 className="text-sm font-mono text-muted-foreground">WŁOSY ({gender === 'female' ? 'F' : 'M'})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {hairOptions.map((src: string) => {
                const active = workingAppearance.hair === src
                return (
                  <button
                    key={src}
                    onClick={() => setWorkingAppearance(prev => ({ ...prev, hair: src }))}
                    className={`relative aspect-[3/4] border rounded-sm overflow-hidden group ${active ? 'border-accent ring-2 ring-accent/50' : 'border-primary/40 hover:border-accent/50'}`}
                    title={src.split('/').slice(-1)[0]}
                  >
                    <img src={src} alt="hair option" className="object-contain w-full h-full bg-muted/5" />
                    {active && (
                      <div className="absolute inset-0 bg-accent/10" />
                    )}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Pliki: public/clothing/{gender}/hair/…
            </p>
          </section>
        )}
      </CardContent>
    </Card>
  )
}
