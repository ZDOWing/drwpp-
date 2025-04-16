"use client"

import Link from "next/link"
import { Moon, Sun, Menu, X, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si l'utilisateur est connecté au chargement du composant
  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data.user)
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  // Connexion avec GitHub
  const handleGitHubSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'github' })
    } catch (error) {
      console.error("Erreur lors de la connexion avec GitHub:", error)
    }
  }

  // Connexion avec OTP (email)
  const handleOtpSignIn = async (email: string) => {
    try {
      await supabase.auth.signInWithOtp({ email })
      alert(`Un lien de connexion a été envoyé à ${email}`)
    } catch (error) {
      console.error("Erreur lors de l'envoi du lien de connexion:", error)
    }
  }

  // Déconnexion
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl uppercase tracking-widest font-normal">
            DRWPP STUDIO
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/" className="drwpp-nav-link">
                Accueil
              </Link>
              <Link href="/editor" className="drwpp-nav-link">
                Éditeur
              </Link>
              <Link href="/preview" className="drwpp-nav-link">
                Prévisualiser
              </Link>
            </nav>
            
            {/* Authentification */}
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.user_metadata?.avatar_url || ""} 
                          alt={user.user_metadata?.full_name || user.email} 
                        />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || "Utilisateur"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/editor" className="cursor-pointer flex w-full items-center">
                        <span>Éditeur</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGitHubSignIn}
                >
                  <User className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
              )
            )}
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-foreground" />
              ) : (
                <Moon size={18} className="text-foreground" />
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-background pt-24 px-6 z-40 flex flex-col md:hidden">
          <nav className="flex flex-col space-y-8 items-center">
            <Link 
              href="/" 
              className="text-lg drwpp-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              href="/editor" 
              className="text-lg drwpp-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Éditeur
            </Link>
            <Link 
              href="/preview" 
              className="text-lg drwpp-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Prévisualiser
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

