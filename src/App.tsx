import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    (async () => {
      console.log('App: Starting initial auth check')
      const { data } = await supabase.auth.getSession()
      console.log('App: getSession result:', { hasSession: !!data.session })
      setSession(data.session ?? null)
      if (data.session) {
        const uid = data.session.user.id
        const { data: p, error } = await supabase.from('postacie').select('*').eq('user_id', uid).maybeSingle()
        // Debug: log if there is an error or no profile found
        // This helps diagnose cases where RLS or permissions prevent reading the row
        console.log('check postacie (init):', { uid, p, error })
        setHasProfile(!!(p && p.id))
      }
      console.log('App: Initial check complete, setting loading = false')
      setLoading(false)
      setInitialCheckDone(true)
    })()

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      console.log('App: Auth state change:', event, { hasSession: !!sess })
      
      // Skip if this is the INITIAL_SESSION event (happens on mount)
      // We already handled it above
      if (!initialCheckDone && event === 'INITIAL_SESSION') {
        console.log('App: Skipping INITIAL_SESSION event')
        return
      }
      
      setSession(sess ?? null)
      if (sess?.user) {
        const uid = sess.user.id
        const { data: p, error } = await supabase.from('postacie').select('*').eq('user_id', uid).maybeSingle()
        console.log('check postacie (auth change):', { uid, p, error })
        setHasProfile(!!(p && p.id))
      } else {
        setHasProfile(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Show loading spinner while checking if user has character
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Ładowanie...</p>
      </div>
    )
  }

  if (!session) return <Login />

  if (!hasProfile) return <Profile user={session.user} onProfileCreated={() => setHasProfile(true)} />

  return <Dashboard />
}
