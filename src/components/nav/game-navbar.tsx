/**
 * game-navbar.tsx - Główna nawigacja gry (nav/)
 */

"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Sword, Map, Users, ShoppingBag, Briefcase, Trophy, MessageCircle, Shield } from "lucide-react"

interface NavItem {
  label: string
  icon: React.ReactNode
  id: string
  children?: { label: string; id: string; external?: string }[]
}

const navItems: NavItem[] = [
  {
    label: "WALKA",
    icon: <Sword className="h-4 w-4" />,
    id: "combat",
    children: [
      { label: "Misje", id: "missions" },
      { label: "Arena", id: "arena" },
      { label: "Walki z Bossami", id: "bosses" },
    ],
  },
  {
    label: "ŚWIAT",
    icon: <Map className="h-4 w-4" />,
    id: "world",
    children: [
      { label: "Mapa Miasta", id: "map" },
      { label: "Dzielnice", id: "districts" },
      { label: "Lokacje", id: "locations" },
    ],
  },
  {
    label: "POSTAĆ",
    icon: <Users className="h-4 w-4" />,
    id: "character",
    children: [
      { label: "Umiejętności", id: "skills" },
      { label: "Augmentacje", id: "augments" },
      { label: "Statystyki", id: "stats" },
    ],
  },
  {
    label: "GANGI",
    icon: <Shield className="h-4 w-4" />,
    id: "gangs",
    children: [
      { label: "Mój Gang", id: "my-gang" },
      { label: "Lista Gangów", id: "gang-list" },
      { label: "Wojny Gangów", id: "gang-wars" },
      { label: "Terytorium", id: "territory" },
    ],
  },
  {
    label: "EKWIPUNEK",
    icon: <ShoppingBag className="h-4 w-4" />,
    id: "inventory",
    children: [
      { label: "Wyposażenie", id: "equipment" },
      { label: "Przedmioty", id: "items" },
      { label: "Crafting", id: "crafting" },
    ],
  },
  {
    label: "RYNEK",
    icon: <Briefcase className="h-4 w-4" />,
    id: "market",
    children: [
      { label: "Sklep", id: "shop" },
      { label: "Czarny Rynek", id: "blackmarket" },
      { label: "Handel", id: "trade" },
    ],
  },
  {
    label: "RANKINGI",
    icon: <Trophy className="h-4 w-4" />,
    id: "rankings",
  },
  {
    label: "SPOŁECZNOŚĆ",
    icon: <MessageCircle className="h-4 w-4" />,
    id: "community",
    children: [
      { label: "Discord", id: "discord", external: "https://discord.gg/neoncity" },
      { label: "Forum", id: "forum", external: "https://forum.neoncity.net" },
      { label: "Wiki", id: "wiki", external: "https://wiki.neoncity.net" },
    ],
  },
]

export function GameNavbar({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleClick = (item: { id: string; external?: string }) => {
    if (item.external) {
      window.open(item.external, "_blank")
    } else {
      onNavigate(item.id)
    }
  }

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border relative z-[1000]">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.id}
               className="relative z-50"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                onClick={() => !item.children && onNavigate(item.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-mono text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors border-b-2 border-transparent hover:border-primary"
              >
                {item.icon}
                <span>{item.label}</span>
                {item.children && <ChevronDown className="h-3 w-3" />}
              </button>

              {item.children && hoveredItem === item.id && (
                <div className="absolute top-full left-0 mt-0 bg-card border border-border shadow-lg min-w-[200px] z-[9999]">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleClick(child)}
                      className="w-full text-left px-4 py-3 text-sm font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors border-l-2 border-transparent hover:border-primary"
                    >
                      {child.label}
                      {child.external && <span className="ml-2 text-xs">↗</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
