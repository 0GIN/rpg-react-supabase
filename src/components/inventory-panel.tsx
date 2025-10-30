import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Filter, Shirt, Swords, Pill, Wrench } from "lucide-react"
import type { Postac, InventoryItem, ItemType } from "@/types/gameTypes"
import { useItems } from "@/contexts/ItemsContext"
import { InventoryProvider, useInventory } from "@/contexts/InventoryContext"
import { RARITY_COLORS } from "@/data/items"

interface InventoryPanelProps {
  postac: Postac
  onEquipItem?: (itemId: string) => void
  onUnequipItem?: (itemId: string) => void
  onUseItem?: (itemId: string) => void
}

type FilterType = 'all' | ItemType

function InventoryPanelContent({ onEquipItem, onUnequipItem, onUseItem }: Omit<InventoryPanelProps, 'postac'>) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const { items } = useItems()
  const { inventory } = useInventory()

  // Get inventory with item definitions
  const inventoryWithDefs = useMemo(() => {
    return inventory
      .map(invItem => ({
        ...invItem,
        definition: items[invItem.itemId]
      }))
      .filter(item => item.definition !== undefined)
  }, [inventory, items])

  // Update selectedItem when inventory changes (after equip/unequip)
  useEffect(() => {
    if (selectedItem) {
      const updatedItem = inventoryWithDefs.find(item => item.itemId === selectedItem.itemId)
      if (updatedItem) {
        setSelectedItem(updatedItem)
      }
    }
  }, [inventoryWithDefs, selectedItem?.itemId])

  // Filter inventory
  const filteredInventory = useMemo(() => {
    if (filter === 'all') return inventoryWithDefs
    return inventoryWithDefs.filter(item => item.definition?.type === filter)
  }, [inventoryWithDefs, filter])

  // Group items by type for counts
  const typeCounts = useMemo(() => {
    const counts: Record<ItemType, number> = {
      clothing: 0,
      weapon: 0,
      consumable: 0,
      material: 0,
      quest_item: 0,
      other: 0,
    }
    inventoryWithDefs.forEach(item => {
      if (item.definition) {
        counts[item.definition.type] += item.quantity
      }
    })
    return counts
  }, [inventoryWithDefs])

  const selectedDef = selectedItem ? items[selectedItem.itemId] : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main inventory list */}
      <Card className="lg:col-span-2 bg-card border-accent/30">
        <CardHeader>
          <CardTitle className="text-accent font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              EKWIPUNEK
              <Badge variant="outline" className="ml-2">
                {inventoryWithDefs.length} przedmiotów
              </Badge>
            </div>
          </CardTitle>
          
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="text-xs"
            >
              <Filter className="w-3 h-3 mr-1" />
              Wszystko ({inventoryWithDefs.reduce((sum, item) => sum + item.quantity, 0)})
            </Button>
            <Button
              size="sm"
              variant={filter === 'clothing' ? 'default' : 'outline'}
              onClick={() => setFilter('clothing')}
              className="text-xs"
            >
              <Shirt className="w-3 h-3 mr-1" />
              Ubrania ({typeCounts.clothing})
            </Button>
            <Button
              size="sm"
              variant={filter === 'weapon' ? 'default' : 'outline'}
              onClick={() => setFilter('weapon')}
              className="text-xs"
            >
              <Swords className="w-3 h-3 mr-1" />
              Broń ({typeCounts.weapon})
            </Button>
            <Button
              size="sm"
              variant={filter === 'consumable' ? 'default' : 'outline'}
              onClick={() => setFilter('consumable')}
              className="text-xs"
            >
              <Pill className="w-3 h-3 mr-1" />
              Consumable ({typeCounts.consumable})
            </Button>
            <Button
              size="sm"
              variant={filter === 'material' ? 'default' : 'outline'}
              onClick={() => setFilter('material')}
              className="text-xs"
            >
              <Wrench className="w-3 h-3 mr-1" />
              Materiały ({typeCounts.material})
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Brak przedmiotów w tej kategorii</p>
            </div>
          ) : (
            filteredInventory.map((item) => {
              const def = item.definition!
              return (
                <div
                  key={`${item.itemId}-${item.obtainedAt}`}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-muted/50 border p-3 rounded-sm flex items-center justify-between hover:border-accent/50 transition-colors cursor-pointer ${
                    selectedItem?.itemId === item.itemId ? 'border-accent' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background border border-border rounded-sm flex items-center justify-center relative">
                      {def.imagePath ? (
                        <img src={def.imagePath} alt={def.name} className="w-full h-full object-cover rounded-sm" />
                      ) : (
                        <Package className="w-6 h-6 text-muted-foreground" />
                      )}
                      {item.quantity > 1 && (
                        <Badge className="absolute -bottom-1 -right-1 h-5 min-w-5 px-1 text-xs">
                          {item.quantity}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-mono ${RARITY_COLORS[def.rarity]}`}>
                        {def.name.toUpperCase()}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={`${RARITY_COLORS[def.rarity]} text-xs border-current`}>
                          {def.rarity.toUpperCase()}
                        </Badge>
                        {def.type === 'clothing' && def.clothingSlot && (
                          <Badge variant="outline" className="text-xs">
                            {def.clothingSlot}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {item.equipped && (
                    <Badge variant="outline" className="border-accent text-accent text-xs">
                      ZAŁOŻONY
                    </Badge>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Item details panel */}
      <Card className="bg-card border-accent/30 h-fit sticky top-4">
        <CardHeader>
          <CardTitle className="text-accent font-mono text-sm">SZCZEGÓŁY PRZEDMIOTU</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDef ? (
            <div className="space-y-4">
              <div className="w-full aspect-square bg-background border border-border rounded flex items-center justify-center">
                {selectedDef.imagePath ? (
                  <img src={selectedDef.imagePath} alt={selectedDef.name} className="w-full h-full object-contain" />
                ) : (
                  <Package className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              
              <div>
                <h3 className={`font-mono text-lg mb-1 ${RARITY_COLORS[selectedDef.rarity]}`}>
                  {selectedDef.name.toUpperCase()}
                </h3>
                <Badge variant="outline" className={`${RARITY_COLORS[selectedDef.rarity]} border-current`}>
                  {selectedDef.rarity.toUpperCase()}
                </Badge>
              </div>

              {selectedDef.description && (
                <p className="text-sm text-muted-foreground">{selectedDef.description}</p>
              )}

              {selectedDef.stats && Object.keys(selectedDef.stats).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-mono text-accent">STATYSTYKI:</p>
                  {Object.entries(selectedDef.stats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{stat}:</span>
                      <span className="text-foreground font-mono">+{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Typ:</span>
                  <span className="uppercase">{selectedDef.type}</span>
                </div>
                {selectedItem && (
                  <div className="flex justify-between">
                    <span>Ilość:</span>
                    <span>{selectedItem.quantity}</span>
                  </div>
                )}
                {selectedDef.price && (
                  <div className="flex justify-between">
                    <span>Wartość:</span>
                    <span className="text-yellow-400">{selectedDef.price} ¤</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                {selectedDef.type === 'clothing' && (
                  <>
                    {selectedItem?.equipped ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => onUnequipItem?.(selectedItem.itemId)}
                      >
                        Zdejmij
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => onEquipItem?.(selectedItem?.itemId || '')}
                      >
                        Załóż
                      </Button>
                    )}
                  </>
                )}
                
                {selectedDef.type === 'consumable' && (
                  <Button
                    className="w-full"
                    onClick={() => onUseItem?.(selectedItem?.itemId || '')}
                  >
                    Użyj
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">Wybierz przedmiot aby zobaczyć szczegóły</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function InventoryPanel(props: InventoryPanelProps) {
  return (
    <InventoryProvider postacId={props.postac?.id}>
      <InventoryPanelContent {...props} />
    </InventoryProvider>
  )
}
