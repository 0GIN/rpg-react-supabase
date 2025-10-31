import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DefaultSection() {
  return (
    <Card className="bg-card border-primary/30">
      <CardHeader>
        <CardTitle className="text-primary font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          WITAJ W NIGHT CITY
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-muted-foreground font-mono space-y-3">
          <p className="text-lg">
            Witaj, Samurai. Przygotuj się na życie pełne adrenaliny w mrocznym świecie cyberpunku.
          </p>
          <div className="border-l-2 border-accent pl-4 space-y-2 py-2">
            <p className="text-accent font-bold">ROZPOCZNIJ OD:</p>
            <ul className="space-y-2 text-sm">
              <li>🎯 <span className="text-foreground">ZLECENIA</span> - wykonuj misje i zdobywaj nagrody</li>
              <li>⚔️ <span className="text-foreground">ARENA</span> - walcz z innymi graczami o dominację</li>
              <li>🛠️ <span className="text-foreground">EKWIPUNEK</span> - zarządzaj swoim wyposażeniem</li>
              <li>📊 <span className="text-foreground">STATYSTYKI</span> - rozwijaj umiejętności swojej postaci</li>
              <li>🏪 <span className="text-foreground">SKLEP</span> - kupuj ulepszenia i sprzęt</li>
            </ul>
          </div>
          <p className="text-sm italic border-t border-border pt-3 mt-4">
            "W Night City każdy oddech może być ostatni. Bądź szybki, bezwzględny i zawsze o krok przed konkurencją."
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
