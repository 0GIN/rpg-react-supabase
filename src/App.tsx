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

  useEffect(() => {
    // Initial check on mount
    (async () => {
      try {
        console.log('App: Starting initial auth check')
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('App: Error getting session:', sessionError)
          setLoading(false)
          return
        }
        
        console.log('App: getSession result:', { hasSession: !!data.session })
        setSession(data.session ?? null)
        
        if (data.session) {
          const uid = data.session.user.id
          console.log('App: Checking profile for user:', uid)
          
          const { data: p, error } = await supabase
            .from('postacie')
            .select('*')
            .eq('user_id', uid)
            .maybeSingle()
          
          console.log('App: Profile check result:', { 
            hasProfile: !!(p && p.id), 
            profileData: p, 
            error 
          })
          
          setHasProfile(!!(p && p.id))
        }
      } catch (err) {
        console.error('App: Unexpected error in initial check:', err)
      } finally {
        console.log('App: Initial check complete, setting loading = false')
        setLoading(false)
      }
    })()

    // Listen for auth changes (login, logout, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      console.log('App: Auth state change event:', event, { hasSession: !!sess })
      
      setSession(sess ?? null)
      
      if (sess?.user) {
        const uid = sess.user.id
        const { data: p, error } = await supabase
          .from('postacie')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle()
        
        console.log('App: Profile check after auth change:', { hasProfile: !!(p && p.id), error })
        setHasProfile(!!(p && p.id))
      } else {
        setHasProfile(false)
      }
    })
    
    return () => {
      console.log('App: Cleaning up auth listener')
      sub.subscription.unsubscribe()
    }
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
