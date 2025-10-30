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
