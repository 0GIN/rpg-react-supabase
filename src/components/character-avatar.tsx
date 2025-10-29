"use client"

interface CharacterAvatarProps {
  customization: {
    hair: string
    outfit: string
    accessories: string
    skinTone: string
  }
  size?: "sm" | "md" | "lg"
}

export function CharacterAvatar({ customization, size = "md" }: CharacterAvatarProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-48 h-48",
  }

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 200 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Body silhouette - base layer */}
        <g id="body-base" opacity="0.8">
          {/* Head */}
          <ellipse
            cx="100"
            cy="50"
            rx="30"
            ry="35"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />

          {/* Neck */}
          <rect
            x="90"
            y="80"
            width="20"
            height="15"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />

          {/* Torso */}
          <path
            d="M 70 95 L 70 180 L 80 200 L 120 200 L 130 180 L 130 95 Z"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />

          {/* Arms */}
          <path
            d="M 70 100 L 50 120 L 45 180 L 55 185 L 65 130 L 70 120"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
          <path
            d="M 130 100 L 150 120 L 155 180 L 145 185 L 135 130 L 130 120"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />

          {/* Legs */}
          <path
            d="M 85 200 L 80 250 L 75 290 L 85 295 L 92 250 L 95 210"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
          <path
            d="M 115 200 L 120 250 L 125 290 L 115 295 L 108 250 L 105 210"
            fill="url(#bodyGlow)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
        </g>

        <g id="outfit-layer" filter="url(#neonGlow)">
          {customization.outfit === "tactical-jacket" && (
            <>
              <path d="M 65 95 L 65 160 L 75 165 L 75 100 Z" fill="hsl(var(--accent))" opacity="0.7" />
              <path d="M 135 95 L 135 160 L 125 165 L 125 100 Z" fill="hsl(var(--accent))" opacity="0.7" />
              <rect
                x="75"
                y="95"
                width="50"
                height="70"
                fill="hsl(var(--accent))"
                opacity="0.8"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
              />
              <line x1="100" y1="95" x2="100" y2="165" stroke="hsl(var(--primary))" strokeWidth="1" />
            </>
          )}
          {customization.outfit === "street-hoodie" && (
            <>
              <path d="M 60 95 L 60 140 L 70 145 L 70 100 Z" fill="hsl(var(--muted))" opacity="0.7" />
              <path d="M 140 95 L 140 140 L 130 145 L 130 100 Z" fill="hsl(var(--muted))" opacity="0.7" />
              <rect x="70" y="95" width="60" height="75" rx="5" fill="hsl(var(--muted))" opacity="0.8" />
              <ellipse cx="100" cy="70" rx="40" ry="25" fill="hsl(var(--muted))" opacity="0.6" />
            </>
          )}
        </g>

        <g id="hair-layer" filter="url(#neonGlow)">
          {customization.hair === "cyber-mohawk" && (
            <path
              d="M 85 25 L 90 15 L 95 10 L 100 8 L 105 10 L 110 15 L 115 25"
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="8"
              strokeLinecap="round"
            />
          )}
          {customization.hair === "long-ponytail" && (
            <>
              <ellipse cx="100" cy="40" rx="32" ry="30" fill="hsl(var(--foreground))" opacity="0.6" />
              <path d="M 130 50 Q 140 80 135 120" stroke="hsl(var(--foreground))" strokeWidth="6" fill="none" />
            </>
          )}
          {customization.hair === "buzz-cut" && (
            <ellipse cx="100" cy="40" rx="30" ry="25" fill="hsl(var(--foreground))" opacity="0.5" />
          )}
        </g>

        <g id="accessories-layer" filter="url(#neonGlow)">
          {customization.accessories === "visor" && (
            <>
              <rect x="70" y="45" width="60" height="12" rx="2" fill="hsl(var(--primary))" opacity="0.8" />
              <line x1="70" y1="51" x2="130" y2="51" stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.6" />
            </>
          )}
          {customization.accessories === "face-mask" && (
            <path
              d="M 75 60 L 75 70 Q 100 75 125 70 L 125 60"
              fill="hsl(var(--muted))"
              opacity="0.8"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
            />
          )}
          {customization.accessories === "neural-implant" && (
            <>
              <circle cx="125" cy="55" r="4" fill="hsl(var(--accent))" />
              <line x1="125" y1="55" x2="135" y2="50" stroke="hsl(var(--accent))" strokeWidth="1.5" />
              <line x1="125" y1="55" x2="135" y2="60" stroke="hsl(var(--accent))" strokeWidth="1.5" />
            </>
          )}
        </g>

        {/* Cyberpunk glow effects */}
        <g opacity="0.3">
          <circle cx="100" cy="50" r="45" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
          <circle cx="100" cy="150" r="35" fill="none" stroke="hsl(var(--accent))" strokeWidth="0.5" opacity="0.3" />
        </g>
      </svg>
    </div>
  )
}
