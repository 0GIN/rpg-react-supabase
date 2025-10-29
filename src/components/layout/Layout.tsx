import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
  showUserInfo?: boolean
  nick?: string
  kredyty?: number
  streetCred?: number
}

export default function Layout({ children, showUserInfo, nick, kredyty, streetCred }: LayoutProps) {
  return (
    <div className="layout">
      <Navbar 
        showUserInfo={showUserInfo}
        nick={nick}
        kredyty={kredyty}
        streetCred={streetCred}
      />
      
      <main className="main-content">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}
