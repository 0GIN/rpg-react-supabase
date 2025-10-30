/**
 * main.tsx - Punkt wejścia aplikacji React
 * 
 * Główny plik inicjalizacyjny aplikacji. Renderuje aplikację do DOM,
 * konfiguruje StrictMode i opakowuje aplikację w ItemsProvider dla globalnego
 * zarządzania stanem przedmiotów w grze.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ItemsProvider } from './contexts/ItemsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ItemsProvider>
      <App />
    </ItemsProvider>
  </StrictMode>,
)
