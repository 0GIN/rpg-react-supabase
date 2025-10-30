# Deploy Edge Functions to Supabase using Management API
# Wymagane: Personal Access Token z https://supabase.com/dashboard/account/tokens
# Project Ref z URL: https://supabase.com/dashboard/project/[PROJECT_REF]

param(
    [Parameter(Mandatory=$true)]
    [string]$AccessToken,
    
    [Parameter(Mandatory=$true)]
    [string]$ProjectRef
)

$headers = @{
    "Authorization" = "Bearer $AccessToken"
    "Content-Type" = "application/json"
}

$functions = @(
    @{
        name = "increase-stat"
        path = "supabase/functions/increase-stat/index.ts"
    },
    @{
        name = "use-item"
        path = "supabase/functions/use-item/index.ts"
    },
    @{
        name = "equip-item"
        path = "supabase/functions/equip-item/index.ts"
    }
)

Write-Host "🚀 Deploying Edge Functions to Supabase..." -ForegroundColor Cyan

foreach ($func in $functions) {
    Write-Host "`n📦 Deploying $($func.name)..." -ForegroundColor Yellow
    
    if (Test-Path $func.path) {
        $code = Get-Content $func.path -Raw
        
        $body = @{
            name = $func.name
            verify_jwt = $true
            import_map = @{
                imports = @{
                    "https://deno.land/std@0.168.0/" = "https://deno.land/std@0.168.0/"
                    "https://esm.sh/@supabase/supabase-js@2" = "https://esm.sh/@supabase/supabase-js@2"
                }
            }
            entrypoint_path = "index.ts"
            code = $code
        } | ConvertTo-Json -Depth 10
        
        Write-Host "   Kod funkcji załadowany ($(($code.Length)) znaków)" -ForegroundColor Gray
        Write-Host "   ⚠️  Uwaga: Deploy przez Management API może nie być dostępny" -ForegroundColor Yellow
        Write-Host "   Zalecam użycie: npx supabase functions deploy $($func.name)" -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ Plik nie znaleziony: $($func.path)" -ForegroundColor Red
    }
}

Write-Host "`n✅ Aby zdeployować funkcje, użyj Supabase CLI:" -ForegroundColor Green
Write-Host "   1. npx supabase login --token [TWOJ_TOKEN]" -ForegroundColor White
Write-Host "   2. npx supabase link --project-ref $ProjectRef" -ForegroundColor White
Write-Host "   3. npx supabase functions deploy increase-stat" -ForegroundColor White
Write-Host "   4. npx supabase functions deploy use-item" -ForegroundColor White
Write-Host "   5. npx supabase functions deploy equip-item" -ForegroundColor White

Write-Host "`n📖 Dokumentacja: https://supabase.com/docs/guides/functions" -ForegroundColor Cyan
