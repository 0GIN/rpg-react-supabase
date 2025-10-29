import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function InventoryPanel() {
  const items = [
    { id: 1, name: "IMPLANT NEURALNY MK-II", rarity: "RZADKI", equipped: true },
    { id: 2, name: "OSTRZE PLAZMOWE", rarity: "EPICKI", equipped: true },
    { id: 3, name: "KOMBINEZON STEALTH", rarity: "RZADKI", equipped: false },
    { id: 4, name: "NARZĘDZIE HAKERSKIE PRO", rarity: "POSPOLITY", equipped: false },
  ]

  return (
    <Card className="bg-card border-accent/30">
      <CardHeader>
        <CardTitle className="text-accent font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          EKWIPUNEK
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-muted/50 border border-border p-3 rounded-sm flex items-center justify-between hover:border-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background border border-border rounded-sm flex items-center justify-center">
                <img
                  src={`/cyberpunk-item.png?height=40&width=40&query=cyberpunk item ${item.name}`}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              <div>
                <p className="text-sm font-mono text-foreground">{item.name}</p>
                <Badge
                  variant="outline"
                  className={
                    item.rarity === "EPICKI"
                      ? "border-secondary text-secondary text-xs"
                      : item.rarity === "RZADKI"
                        ? "border-primary text-primary text-xs"
                        : "border-muted-foreground text-muted-foreground text-xs"
                  }
                >
                  {item.rarity}
                </Badge>
              </div>
            </div>
            {item.equipped && (
              <Badge variant="outline" className="border-accent text-accent text-xs">
                ZAŁOŻONY
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
