import type { ZlecenieDefinicja } from '../../types/gameTypes'
import './MissionCard.css'

interface MissionCardProps {
  zlecenie: ZlecenieDefinicja
  onStart: (id: number) => void
  disabled?: boolean
}

export default function MissionCard({ zlecenie, onStart, disabled = false }: MissionCardProps) {
  const durationMinutes = Math.ceil(zlecenie.czas_trwania_sekundy / 60)

  return (
    <div className="mission-card">
      <div className="mission-header">
        <h3 className="mission-title">{zlecenie.nazwa}</h3>
        <div className="mission-duration">{durationMinutes} min</div>
      </div>
      
      <p className="mission-description">{zlecenie.opis}</p>
      
      <div className="mission-rewards">
        <div className="reward">{zlecenie.nagrody.kredyty || 0} kredytów</div>
        <div className="reward">+{zlecenie.nagrody.street_cred || 0} Street Cred</div>
      </div>
      
      <button 
        className="btn-start-mission"
        onClick={() => onStart(zlecenie.id)}
        disabled={disabled}
      >
        Rozpocznij Zlecenie
      </button>
    </div>
  )
}
