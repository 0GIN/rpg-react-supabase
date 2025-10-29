import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

interface Props {
  user: any
  onProfileCreated: () => void
}

export default function Profile({ user, onProfileCreated }: Props) {
  const [nick, setNick] = useState('')
  const [loading, setLoading] = useState(false)

  // If a profile already exists (e.g., created earlier), skip this screen
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data, error } = await supabase
        .from('postacie')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      // eslint-disable-next-line no-console
      console.log('Profile preload check:', { userId: user.id, data, error })
      if (mounted && data && data.id) {
        onProfileCreated()
      }
    })()
    return () => { mounted = false }
  }, [user.id, onProfileCreated])

  async function handleCreateProfile() {
    if (!nick.trim()) return
    setLoading(true)
    try {
      console.log('Creating profile:', { nick, userId: user.id })
      const { data, error } = await supabase.from('postacie').insert([{ nick, user_id: user.id }])
      console.log('Insert result:', { data, error })
      if (error) {
        // If unique constraint prevents second profile, assume it exists
        if ((error as any)?.code === '23505') {
          console.log('Profile already exists (23505), redirecting...')
          onProfileCreated()
        } else {
          console.error('Insert error:', error)
          alert('Błąd: ' + error.message)
        }
      } else {
        console.log('Profile created successfully')
        onProfileCreated()
      }
    } catch (err) {
      console.error('Exception in handleCreateProfile:', err)
      alert('Błąd połączenia: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem', border: '2px solid #333', borderRadius: 8 }}>
      <h2>Stwórz postać</h2>
      <input
        type="text"
        placeholder="Nick"
        value={nick}
        onChange={e => setNick(e.target.value)}
        style={{ width: '100%', marginBottom: 16, padding: 8 }}
        disabled={loading}
      />
      <button
        onClick={handleCreateProfile}
        disabled={loading || !nick.trim()}
        style={{ width: '100%', marginBottom: 16 }}
      >
        {loading ? 'Tworzenie...' : 'Stwórz'}
      </button>
      <button
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          console.log('Wylogowanie:', { error });
        }}
        disabled={loading}
        style={{ width: '100%' }}
      >
        Wyloguj
      </button>
    </div>
  )
}
