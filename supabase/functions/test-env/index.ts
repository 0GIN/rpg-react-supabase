import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'))
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Check if environment variables are set
  const envCheck = {
    SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? '✅ SET' : '❌ NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? '✅ SET' : '❌ NOT SET',
    SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ? '✅ SET' : '❌ NOT SET',
  }

  return new Response(
    JSON.stringify({
      message: 'Environment check',
      env: envCheck,
      timestamp: new Date().toISOString()
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
})
