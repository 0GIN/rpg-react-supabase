/**
 * ADMIN PANEL DEBUG HELPER
 * 
 * Paste this into the browser console when on the app page to test admin functions
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Paste this entire file
 * 3. Run: await testAdminAccess()
 * 4. Run: await testAdminAddItem('nick', 'cyber_jacket_f', 1)
 * 5. Run: await testAdminGiveCredits('nick', 1000)
 * 6. Run: await testAdminGiveExp('nick', 100)
 * 7. Run: await testAdminGiveStreetCred('nick', 10)
 */

// Get Supabase client from window
const getSupabase = () => {
  if (window.supabase) return window.supabase
  throw new Error('Supabase client not found. Make sure you are on the app page.')
}

// Get current session
async function getSession() {
  const supabase = getSupabase()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) {
    throw new Error('Not authenticated. Please login first.')
  }
  return session
}

// Test if user is admin
async function testAdminAccess() {
  console.log('🔍 Testing admin access...')
  
  try {
    const session = await getSession()
    const supabase = getSupabase()
    
    console.log('👤 Current user ID:', session.user.id)
    
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single()
    
    if (error) {
      console.error('❌ Error checking admin status:', error)
      console.log('💡 You may need to add yourself to admin_users table:')
      console.log(`   INSERT INTO admin_users (user_id, is_admin) VALUES ('${session.user.id}', true);`)
      return false
    }
    
    if (data && data.is_admin) {
      console.log('✅ You ARE an admin!', data)
      return true
    } else {
      console.log('❌ You are NOT an admin:', data)
      console.log('💡 Run this SQL in Supabase:')
      console.log(`   UPDATE admin_users SET is_admin = true WHERE user_id = '${session.user.id}';`)
      return false
    }
  } catch (error) {
    console.error('❌ Exception:', error)
    return false
  }
}

// Test admin add item
async function testAdminAddItem(targetNick, itemId, quantity = 1) {
  console.log(`🧪 Testing admin add item: ${itemId} x${quantity} to ${targetNick}`)
  
  try {
    const session = await getSession()
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-add-item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        targetNick: targetNick.trim(),
        itemId,
        quantity
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('❌ Failed:', response.status, response.statusText, result)
      return false
    }
    
    console.log('✅ Success:', result)
    return true
  } catch (error) {
    console.error('❌ Exception:', error)
    return false
  }
}

// Test admin give credits
async function testAdminGiveCredits(targetNick, amount) {
  console.log(`🧪 Testing admin give credits: ${amount} to ${targetNick}`)
  
  try {
    const session = await getSession()
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-give-credits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        targetNick: targetNick.trim(),
        amount
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('❌ Failed:', response.status, response.statusText, result)
      return false
    }
    
    console.log('✅ Success:', result)
    return true
  } catch (error) {
    console.error('❌ Exception:', error)
    return false
  }
}

// Test admin give exp
async function testAdminGiveExp(targetNick, expAmount) {
  console.log(`🧪 Testing admin give exp: ${expAmount} to ${targetNick}`)
  
  try {
    const session = await getSession()
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-give-exp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        targetNick: targetNick.trim(),
        expAmount
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('❌ Failed:', response.status, response.statusText, result)
      return false
    }
    
    console.log('✅ Success:', result)
    return true
  } catch (error) {
    console.error('❌ Exception:', error)
    return false
  }
}

// Test admin give street cred
async function testAdminGiveStreetCred(targetNick, amount) {
  console.log(`🧪 Testing admin give street cred: ${amount} to ${targetNick}`)
  
  try {
    const session = await getSession()
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-give-street-cred`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        targetNick: targetNick.trim(),
        amount
      })
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('❌ Failed:', response.status, response.statusText, result)
      return false
    }
    
    console.log('✅ Success:', result)
    return true
  } catch (error) {
    console.error('❌ Exception:', error)
    return false
  }
}

console.log('✅ Admin debug helpers loaded!')
console.log('Run: await testAdminAccess()')
