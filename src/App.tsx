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

  // Single function to check profile
  const checkProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('postacie')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
    
    console.log('App: checkProfile', { userId, data, error })
    
    if (error) {
      console.error('App: Error checking profile:', error)
      return false
    }
    
    return !!(data && data.id)
  }

  useEffect(() => {
    // Initial check on mount
    const initAuth = async () => {
      try {
        console.log('App: Starting initial auth check')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('App: Error getting session:', error)
          setLoading(false)
          return
        }

        const currentSession = data.session
        setSession(currentSession)

        if (currentSession?.user?.id) {
          const profileExists = await checkProfile(currentSession.user.id)
          setHasProfile(profileExists)
        } else {
          setHasProfile(false)
        }
      } catch (err) {
        console.error('App: Exception in initAuth:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      console.log('App: Auth state changed', { event, userId: sess?.user?.id })
      
      setSession(sess)

      if (sess?.user?.id) {
        const profileExists = await checkProfile(sess.user.id)
        setHasProfile(profileExists)
      } else {
        setHasProfile(false)
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Ładowanie...</p>
      </div>
    )
  }

  // No session = show login
  if (!session?.user?.id) {
    return <Login />
  }

  // Logged in but no profile = show profile creation
  if (!hasProfile) {
    return <Profile user={session.user} onProfileCreated={() => setHasProfile(true)} />
  }

  // Logged in and has profile = show dashboard
  return <Dashboard />
}
