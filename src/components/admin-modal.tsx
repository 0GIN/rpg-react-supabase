import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Package, Users, Database, Plus } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/services/supabaseClient"
import type { Postac } from "@/types/gameTypes"

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postac: Postac | null
}

export function AdminModal({ open, onOpenChange, postac }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'players' | 'database'>('items')
  
  // Item creation form
  const [newItem, setNewItem] = useState({
    itemId: '',
    name: '',
    type: 'consumable' as const,
    rarity: 'common' as const,
    description: '',
    price: 0,
    stats: '',
  })

  async function handleAddItemToPlayer() {
    if (!postac || !newItem.itemId) {
      alert('Wprowadź ID przedmiotu')
      return
    }

    const { addMultipleItems } = await import('@/utils/inventory')
    const result = await addMultipleItems(postac.id, [
      { itemId: newItem.itemId, quantity: 1 }
    ])

    if (result.success) {
      alert(`✅ Dodano przedmiot: ${newItem.itemId}`)
      setNewItem({
        itemId: '',
        name: '',
        type: 'consumable',
        rarity: 'common',
        description: '',
        price: 0,
        stats: '',
      })
    } else {
      alert('❌ Błąd: ' + result.error)
    }
  }

  async function handleGiveCredits(amount: number) {
    if (!postac) return

    const { error } = await supabase
      .from('postacie')
      .update({ kredyty: (postac.kredyty || 0) + amount })
      .eq('id', postac.id)

    if (error) {
      alert('❌ Błąd: ' + error.message)
    } else {
      alert(`✅ Dodano ${amount} kredytów`)
      window.location.reload()
    }
  }

  async function handleGiveExp(amount: number) {
    if (!postac) return

    const { devGiveExp } = await import('@/utils/experience')
    const result = await devGiveExp(postac.id, amount)

    if (result.success) {
      if (result.leveledUp) {
        alert(`🎉 Dodano ${amount} EXP! LEVEL UP do ${result.newLevel}!`)
      } else {
        alert(`✅ Dodano ${amount} EXP`)
      }
      window.location.reload()
    } else {
      alert('❌ Błąd: ' + result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-yellow-500">
            <Shield className="inline-block w-6 h-6 mr-2" />
            PANEL ADMINISTRATORA
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === 'items' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('items')}
            className="rounded-b-none"
          >
            <Package className="w-4 h-4 mr-2" />
            Przedmioty
          </Button>
          <Button
            variant={activeTab === 'players' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('players')}
            className="rounded-b-none"
          >
            <Users className="w-4 h-4 mr-2" />
            Gracze
          </Button>
          <Button
            variant={activeTab === 'database' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('database')}
            className="rounded-b-none"
          >
            <Database className="w-4 h-4 mr-2" />
            Baza danych
          </Button>
        </div>

        <div className="space-y-4">
          {activeTab === 'items' && (
            <>
              {/* Add item to current player */}
              <Card className="bg-muted/50 border-yellow-500/30">
                <CardContent className="p-4">
                  <h4 className="font-mono text-yellow-500 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    DODAJ PRZEDMIOT DO GRACZA
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="item-id">ID Przedmiotu</Label>
                      <Input
                        id="item-id"
                        value={newItem.itemId}
                        onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
                        placeholder="np. cyber_jacket_f"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Dostępne: cyber_jacket_f, tactical_vest, plasma_rifle, smart_glasses, military_cyberarm, stimpack, rare_crystal
                      </p>
                    </div>

                    <Button onClick={handleAddItemToPlayer} className="w-full">
                      Dodaj przedmiot do {postac?.nick}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-muted/50 border-yellow-500/30">
                <CardContent className="p-4">
                  <h4 className="font-mono text-yellow-500 mb-3">SZYBKIE AKCJE</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleGiveCredits(1000)}
                    >
                      + 1000 kredytów
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleGiveCredits(10000)}
                    >
                      + 10000 kredytów
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleGiveExp(100)}
                    >
                      + 100 EXP
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleGiveExp(1000)}
                    >
                      + 1000 EXP
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Item definition creator (mockup) */}
              <Card className="bg-muted/50 border-yellow-500/30">
                <CardContent className="p-4">
                  <h4 className="font-mono text-yellow-500 mb-3">KREATOR NOWEGO PRZEDMIOTU (NIEDOSTĘPNE)</h4>
                  <div className="space-y-3 opacity-50 pointer-events-none">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>ID Przedmiotu</Label>
                        <Input placeholder="unique_item_id" disabled />
                      </div>
                      <div>
                        <Label>Nazwa</Label>
                        <Input placeholder="Nazwa przedmiotu" disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Typ</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz typ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clothing">Ubranie</SelectItem>
                            <SelectItem value="weapon">Broń</SelectItem>
                            <SelectItem value="consumable">Consumable</SelectItem>
                            <SelectItem value="material">Materiał</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Rzadkość</Label>
                        <Select disabled>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz rzadkość" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="common">Common</SelectItem>
                            <SelectItem value="uncommon">Uncommon</SelectItem>
                            <SelectItem value="rare">Rare</SelectItem>
                            <SelectItem value="epic">Epic</SelectItem>
                            <SelectItem value="legendary">Legendary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Opis</Label>
                      <Textarea placeholder="Opis przedmiotu..." disabled />
                    </div>

                    <div>
                      <Label>Cena</Label>
                      <Input type="number" placeholder="0" disabled />
                    </div>

                    <Button disabled className="w-full">
                      Zapisz nowy przedmiot do pliku items.ts
                    </Button>
                  </div>
                  <p className="text-xs text-yellow-500 mt-3">
                    ⚠️ Aby dodać nowy przedmiot, edytuj plik <code className="bg-background px-1 rounded">src/data/items.ts</code>
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'players' && (
            <Card className="bg-muted/50 border-yellow-500/30">
              <CardContent className="p-4">
                <h4 className="font-mono text-yellow-500 mb-3">ZARZĄDZANIE GRACZAMI</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Funkcje zarządzania graczami będą dostępne w przyszłych wersjach.
                </p>
                <div className="space-y-2 text-xs">
                  <p>• Lista wszystkich graczy online</p>
                  <p>• Banowanie/Odbanowanie</p>
                  <p>• Reset postaci</p>
                  <p>• Przyznawanie odznak</p>
                  <p>• System ostrzeżeń</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'database' && (
            <Card className="bg-muted/50 border-yellow-500/30">
              <CardContent className="p-4">
                <h4 className="font-mono text-yellow-500 mb-3">NARZĘDZIA BAZY DANYCH</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Bezpośredni dostęp do bazy danych przez Supabase Dashboard.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  className="w-full"
                >
                  Otwórz Supabase Dashboard
                </Button>

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <p>• SQL Editor</p>
                  <p>• Table Editor</p>
                  <p>• Database Logs</p>
                  <p>• Backups & Migrations</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-xs text-yellow-500/70 text-center pt-2 border-t border-yellow-500/20">
          ⚠️ Panel administratora - używaj ostrożnie
        </div>
      </DialogContent>
    </Dialog>
  )
}
