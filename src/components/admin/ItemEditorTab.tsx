import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { supabase } from "@/services/supabaseClient"
import { useToast } from "@/hooks/use-toast"
import { useItems } from "@/contexts/ItemsContext"
import type { ItemDefinition } from "@/types/gameTypes"

export function ItemEditorTab() {
  const { items, refetch } = useItems()
  const { toast } = useToast()
  const [editMode, setEditMode] = useState<'list' | 'create' | 'edit'>('list')
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<ItemDefinition>>({
    id: '',
    name: '',
    type: 'clothing',
    rarity: 'common',
    description: '',
    imagePath: '',
    clothingSlot: undefined,
    clothingPath: '',
    stats: {},
    price: 0,
    sellPrice: 0,
    stackable: false,
    maxStack: 1,
  })

  function resetForm() {
    setFormData({
      id: '',
      name: '',
      type: 'clothing',
      rarity: 'common',
      description: '',
      imagePath: '',
      clothingSlot: undefined,
      clothingPath: '',
      stats: {},
      price: 0,
      sellPrice: 0,
      stackable: false,
      maxStack: 1,
    })
    setEditMode('list')
  }

  function loadItemForEdit(itemId: string) {
    const item = items[itemId]
    if (!item) return

    setFormData(item)
    setEditMode('edit')
  }

  async function handleSaveItem() {
    if (!formData.id || !formData.name) {
      toast({
        title: 'Błąd',
        description: 'ID i nazwa są wymagane',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const dbRecord = {
        item_id: formData.id,
        nazwa: formData.name,
        typ: formData.type,
        rzadkosc: formData.rarity,
        opis: formData.description || null,
        cena: formData.price || 0,
        cena_sprzedazy: formData.sellPrice || 0,
        wymagania: {}, // TODO: Add requirements form
        staty: formData.stats || {},
        clothing_slot: formData.clothingSlot || null,
        clothing_path: formData.clothingPath || null,
        image_path: formData.imagePath || null,
        stackable: formData.stackable || false,
        max_stack: formData.maxStack || null,
      }

      const { error } = await supabase
        .from('items')
        .upsert(dbRecord, { onConflict: 'item_id' })

      if (error) throw error

      toast({
        title: '✅ Zapisano',
        description: `Item "${formData.name}" został zapisany do bazy`,
      })

      await refetch()
      resetForm()
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteItem(itemId: string) {
    if (!confirm(`Czy na pewno chcesz usunąć item "${itemId}"?`)) return

    try {
      setLoading(true)

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('item_id', itemId)

      if (error) throw error

      toast({
        title: '✅ Usunięto',
        description: `Item "${itemId}" został usunięty`,
      })

      await refetch()
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (editMode === 'list') {
    return (
      <Card className="bg-muted/50 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-mono text-yellow-500">EDYTOR ITEMÓW</h4>
            <Button
              onClick={() => setEditMode('create')}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Nowy item
            </Button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {Object.values(items).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-background rounded border border-border hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.imagePath && (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <img src={item.imagePath} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div>
                    <p className="font-mono text-sm">{item.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <Badge variant="outline" className="text-xs">{item.rarity}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => loadItemForEdit(item.id)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-muted/50 border-yellow-500/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-mono text-yellow-500">
            {editMode === 'create' ? 'NOWY ITEM' : 'EDYTUJ ITEM'}
          </h4>
          <Button onClick={resetForm} size="sm" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ID itemu *</Label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="cyber_jacket_f"
                disabled={editMode === 'edit'}
              />
            </div>
            <div>
              <Label>Nazwa *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Cyber Jacket"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Typ</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ItemDefinition['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="weapon">Weapon</SelectItem>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="quest_item">Quest Item</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rzadkość</Label>
              <Select
                value={formData.rarity}
                onValueChange={(value: ItemDefinition['rarity']) => setFormData({ ...formData, rarity: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Opis przedmiotu..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ścieżka ikony</Label>
              <Input
                value={formData.imagePath}
                onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                placeholder="/items/icon.png"
              />
            </div>
            <div>
              <Label>Ścieżka overlay (clothing)</Label>
              <Input
                value={formData.clothingPath}
                onChange={(e) => setFormData({ ...formData, clothingPath: e.target.value })}
                placeholder="/clothing/female/tops/jacket.png"
              />
            </div>
          </div>

          {formData.type === 'clothing' && (
            <div>
              <Label>Slot ubrania</Label>
              <Select
                value={formData.clothingSlot || ''}
                onValueChange={(value) => setFormData({ ...formData, clothingSlot: value as ItemDefinition['clothingSlot'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="implant">Implant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Cena zakupu</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Cena sprzedaży</Label>
              <Input
                type="number"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Max stack</Label>
              <Input
                type="number"
                value={formData.maxStack}
                onChange={(e) => setFormData({ ...formData, maxStack: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.stackable}
              onCheckedChange={(checked) => setFormData({ ...formData, stackable: checked })}
            />
            <Label>Stackable (można układać w stos)</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveItem} disabled={loading} className="flex-1 gap-2">
              <Save className="w-4 h-4" />
              Zapisz
            </Button>
            <Button onClick={resetForm} variant="outline" className="flex-1">
              Anuluj
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
