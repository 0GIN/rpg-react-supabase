import { Trophy, TrendingUp } from "lucide-react"

export function RankingsSection() {
  const topPlayers = [
    { rank: 1, name: "V", level: 50, score: 125000 },
    { rank: 2, name: "Johnny_Silverhand", level: 48, score: 118500 },
    { rank: 3, name: "NetRunner_X", level: 47, score: 112300 },
    { rank: 4, name: "Corpo_Killer", level: 46, score: 108900 },
    { rank: 5, name: "Street_Samurai", level: 45, score: 105200 },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border p-6 rounded-sm">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold font-mono text-primary">RANKINGI GLOBALNE</h2>
        </div>

        <div className="space-y-2">
          {topPlayers.map((player) => (
            <div
              key={player.rank}
              className="bg-background border border-border p-4 rounded-sm flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 flex items-center justify-center font-bold font-mono ${
                    player.rank === 1
                      ? "text-primary"
                      : player.rank === 2
                        ? "text-accent"
                        : player.rank === 3
                          ? "text-secondary"
                          : "text-muted-foreground"
                  }`}
                >
                  #{player.rank}
                </div>
                <div>
                  <div className="font-mono text-sm text-foreground">{player.name}</div>
                  <div className="text-xs text-muted-foreground">Poziom {player.level}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm text-primary">{player.score.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
