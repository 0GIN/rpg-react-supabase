import { useEffect, useState } from 'react';
import type { AktywneZlecenie, ZlecenieDefinicja } from '../../types/gameTypes';
import './ActiveMission.css';

interface ActiveMissionProps {
  aktywneZlecenie: AktywneZlecenie;
  zlecenieDefinicja: ZlecenieDefinicja;
  onClaim: () => void;
  disabled?: boolean;
}

export default function ActiveMission({ aktywneZlecenie, zlecenieDefinicja, onClaim, disabled = false }: ActiveMissionProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const endTime = new Date(aktywneZlecenie.koniec_zlecenia_o).getTime();
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(remaining);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [aktywneZlecenie]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isComplete = timeRemaining === 0;

  return (
    <div className="active-mission">
      <div className="active-mission-header">
        <h2>Aktywne Zlecenie</h2>
        <div className={`status-badge ${isComplete ? 'complete' : 'in-progress'}`}>
          {isComplete ? '✓ Ukończone' : '⟳ W trakcie'}
        </div>
      </div>

      <div className="active-mission-content">
        <h3 className="active-mission-title">{zlecenieDefinicja.nazwa}</h3>
        <p className="active-mission-description">{zlecenieDefinicja.opis}</p>

        <div className="timer-section">
          <div className="timer-label">Pozostały czas:</div>
          <div className={`timer ${isComplete ? 'complete' : ''}`}>
            {isComplete ? '00:00:00' : formatTime(timeRemaining)}
          </div>
        </div>

        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ 
              width: `${100 - (timeRemaining / (zlecenieDefinicja.czas_trwania_sekundy * 1000)) * 100}%` 
            }}
          />
        </div>

        <div className="active-mission-rewards">
          <div className="reward-item">
            <span className="reward-label">Nagroda:</span>
            <span className="reward-value">{zlecenieDefinicja.nagrody.kredyty || 0} kredytów</span>
          </div>
          <div className="reward-item">
            <span className="reward-label">Street Cred:</span>
            <span className="reward-value">+{zlecenieDefinicja.nagrody.street_cred || 0}</span>
          </div>
        </div>

        <button
          className="btn-claim"
          onClick={onClaim}
          disabled={!isComplete || disabled}
        >
          {isComplete ? 'Odbierz Nagrodę' : 'Czekaj na ukończenie...'}
        </button>
      </div>
    </div>
  );
}
