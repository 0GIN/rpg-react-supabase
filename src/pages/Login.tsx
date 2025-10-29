import { supabase } from '../services/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Layout from '../components/layout/Layout'
import './Login.css'

export default function AuthPage() {
  return (
    <Layout showUserInfo={false}>
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Neon City</h1>
          <p className="login-subtitle">Wejdź do mrocznego świata cyberpunku</p>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </Layout>
  )
}
