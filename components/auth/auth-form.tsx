"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [user, setUser] = useState<any>(null)

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useState(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error)
      }
    }
    
    checkUser()
  })



  // Connexion avec OTP (email)
  const handleOtpSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    if (!email || !email.includes('@')) {
      setMessage({
        type: "error",
        text: "Veuillez entrer une adresse email valide"
      })
      setLoading(false)
      return
    }
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email 
      })
      
      if (error) throw error
      
      setMessage({
        type: "success",
        text: "Un lien de connexion a été envoyé à votre adresse email"
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue lors de l'envoi du lien"
      })
    } finally {
      setLoading(false)
    }
  }

  // Déconnexion
  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      await supabase.auth.signOut()
      setUser(null)
      setMessage({
        type: "success",
        text: "Vous avez été déconnecté avec succès"
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue lors de la déconnexion"
      })
    } finally {
      setLoading(false)
    }
  }

  // Afficher le profil si l'utilisateur est connecté
  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profil Utilisateur</CardTitle>
          <CardDescription>Vous êtes connecté en tant que {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            {user.user_metadata?.avatar_url && (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Formulaire de connexion
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Connectez-vous pour accéder à votre compte DRWPP</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOtpSignIn} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            {loading ? "Envoi..." : "Recevoir un lien de connexion"}
          </Button>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.text}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
