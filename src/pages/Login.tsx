/**
 * Login.tsx - Strona logowania i rejestracji
 * 
 * Ekran uwierzytelniania użytkownika wykorzystujący Supabase Auth UI.
 * Obsługuje logowanie, rejestrację i resetowanie hasła.
 * Wyświetla się gdy użytkownik nie jest zalogowany.
 */

import { supabase } from '../services/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#16213e] to-[#1a1a2e] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-cyan/30 shadow-2xl shadow-cyan/20">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">
            NEON CITY
          </CardTitle>
          <CardDescription className="text-base">
            Wejdź do mrocznego świata cyberpunku
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#00d9ff',
                    brandAccent: '#ff00ff',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#1a1a2e',
                    defaultButtonBackgroundHover: '#16213e',
                    inputBackground: 'rgba(0, 0, 0, 0.4)',
                    inputBorder: 'rgba(0, 217, 255, 0.3)',
                    inputBorderHover: '#00d9ff',
                    inputBorderFocus: '#00d9ff',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Hasło',
                  button_label: 'Zaloguj się',
                  loading_button_label: 'Logowanie...',
                  email_input_placeholder: 'Twój email',
                  password_input_placeholder: 'Twoje hasło',
                  link_text: 'Masz już konto? Zaloguj się',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Hasło',
                  button_label: 'Zarejestruj się',
                  loading_button_label: 'Rejestracja...',
                  email_input_placeholder: 'Twój email',
                  password_input_placeholder: 'Twoje hasło',
                  link_text: 'Nie masz konta? Zarejestruj się',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
