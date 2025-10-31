/**
 * App.tsx - Główny komponent aplikacji
 * 
 * Zarządza routingiem aplikacji i sesją użytkownika. Odpowiada za:
 * - Uwierzytelnianie przez Supabase
 * - Sprawdzanie istnienia profilu gracza
 * - Przekierowanie między ekranem logowania, tworzeniem profilu i głównym dashboardem
 * - Zapewnienie motywu (ThemeProvider)
 */

import { useEffect, useState } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Profile from './pages/Profile'
import DashboardNew from './pages/DashboardNew'
import type { Session } from '@supabase/supabase-js'
import { ThemeProvider } from '@/components/providers/theme-provider'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  // Robust profile check with soft timeout + single retry to avoid hanging UI
  const checkProfile = async (userId: string): Promise<boolean> => {
    try {
      console.log('checkProfile: Querying for userId:', userId)

      const runQuery = async () => {
        return await supabase
          .from('postacie')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()
      }

      const withTimeout = <T,>(p: Promise<T>, ms: number) =>
        new Promise<T>((resolve) => {
          const id = setTimeout(() => {
            console.warn('checkProfile: timeout after', ms, 'ms — proceeding optimistically')
            // @ts-ignore
            resolve({ data: { id: 'timeout' }, error: null } as any)
          }, ms)
          p.then((v: any) => { clearTimeout(id); resolve(v) })
            .catch(() => { clearTimeout(id); /* treat as transient error */
              // @ts-ignore
              resolve({ data: { id: 'error' }, error: null } as any) })
        })

      // First try (1.5s). On timeout/error, proceed optimistically
      const first: any = await withTimeout(runQuery(), 1500)
      console.log('checkProfile: Result first try:', first)

      if (!first?.error && first?.data && first.data.id) {
        return true
      }

      // Quick retry once (1s)
      const second: any = await withTimeout(runQuery(), 1000)
      console.log('checkProfile: Result retry:', second)

      if (second?.error) {
        console.error('checkProfile error:', second.error)
        return true // assume exists to avoid flicker
      }

      const hasProfile = !!(second?.data && second.data.id)
      console.log('checkProfile: hasProfile =', hasProfile)
      return hasProfile
    } catch (err) {
      console.error('checkProfile exception:', err)
      return true // assume exists on exception
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
          // Do not block initial load on profile check
          checkProfile(session.user.id).then((profileExists) => {
            console.log('App: Profile exists:', profileExists)
            if (mounted) setHasProfile(profileExists)
          })
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
      <ThemeProvider defaultTheme="dark" storageKey="neoncity-theme">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Ładowanie...</p>
        </div>
      </ThemeProvider>
    )
  }

  // No session = show login
  if (!session?.user?.id) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="neoncity-theme">
        <Login />
      </ThemeProvider>
    )
  }

  // Still checking profile
  if (hasProfile === null) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="neoncity-theme">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Sprawdzanie profilu...</p>
        </div>
      </ThemeProvider>
    )
  }

  // Logged in but no profile = show profile creation
  if (!hasProfile) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="neoncity-theme">
        <Profile user={session.user} onProfileCreated={() => setHasProfile(true)} />
      </ThemeProvider>
    )
  }

  // Logged in and has profile = show dashboard
  return (
    <ThemeProvider defaultTheme="dark" storageKey="neoncity-theme">
      <DashboardNew />
    </ThemeProvider>
  )
}
