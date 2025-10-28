import { supabase } from '../services/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AuthPage() {
  return (
    <div style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h2>Zaloguj / Zarejestruj</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={window.location.origin}
      />
    </div>
  )
}
