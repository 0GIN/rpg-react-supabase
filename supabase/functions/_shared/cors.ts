// Security: Use environment variable for allowed origin in production
// Set ALLOWED_ORIGIN in Supabase Edge Function secrets:
// supabase secrets set ALLOWED_ORIGIN=https://your-domain.com
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

export const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  // Supabase client adds an `apikey` header on requests from the browser.
  // Include it here so browser preflight (OPTIONS) will succeed.
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
  // Allow exposing response headers if needed by client
  "Access-Control-Expose-Headers": "Content-Length, Content-Type",
  "Access-Control-Max-Age": "3600",
};