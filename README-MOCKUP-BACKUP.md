# Système de Backup pour les Mockups de Produits

Ce document explique comment configurer et utiliser le système de backup pour la génération de mockups de produits dans l'application DRWPP.

## Architecture

Le système utilise deux approches pour générer des mockups :
1. **Système principal** : Supabase Edge Functions
2. **Système de backup** : API Dynamic Mockups

En cas d'échec du système principal (timeout, erreur, etc.), le système bascule automatiquement vers l'API Dynamic Mockups.

## Configuration

### 1. Structure de la base de données

Deux tables principales sont utilisées :
- `products` : Informations sur les produits
- `product_variations` : Variations des produits avec leurs zones d'impression et UUID

### 2. Politiques de sécurité RLS

Les politiques RLS (Row Level Security) permettent de contrôler l'accès aux données :

#### Via l'interface Supabase
1. Accédez au tableau de bord Supabase
2. Naviguez vers "Authentication" > "Policies"
3. Sélectionnez la table (ex: `products`)
4. Cliquez sur "New Policy" et configurez les conditions

#### Via SQL (déjà inclus dans le script de migration)
```sql
-- Activer RLS sur les tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Permettre la lecture publique des produits" ON products
  FOR SELECT USING (true);

-- Politique pour les administrateurs
CREATE POLICY "Permettre la gestion des produits aux administrateurs" ON products
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');
```

### 3. Ajout de données de test

#### Via l'interface Supabase
1. Accédez à "Table Editor"
2. Sélectionnez la table (ex: `products`)
3. Cliquez sur "Insert Row" et remplissez les champs

#### Via SQL (déjà inclus dans le script de migration)
```sql
-- Données de test pour les produits
INSERT INTO products (id, name, description, default_print_area) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Poster Standard', 'Poster papier haute qualité', '{"x": 50, "y": 50, "width": 400, "height": 600, "rotation": 0}');

-- Données de test pour les variations
INSERT INTO product_variations (product_id, name, color, size, mockup_uuid, background_url, print_area) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Poster A3 Blanc', 'Blanc', 'A3', 'poster-a3-white', 'https://storage.googleapis.com/mockups-backgrounds/poster-a3-white.jpg', '{"x": 50, "y": 50, "width": 400, "height": 600, "rotation": 0}');
```

#### Via la CLI Supabase
```bash
# Exécuter la migration
supabase db push

# OU exécuter manuellement le script SQL
supabase db remote commit -f supabase/migrations/20250410_product_mockups.sql
```

#### Via le script JavaScript
```bash
# Exécuter le script d'insertion de données
node scripts/seed-test-data.js
```

## Utilisation dans l'application

Le hook `useMockupGenerator` a été mis à jour pour utiliser le système de backup :

```typescript
const { 
  generateMockup, 
  isGenerating, 
  mockupUrl, 
  error,
  status,
  mockupSource  // 'primary' ou 'backup'
} = useMockupGenerator();
```

## Tests

Pour tester le système de backup :

```bash
# Exécuter le script de test
node scripts/test-mockup-backup.js
```

## Configuration de l'API Dynamic Mockups

Les informations d'API sont déjà configurées dans le service :
- **API Key** : `44e7a804-7bdf-4187-b41c-e8ac603f62a1:e7427b11f479f45357ae0e413a0e731d6ca5cfab7118e1ebb5762b12350b8f65`
- **API URL** : `https://api.dynamicmockups.com`

## Performances

Le système est configuré avec un timeout de 5 secondes pour le système principal, garantissant une expérience utilisateur fluide même en cas de problème.
