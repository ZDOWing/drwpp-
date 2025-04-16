# Configuration des variables d'environnement pour DRWPP

Pour configurer correctement l'application DRWPP avec Supabase, vous devez créer un fichier `.env.local` à la racine du projet avec les variables d'environnement suivantes.

## Étapes à suivre

1. Créez un fichier nommé `.env.local` à la racine du projet DRWPP
2. Copiez le contenu ci-dessous dans ce fichier
3. Redémarrez votre serveur de développement Next.js

## Contenu du fichier .env.local

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dzdxaqujgldpkyisizkq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6ZHhhcXVqZ2xkcGt5aXNpemtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDI1MzU1NywiZXhwIjoyMDU5ODI5NTU3fQ.-_N5M6aW5V6WCGyXGNgbONGf-YEeNSJlq72aXuDE73o

# Dynamic Mockup API
# Ces clés sont déjà configurées dans le code

# Authentication
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_JWT_SECRET=5+pOkbBb8fa+ai/2Yp5BKnR8LS1pOrgz0p68daZE6e4c2g/7B6XoOXisRCZSOjGh21xLO9wVTsjJSKkoGWEa2w==
```

## Installation du client Supabase officiel

Lorsque vous serez prêt à utiliser le client Supabase officiel, exécutez la commande suivante :

```bash
npm install @supabase/supabase-js
```

Puis remplacez le contenu du fichier `lib/supabaseClient.ts` par :

```typescript
import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Création du client Supabase avec les variables d'environnement
export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);

// Exporter la configuration pour utilisation dans d'autres fichiers
export { config };
```

## Utilisation de l'API Dynamic Mockup

L'application utilise désormais exclusivement l'API Dynamic Mockup pour générer les prévisualisations. Les clés d'API sont configurées directement dans le code source pour simplifier le déploiement.

## Sécurité

N'oubliez pas que le fichier `.env.local` contient des informations sensibles et ne doit jamais être partagé ou commité dans votre dépôt Git. Il est automatiquement ignoré par le fichier `.gitignore` de Next.js.
