import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Neon City RPG</h3>
            <p>Cyberpunkowa przygoda w mrocznym świecie przyszłości</p>
          </div>
          
          <div className="footer-section">
            <h4>Linki</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>O grze</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Pomoc</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Discord</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Kontakt</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>GitHub</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Twitter</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Email</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Neon City RPG. Powered by Supabase & Vercel.</p>
        </div>
      </div>
    </footer>
  )
}
