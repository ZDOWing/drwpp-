/**
 * Client Supabase simulé (version de développement sans dépendance externe)
 * 
 * Note: Ceci est une simulation du client Supabase pour le développement
 * Dans un environnement de production, utilisez le client officiel:
 * import { createClient } from '@supabase/supabase-js'
 */

// Utilisation des variables d'environnement
const supabaseUrl = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL ? 
  process.env.NEXT_PUBLIC_SUPABASE_URL : 'https://dzdxaqujgldpkyisizkq.supabase.co';

const supabaseAnonKey = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6ZHhhcXVqZ2xkcGt5aXNpemtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI1MzU1NywiZXhwIjoyMDU5ODI5NTU3fQ.-_N5M6aW5V6WCGyXGNgbONGf-YEeNSJlq72aXuDE73o';

// Configuration de Supabase

// Variables pour l'authentification
const siteUrl = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL ? 
  process.env.NEXT_PUBLIC_SITE_URL : 'http://localhost:3000';

const jwtSecret = typeof process !== 'undefined' && process.env.SUPABASE_JWT_SECRET ? 
  process.env.SUPABASE_JWT_SECRET : '5+pOkbBb8fa+ai/2Yp5BKnR8LS1pOrgz0p68daZE6e4c2g/7B6XoOXisRCZSOjGh21xLO9wVTsjJSKkoGWEa2w==';

// Exporter les variables pour utilisation dans d'autres fichiers
export const config = {
  supabaseUrl,
  supabaseAnonKey,
  siteUrl,
  jwtSecret
};

// Interface pour les réponses Supabase
interface SupabaseResponse<T> {
  data: T;
  error: Error | null;
}

// Client Supabase simulé
const createSupabaseClient = () => {
  return {
  // Méthodes d'authentification
  auth: {
    // Connexion avec OAuth (GitHub, Google, etc.)
    signInWithOAuth: ({ provider }: { provider: string }) => {
      console.log(`Simulation de connexion avec ${provider}`);
      // Dans une vraie implémentation, cela redirigerait vers le fournisseur OAuth
      if (typeof window !== 'undefined') {
        window.open(`https://example.com/auth/${provider}`, '_blank');
      }
      return Promise.resolve({
        data: { provider, session: null },
        error: null
      });
    },
    
    // Connexion avec OTP (One-Time Password)
    signInWithOtp: ({ email }: { email: string }) => {
      console.log(`Simulation d'envoi d'un code à ${email}`);
      // Dans une vraie implémentation, cela enverrait un email avec un code
      return Promise.resolve({
        data: { email },
        error: null
      });
    },
    
    // Récupérer l'utilisateur connecté
    getUser: () => {
      // Simuler un utilisateur connecté
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        user_metadata: {
          full_name: 'Utilisateur Test',
          avatar_url: 'https://via.placeholder.com/150'
        }
      };
      
      console.log('Récupération de l\'utilisateur connecté:', mockUser);
      return Promise.resolve({
        data: { user: mockUser },
        error: null
      });
    },
    
    // Déconnexion
    signOut: () => {
      console.log('Déconnexion de l\'utilisateur');
      return Promise.resolve({
        error: null
      });
    }
  },
  
  // Méthodes de stockage
  storage: {
    from: (bucket: string) => ({
      // Récupérer l'URL publique d'un fichier
      getPublicUrl: (path: string) => {
        return {
          data: {
            publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
          }
        };
      },
      // Télécharger un fichier
      upload: (path: string, file: File): Promise<SupabaseResponse<{ path: string }>> => {
        console.log(`Simulation d'upload vers ${bucket}/${path}`);
        return Promise.resolve({
          data: { path },
          error: null
        });
      },
      // Supprimer un fichier
      remove: (paths: string[]): Promise<SupabaseResponse<{ path: string }>> => {
        console.log(`Simulation de suppression de ${paths.join(', ')}`);
        return Promise.resolve({
          data: { path: paths[0] },
          error: null
        });
      }
    })
  },
  
  // Méthodes de base de données
  from: (table: string) => ({
    // Sélectionner des données
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => {
        console.log(`Simulation de select ${columns} from ${table} where ${column} = ${value}`);
        return Promise.resolve({
          data: [],
          error: null
        });
      },
      order: (column: string, { ascending }: { ascending: boolean }) => {
        const direction = ascending ? 'asc' : 'desc';
        console.log(`Simulation de select ${columns} from ${table} order by ${column} ${direction}`);
        return Promise.resolve({
          data: [],
          error: null
        });
      }
    }),
    // Insérer des données
    insert: (data: any): Promise<SupabaseResponse<any>> => {
      console.log(`Simulation d'insertion dans ${table}:`, data);
      return Promise.resolve({
        data: { ...data, id: Date.now() },
        error: null
      });
    },
    // Mettre à jour des données
    update: (data: any) => ({
      eq: (column: string, value: any): Promise<SupabaseResponse<any>> => {
        console.log(`Simulation de mise à jour dans ${table} où ${column} = ${value}:`, data);
        return Promise.resolve({
          data: { ...data },
          error: null
        });
      }
    }),
    // Supprimer des données
    delete: () => ({
      eq: (column: string, value: any): Promise<SupabaseResponse<null>> => {
        console.log(`Simulation de suppression dans ${table} où ${column} = ${value}`);
        return Promise.resolve({
          data: null,
          error: null
        });
      }
    })
  })
  }
}

// Exporter une instance du client
export const supabase = typeof window !== 'undefined' ? createSupabaseClient() : createSupabaseClient();
