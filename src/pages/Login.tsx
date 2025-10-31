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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Zap, Users, Trophy, Swords, Target, Shield } from 'lucide-react'

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar with Title, Auth and Discord */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-primary whitespace-nowrap leading-none">
              NEON CITY RPG
            </h1>
            
            {/* Compact Auth Form */}
            <div className="flex items-center justify-center flex-1">
              <Auth
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  className: {
                    container: 'auth-compact',
                    button: 'auth-button-compact',
                    input: 'auth-input-compact',
                  },
                  variables: {
                    default: {
                      colors: {
                        brand: 'hsl(var(--primary))',
                        brandAccent: 'hsl(var(--secondary))',
                        brandButtonText: 'hsl(var(--primary-foreground))',
                        defaultButtonBackground: 'hsl(var(--muted))',
                        defaultButtonBackgroundHover: 'hsl(var(--muted))',
                        inputBackground: 'hsl(var(--background))',
                        inputBorder: 'hsl(var(--border))',
                        inputBorderHover: 'hsl(var(--primary))',
                        inputBorderFocus: 'hsl(var(--ring))',
                        inputText: 'hsl(var(--foreground))',
                        inputLabelText: 'hsl(var(--foreground))',
                      },
                      radii: {
                        borderRadiusButton: 'var(--radius)',
                        buttonBorderRadius: 'var(--radius)',
                        inputBorderRadius: 'var(--radius)',
                      },
                      space: {
                        inputPadding: '6px 10px',
                        buttonPadding: '6px 14px',
                      },
                      fontSizes: {
                        baseInputSize: '14px',
                        baseButtonSize: '14px',
                      },
                    },
                  },
                  style: {
                    container: {
                      display: 'block',
                      width: '100%',
                    },
                    label: {
                      display: 'none',
                    },
                    divider: {
                      display: 'none',
                    },
                    anchor: {
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      margin: '8px 6px 0 6px',
                    },
                    input: {
                      width: '140px',
                      padding: '6px 10px',
                      display: 'inline-block',
                      margin: '0',
                    },
                    button: {
                      padding: '6px 16px',
                      display: 'inline-block',
                      margin: '0',
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
                      button_label: 'Zaloguj',
                      loading_button_label: 'Logowanie...',
                      email_input_placeholder: 'Email',
                      password_input_placeholder: 'Hasło',
                      link_text: 'Rejestracja',
                    },
                    sign_up: {
                      email_label: 'Email',
                      password_label: 'Hasło',
                      button_label: 'Zarejestruj',
                      loading_button_label: 'Rejestracja...',
                      email_input_placeholder: 'Email',
                      password_input_placeholder: 'Hasło',
                      link_text: 'Zaloguj',
                    },
                    forgotten_password: {
                      link_text: 'Zapomniałeś?',
                      button_label: 'Wyślij',
                      email_label: 'Email',
                      email_input_placeholder: 'Email',
                      loading_button_label: 'Wysyłanie...',
                    },
                  },
                }}
              />
            </div>
            
            {/* Discord Button */}
            <a 
              href="https://discord.gg/y6jw73vHeU" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold rounded transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Discord</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">

        {/* Game Features Section */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">
            O grze
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg max-w-3xl mx-auto">
            Zanurz się w świecie cyberpunkowego RPG, gdzie każda decyzja ma znaczenie. 
            Buduj swoją legendę w neonowych ulicach Night City.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 - Missions */}
            <Card className="hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Zlecenia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Wykonuj różnorodne misje dla korporacji, gangów i fiksów. 
                  Zdobywaj doświadczenie, kredyty i reputację na ulicach.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Character Development */}
            <Card className="hover:border-secondary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded bg-secondary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Rozwój Postaci</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rozwijaj umiejętności swojej postaci. Zwiększaj statystyki, 
                  zdobywaj nowe zdolności i cybernetyczne ulepszenia.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Arena */}
            <Card className="hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded bg-accent/10 flex items-center justify-center mb-4">
                  <Swords className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Arena PvP</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Zmierz się z innymi graczami w brutalnych walkach na arenie. 
                  Udowodnij, że jesteś najlepszym solo w mieście.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 - Gangs */}
            <Card className="hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Gangi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dołącz do gangu lub stwórz własny. Walcz o terytorium, 
                  kontroluj dzielnice i buduj swoją kryminalna imperię.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 - Equipment */}
            <Card className="hover:border-secondary/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded bg-secondary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Ekwipunek</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Zdobywaj legendarne bronie, opancerzenie i cybernetyczne implanty. 
                  Dostosuj swoją postać do własnego stylu gry.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 - Rankings */}
            <Card className="hover:border-accent/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded bg-accent/10 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Rankingi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Wspinaj się w rankingach graczy. Zdobywaj Street Cred 
                  i zostań legendą Night City.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              🎮 Darmowa gra przeglądarkowa
            </Badge>
            <p className="text-muted-foreground">
              Zarejestruj się i zacznij grać w ciągu minuty!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Neon City RPG. Wszystkie prawa zastrzeżone.</p>
          <p className="mt-2">
            Made with <span className="text-secondary">❤</span> for cyberpunk fans
          </p>
        </div>
      </footer>
    </div>
  )
}
