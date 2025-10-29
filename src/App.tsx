import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  // Fast profile check
  const checkProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log('checkProfile: Querying for userId:', userId)
      const { data, error } = await supabase
        .from('postacie')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      
      console.log('checkProfile: Result:', { data, error })
      
      if (error) {
        console.error('checkProfile error:', error)
        return false
      }
      
      const hasProfile = !!(data && data.id)
      console.log('checkProfile: hasProfile =', hasProfile)
      return hasProfile
    } catch (err) {
      console.error('checkProfile exception:', err)
      return false
    }
  }

  useEffect(() => {
    let mounted = true

    // Get initial session
    const init = async () => {
      try {
        console.log('App: Getting session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('App: Session result:', { hasSession: !!session, userId: session?.user?.id, error })
        
        if (!mounted) return
        
        setSession(session)
        
        if (session?.user?.id) {
          console.log('App: Checking profile for user:', session.user.id)
          const profileExists = await checkProfile(session.user.id)
          console.log('App: Profile exists:', profileExists)
          if (mounted) {
            setHasProfile(profileExists)
          }
        } else {
          console.log('App: No session, setting hasProfile to null')
          setHasProfile(null)
        }
      } catch (err) {
        console.error('App: init error:', err)
        setHasProfile(null)
      } finally {
        if (mounted) {
          console.log('App: Init complete, setting loading to false')
          setLoading(false)
        }
      }
    }

    init()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)
      
      if (!mounted) return

      setSession(session)

      if (event === 'SIGNED_IN' && session?.user?.id) {
        // Check if profile exists
        const profileExists = await checkProfile(session.user.id)
        if (mounted) {
          setHasProfile(profileExists)
        }
      } else if (event === 'SIGNED_OUT') {
        setHasProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Show loading spinner only on initial load
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

  // Still checking profile
  if (hasProfile === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Sprawdzanie profilu...</p>
      </div>
    )
  }

  // Logged in but no profile = show profile creation
  if (!hasProfile) {
    return <Profile user={session.user} onProfileCreated={() => setHasProfile(true)} />
  }

  // Logged in and has profile = show dashboard
  return <Dashboard />
}
