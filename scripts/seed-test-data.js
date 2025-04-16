/**
 * Script pour insérer des données de test dans les tables products et product_variations
 */

// Utilisation de fetch pour la compatibilité avec tous les environnements
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dzdxaqujgldpkyisizkq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Données de test pour les produits
const testProducts = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Poster Standard',
    description: 'Poster papier haute qualité',
    default_print_area: {
      x: 50,
      y: 50,
      width: 400,
      height: 600,
      rotation: 0
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Toile Canvas',
    description: 'Impression sur toile tendue sur châssis',
    default_print_area: {
      x: 30,
      y: 30,
      width: 500,
      height: 500,
      rotation: 0
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Cadre Photo',
    description: 'Cadre en bois avec impression photo',
    default_print_area: {
      x: 60,
      y: 60,
      width: 300,
      height: 400,
      rotation: 0
    }
  }
];

// Données de test pour les variations de produits
const testVariations = [
  {
    product_id: '11111111-1111-1111-1111-111111111111',
    name: 'Poster A3 Blanc',
    color: 'Blanc',
    size: 'A3',
    mockup_uuid: 'poster-a3-white',
    background_url: 'https://storage.googleapis.com/mockups-backgrounds/poster-a3-white.jpg',
    print_area: {
      x: 50,
      y: 50,
      width: 400,
      height: 600,
      rotation: 0
    }
  },
  {
    product_id: '11111111-1111-1111-1111-111111111111',
    name: 'Poster A3 Noir',
    color: 'Noir',
    size: 'A3',
    mockup_uuid: 'poster-a3-black',
    background_url: 'https://storage.googleapis.com/mockups-backgrounds/poster-a3-black.jpg',
    print_area: {
      x: 50,
      y: 50,
      width: 400,
      height: 600,
      rotation: 0
    }
  },
  {
    product_id: '22222222-2222-2222-2222-222222222222',
    name: 'Canvas 40x40 Blanc',
    color: 'Blanc',
    size: '40x40',
    mockup_uuid: 'canvas-40x40-white',
    background_url: 'https://storage.googleapis.com/mockups-backgrounds/canvas-40x40-white.jpg',
    print_area: {
      x: 30,
      y: 30,
      width: 500,
      height: 500,
      rotation: 0
    }
  },
  {
    product_id: '33333333-3333-3333-3333-333333333333',
    name: 'Cadre 20x30 Noir',
    color: 'Noir',
    size: '20x30',
    mockup_uuid: 'frame-20x30-black',
    background_url: 'https://storage.googleapis.com/mockups-backgrounds/frame-20x30-black.jpg',
    print_area: {
      x: 60,
      y: 60,
      width: 300,
      height: 400,
      rotation: 0
    }
  }
];

/**
 * Insère les données de test dans Supabase
 */
async function seedTestData() {
  console.log('🌱 Insertion des données de test...');

  try {
    // Insérer les produits
    console.log('Insertion des produits...');
    for (const product of testProducts) {
      const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Erreur lors de l'insertion du produit ${product.name}:`, error);
      } else {
        console.log(`✅ Produit inséré: ${product.name}`);
      }
    }

    // Insérer les variations
    console.log('\nInsertion des variations de produits...');
    for (const variation of testVariations) {
      const response = await fetch(`${supabaseUrl}/rest/v1/product_variations`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(variation)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Erreur lors de l'insertion de la variation ${variation.name}:`, error);
      } else {
        console.log(`✅ Variation insérée: ${variation.name}`);
      }
    }

    console.log('\n✅ Données de test insérées avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données de test:', error);
  }
}

// Exécuter le script
seedTestData();
