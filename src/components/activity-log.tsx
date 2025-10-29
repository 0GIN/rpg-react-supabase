import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ActivityLog() {
  const activities = [
    { id: 1, time: "14:32", message: "Ukończono misję: WYŚCIG ULICZNY", type: "success" },
    { id: 2, time: "14:15", message: "Zdobyto 1,500 kredytów", type: "reward" },
    { id: 3, time: "13:58", message: "Awans! Teraz poziom 42", type: "level" },
    { id: 4, time: "13:45", message: "Rozpoczęto misję: KRADZIEŻ DANYCH", type: "info" },
    { id: 5, time: "13:30", message: "Założono: OSTRZE PLAZMOWE", type: "info" },
    { id: 6, time: "13:12", message: "Ulepszono umiejętność: HAKOWANIE +1", type: "skill" },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground font-mono flex items-center gap-2">
          <span className="text-accent">▸</span>
          DZIENNIK AKTYWNOŚCI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 text-sm font-mono p-2 hover:bg-muted/50 rounded-sm transition-colors"
              >
                <span className="text-muted-foreground text-xs">{activity.time}</span>
                <span
                  className={
                    activity.type === "success"
                      ? "text-accent"
                      : activity.type === "reward"
                        ? "text-secondary"
                        : activity.type === "level"
                          ? "text-primary"
                          : activity.type === "skill"
                            ? "text-primary"
                            : "text-foreground"
                  }
                >
                  {activity.message}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
