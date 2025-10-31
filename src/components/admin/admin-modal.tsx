import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Package, Users, Database } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/services/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import { useItems } from "@/contexts/ItemsContext"
import { ItemEditorTab } from "@/components/admin/ItemEditorTab"
import type { Postac } from "@/types/gameTypes"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

interface AdminModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postac: Postac | null
}

export function AdminModal({ open, onOpenChange }: AdminModalProps) {
  const { toast } = useToast()
  const { items } = useItems()
  const [activeTab, setActiveTab] = useState<'items' | 'players' | 'database'>('items')
  const [loading, setLoading] = useState(false)
  
  // Admin forms
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [targetNick, setTargetNick] = useState<string>('')
  const [itemQuantity, setItemQuantity] = useState<number>(1)
  const [creditAmount, setCreditAmount] = useState<number>(1000)
  const [expAmount, setExpAmount] = useState<number>(100)
  const [streetCredAmount, setStreetCredAmount] = useState<number>(10)

  async function handleAddItemToPlayer() {
    if (!selectedItemId || !targetNick.trim()) {
      toast({
        title: 'Błąd',
        description: 'Wybierz przedmiot i wprowadź nick gracza',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          targetNick: targetNick.trim(),
          itemId: selectedItemId,
          quantity: itemQuantity
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Admin add item failed:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          result
        })
        throw new Error(result.error || 'Failed to add item')
      }

      console.log('✅ Admin add item success:', result)
      
      toast({
        title: 'Sukces',
        description: result.message
      })

      setSelectedItemId('')
      setTargetNick('')
      setItemQuantity(1)
    } catch (error: any) {
      console.error('❌ Admin add item exception:', error)
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleGiveCredits() {
    if (!targetNick.trim()) {
      toast({
        title: 'Błąd',
        description: 'Wprowadź nick gracza',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-give-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          targetNick: targetNick.trim(),
          amount: creditAmount
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Admin give credits failed:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          result
        })
        throw new Error(result.error || 'Failed to give credits')
      }

      console.log('✅ Admin give credits success:', result)
      
      toast({
        title: 'Sukces',
        description: result.message
      })

      setTargetNick('')
    } catch (error: any) {
      console.error('❌ Admin give credits exception:', error)
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleGiveExp() {
    if (!targetNick.trim()) {
      toast({
        title: 'Błąd',
        description: 'Wprowadź nick gracza',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-give-exp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          targetNick: targetNick.trim(),
          expAmount: expAmount
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Admin give exp failed:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          result
        })
        throw new Error(result.error || 'Failed to give EXP')
      }

      console.log('✅ Admin give exp success:', result)
      
      let message = result.message
      if (result.levelsGained > 0) {
        message += ` (${result.levelsGained} poziomów, +${result.statPointsGained} punktów statów!)`
      }

      toast({
        title: 'Sukces',
        description: message
      })

      setTargetNick('')
    } catch (error: any) {
      console.error('❌ Admin give exp exception:', error)
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleGiveStreetCred() {
    if (!targetNick.trim()) {
      toast({
        title: 'Błąd',
        description: 'Wprowadź nick gracza',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-give-street-cred`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          targetNick: targetNick.trim(),
          amount: streetCredAmount
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ Admin give street cred failed:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          result
        })
        throw new Error(result.error || 'Failed to give street cred')
      }

      console.log('✅ Admin give street cred success:', result)
      
      toast({
        title: 'Sukces',
        description: result.message
      })

      setTargetNick('')
    } catch (error: any) {
      console.error('❌ Admin give street cred exception:', error)
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const availableItems = Object.entries(items).map(([id, item]) => ({
    id,
    name: item.name,
    type: item.type,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-yellow-500">
            <Shield className="inline-block w-6 h-6 mr-2" />
            PANEL ADMINISTRATORA
          </DialogTitle>
        </DialogHeader>

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
              <Card className="bg-muted/50 border-yellow-500/30">
                <CardContent className="p-4">
                  <h4 className="font-mono text-yellow-500 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    DODAJ PRZEDMIOT DO GRACZA
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="target-nick">Nick gracza</Label>
                      <Input
                        id="target-nick"
                        value={targetNick}
                        onChange={(e) => setTargetNick(e.target.value)}
                        placeholder="Wprowadź nick gracza"
                        className="font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="item-select">Wybierz przedmiot</Label>
                      <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                        <SelectTrigger id="item-select">
                          <SelectValue placeholder="Wybierz przedmiot..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {availableItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.type}) - ID: {item.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="item-quantity">Ilość</Label>
                      <Input
                        id="item-quantity"
                        type="number"
                        min={1}
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                        className="font-mono"
                      />
                    </div>

                    <Button
                      onClick={handleAddItemToPlayer}
                      className="w-full"
                      disabled={loading || !selectedItemId || !targetNick.trim()}
                    >
                      {loading ? 'Dodawanie...' : 'Dodaj przedmiot'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/50 border-yellow-500/30">
                <CardContent className="p-4">
                  <h4 className="font-mono text-yellow-500 mb-3">SZYBKIE AKCJE</h4>

                  <div className="space-y-3 mb-4">
                    <div>
                      <Label htmlFor="quick-nick">Nick gracza</Label>
                      <Input
                        id="quick-nick"
                        value={targetNick}
                        onChange={(e) => setTargetNick(e.target.value)}
                        placeholder="Wprowadź nick gracza"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(parseInt(e.target.value) || 0)}
                        placeholder="Ilość kredytów"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleGiveCredits}
                        disabled={loading || !targetNick.trim()}
                      >
                        Dodaj kredyty
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={expAmount}
                        onChange={(e) => setExpAmount(parseInt(e.target.value) || 0)}
                        placeholder="Ilość EXP"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleGiveExp}
                        disabled={loading || !targetNick.trim()}
                      >
                        Dodaj EXP
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={streetCredAmount}
                        onChange={(e) => setStreetCredAmount(parseInt(e.target.value) || 0)}
                        placeholder="Ilość Street Cred"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleGiveStreetCred}
                        disabled={loading || !targetNick.trim()}
                      >
                        Dodaj Street Cred
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <Input placeholder="Opis przedmiotu..." disabled />
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

          {activeTab === 'database' && <ItemEditorTab />}
        </div>

        <div className="text-xs text-yellow-500/70 text-center pt-2 border-t border-yellow-500/20">
          ⚠️ Panel administratora - używaj ostrożnie
        </div>
      </DialogContent>
    </Dialog>
  )
}
