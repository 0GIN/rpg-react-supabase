// Security: Use environment variable for allowed origin in production
// Set ALLOWED_ORIGIN in Supabase Edge Function secrets:
// supabase secrets set ALLOWED_ORIGIN=https://your-domain.com
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

// Helper function to check if origin is allowed
function getAllowedOrigin(requestOrigin: string | null): string {
  if (!requestOrigin) return ALLOWED_ORIGIN;
  
  // Allow all Vercel preview URLs (*.vercel.app)
  if (requestOrigin.endsWith('.vercel.app')) {
    return requestOrigin;
  }
  
  // Allow localhost for development
  if (requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1')) {
    return requestOrigin;
  }
  
  // Use configured origin or wildcard
  return ALLOWED_ORIGIN;
}

export function getCorsHeaders(requestOrigin: string | null) {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(requestOrigin),
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    // Supabase client adds an `apikey` header on requests from the browser.
    // Include it here so browser preflight (OPTIONS) will succeed.
    "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
    // Allow exposing response headers if needed by client
    "Access-Control-Expose-Headers": "Content-Length, Content-Type",
    "Access-Control-Max-Age": "3600",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Legacy export for backwards compatibility
export const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
  "Access-Control-Expose-Headers": "Content-Length, Content-Type",
  "Access-Control-Max-Age": "3600",
};