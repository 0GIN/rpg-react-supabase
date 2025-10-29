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
    let mounted = true

    // Initial check on mount
    const initAuth = async () => {
      try {
        console.log('App: Starting initial auth check')
        
        // Try to get session with reasonable timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 10000)
        )
        
        const { data, error } = await Promise.race([sessionPromise, timeoutPromise]) as any
        
        if (!mounted) return

        if (error) {
          console.error('App: Error getting session:', error)
          setLoading(false)
          return
        }

        const currentSession = data.session
        console.log('App: Got session', { hasSession: !!currentSession, userId: currentSession?.user?.id })
        setSession(currentSession)

        if (currentSession?.user?.id) {
          console.log('App: Checking profile for user:', currentSession.user.id)
          const profileExists = await checkProfile(currentSession.user.id)
          if (!mounted) return
          console.log('App: Profile check result:', profileExists)
          setHasProfile(profileExists)
        } else {
          console.log('App: No session, setting hasProfile to false')
          setHasProfile(false)
        }
      } catch (err) {
        console.error('App: Exception in initAuth:', err)
        if (!mounted) return
        setSession(null)
        setHasProfile(false)
      } finally {
        if (mounted) {
          console.log('App: Finished auth check, setting loading to false')
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      console.log('App: Auth state changed', { event, userId: sess?.user?.id })
      
      if (!mounted) return

      setSession(sess)

      if (sess?.user?.id) {
        const profileExists = await checkProfile(sess.user.id)
        if (!mounted) return
        setHasProfile(profileExists)
      } else {
        setHasProfile(false)
      }
    })

    return () => {
      mounted = false
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
