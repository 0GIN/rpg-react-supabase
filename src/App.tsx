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
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    // Initial check on mount
    (async () => {
      try {
        console.log('App: Starting initial auth check')
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout after 5s')), 5000)
        )
        const { data, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any
        if (sessionError) {
          console.error('App: Error getting session:', sessionError)
          setLoading(false)
          setLoadingProfile(false)
          return
        }
        setSession(data.session ?? null)
        if (data.session) {
          setLoadingProfile(true)
          const uid = data.session.user.id
          const { data: p, error: selectError } = await supabase.from('postacie').select('*').eq('user_id', uid).maybeSingle()
          console.log('App: SELECT postacie', { uid, profile: p, hasProfile: !!(p && p.id), selectError });
          if (selectError) {
            console.error('App: SELECT postacie error:', selectError)
          }
          setHasProfile(!!(p && p.id))
          setLoadingProfile(false)
        } else {
          setLoadingProfile(false)
        }
      } catch (err) {
        setLoading(false)
        setLoadingProfile(false)
      } finally {
        setLoading(false)
      }
    })()

    // Listen for auth changes (login, logout, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange(async (_, sess) => {
      setSession(sess ?? null)
      if (sess?.user) {
        setLoadingProfile(true)
        const uid = sess.user.id
        const { data: p } = await supabase
          .from('postacie')
          .select('*')
          .eq('user_id', uid)
          .maybeSingle()
        setHasProfile(!!(p && p.id))
        setLoadingProfile(false)
      } else {
        setHasProfile(false)
        setLoadingProfile(false)
      }
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  // Show loading spinner while checking if user has character
  if (loading || loadingProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Ładowanie...</p>
      </div>
    )
  }

  // ZAWSZE: brak sesji lub brak usera = ekran logowania
  if (!session || !session.user || typeof session.user.id !== 'string' || !session.user.id) {
    return <Login />
  }

  // Zalogowany, ale nie masz postaci
  if (session && session.user && !hasProfile) {
    return <Profile user={session.user} onProfileCreated={() => setHasProfile(true)} />
  }

  // Zalogowany i masz postać
  if (session && session.user && hasProfile) {
    return <Dashboard />
  }

  return null
}
