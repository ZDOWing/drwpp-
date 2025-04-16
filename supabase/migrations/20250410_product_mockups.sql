-- Migration pour la création des tables de produits et variations pour le système de backup de mockups
-- Date: 2025-04-10

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  default_print_area JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "width": 500, "height": 500, "rotation": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des variations de produits
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  size TEXT,
  mockup_uuid TEXT NOT NULL, -- UUID spécifique pour l'API Dynamic Mockups
  background_url TEXT NOT NULL, -- URL de l'image de fond
  print_area JSONB NOT NULL, -- Zone d'impression spécifique à cette variation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_product_variations_product_id ON product_variations(product_id);

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour mettre à jour automatiquement le champ updated_at
CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_product_variations_modtime
BEFORE UPDATE ON product_variations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Politiques RLS (Row Level Security) pour la sécurité
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Permettre la lecture publique des produits" ON products
  FOR SELECT USING (true);

CREATE POLICY "Permettre la lecture publique des variations" ON product_variations
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion/mise à jour/suppression par les administrateurs seulement
CREATE POLICY "Permettre la gestion des produits aux administrateurs" ON products
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Permettre la gestion des variations aux administrateurs" ON product_variations
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Données de test pour les produits
INSERT INTO products (id, name, description, default_print_area) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Poster Standard', 'Poster papier haute qualité', '{"x": 50, "y": 50, "width": 400, "height": 600, "rotation": 0}'),
  ('22222222-2222-2222-2222-222222222222', 'Toile Canvas', 'Impression sur toile tendue sur châssis', '{"x": 30, "y": 30, "width": 500, "height": 500, "rotation": 0}'),
  ('33333333-3333-3333-3333-333333333333', 'Cadre Photo', 'Cadre en bois avec impression photo', '{"x": 60, "y": 60, "width": 300, "height": 400, "rotation": 0}')
ON CONFLICT (id) DO NOTHING;

-- Données de test pour les variations de produits
INSERT INTO product_variations (product_id, name, color, size, mockup_uuid, background_url, print_area) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Poster A3 Blanc', 'Blanc', 'A3', 'poster-a3-white', 'https://storage.googleapis.com/mockups-backgrounds/poster-a3-white.jpg', '{"x": 50, "y": 50, "width": 400, "height": 600, "rotation": 0}'),
  ('11111111-1111-1111-1111-111111111111', 'Poster A3 Noir', 'Noir', 'A3', 'poster-a3-black', 'https://storage.googleapis.com/mockups-backgrounds/poster-a3-black.jpg', '{"x": 50, "y": 50, "width": 400, "height": 600, "rotation": 0}'),
  ('22222222-2222-2222-2222-222222222222', 'Canvas 40x40 Blanc', 'Blanc', '40x40', 'canvas-40x40-white', 'https://storage.googleapis.com/mockups-backgrounds/canvas-40x40-white.jpg', '{"x": 30, "y": 30, "width": 500, "height": 500, "rotation": 0}'),
  ('22222222-2222-2222-2222-222222222222', 'Canvas 60x40 Blanc', 'Blanc', '60x40', 'canvas-60x40-white', 'https://storage.googleapis.com/mockups-backgrounds/canvas-60x40-white.jpg', '{"x": 30, "y": 30, "width": 700, "height": 500, "rotation": 0}'),
  ('33333333-3333-3333-3333-333333333333', 'Cadre 20x30 Noir', 'Noir', '20x30', 'frame-20x30-black', 'https://storage.googleapis.com/mockups-backgrounds/frame-20x30-black.jpg', '{"x": 60, "y": 60, "width": 300, "height": 400, "rotation": 0}'),
  ('33333333-3333-3333-3333-333333333333', 'Cadre 30x40 Bois', 'Bois', '30x40', 'frame-30x40-wood', 'https://storage.googleapis.com/mockups-backgrounds/frame-30x40-wood.jpg', '{"x": 80, "y": 80, "width": 400, "height": 500, "rotation": 0}')
ON CONFLICT (id) DO NOTHING;
