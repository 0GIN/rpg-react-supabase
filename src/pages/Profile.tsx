import { useState } from 'react'
import { supabase } from '../services/supabaseClient'
import Layout from '../components/layout/Layout'
import './Profile.css'

interface Props {
  user: any
  onProfileCreated: () => void
}

export default function Profile({ user, onProfileCreated }: Props) {
  const [nick, setNick] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreateProfile() {
    if (!nick.trim()) return
    setLoading(true)
    try {
      console.log('Creating profile:', { nick, userId: user.id })
      const { data, error } = await supabase.from('postacie').insert([{ nick, user_id: user.id }])
      console.log('Insert result:', { data, error })
      if (error) {
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

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    console.log('Wylogowanie:', { error })
  }

  return (
    <Layout showUserInfo={false}>
      <div className="profile-container">
        <div className="profile-box">
          <h1 className="profile-title">Stwórz Postać</h1>
          <p className="profile-subtitle">Wybierz swoją tożsamość w Neon City</p>
          
          <div className="profile-form">
            <label className="profile-label" htmlFor="nick">Nick</label>
            <input
              id="nick"
              type="text"
              placeholder="Wprowadź swój nick..."
              value={nick}
              onChange={e => setNick(e.target.value)}
              className="profile-input"
              disabled={loading}
              maxLength={20}
            />
            
            <button
              onClick={handleCreateProfile}
              disabled={loading || !nick.trim()}
              className="btn-create-profile"
            >
              {loading ? 'Tworzenie...' : 'Stwórz Postać'}
            </button>
            
            <button
              onClick={handleLogout}
              disabled={loading}
              className="btn-logout-profile"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
