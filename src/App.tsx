import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [hasProfile, setHasProfile] = useState(false)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      if (data.session) {
        const uid = data.session.user.id
        const { data: p, error } = await supabase.from('postacie').select('*').eq('user_id', uid).maybeSingle()
        // Debug: log if there is an error or no profile found
        // This helps diagnose cases where RLS or permissions prevent reading the row
        console.log('check postacie (init):', { uid, p, error })
        setHasProfile(!!p)
      }
    })()

    const { data: sub } = supabase.auth.onAuthStateChange(async (_, sess) => {
      setSession(sess ?? null)
      if (sess?.user) {
        const uid = sess.user.id
        const { data: p, error } = await supabase.from('postacie').select('*').eq('user_id', uid).maybeSingle()
        console.log('check postacie (auth change):', { uid, p, error })
        setHasProfile(!!p)
      } else {
        setHasProfile(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!session) return <Login />

  if (!hasProfile) return <Profile user={session.user} onProfileCreated={() => setHasProfile(true)} />

  return <Dashboard />
}
