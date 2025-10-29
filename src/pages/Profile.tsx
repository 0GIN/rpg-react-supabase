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
      if (mounted && data) {
        onProfileCreated()
      }
    })()
    return () => { mounted = false }
  }, [user.id, onProfileCreated])

  async function handleCreateProfile() {
    if (!nick.trim()) return
    setLoading(true)
    const { error } = await supabase.from('postacie').insert([{ nick, user_id: user.id }])
    if (error) {
      // If unique constraint prevents second profile, assume it exists
      if ((error as any)?.code === '23505') {
        onProfileCreated()
      } else {
        alert('Błąd: ' + error.message)
      }
    } else {
      onProfileCreated()
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 420, margin: '3rem auto' }}>
      <h3>Stwórz postać</h3>
      <input value={nick} onChange={e => setNick(e.target.value)} placeholder="Nick" />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleCreateProfile} disabled={loading}>
          {loading ? 'Tworzenie...' : 'Stwórz'}
        </button>
      </div>
    </div>
  )
}
