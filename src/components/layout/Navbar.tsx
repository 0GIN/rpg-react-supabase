import { supabase } from '../../services/supabaseClient'
import './Navbar.css'

interface NavbarProps {
  nick?: string
  kredyty?: number
  streetCred?: number
  showUserInfo?: boolean
}

export default function Navbar({ nick, kredyty, streetCred, showUserInfo = false }: NavbarProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-logo">⚡ Neon City RPG</h1>
        </div>
        
        {showUserInfo && (
          <div className="navbar-user">
            <div className="user-stats">
              <span className="user-nick">{nick}</span>
              <span className="user-stat">💰 {kredyty}</span>
              <span className="user-stat">⭐ {streetCred}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              Wyloguj
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
