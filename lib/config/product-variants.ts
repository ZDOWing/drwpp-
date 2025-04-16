/**
 * Configuration des variantes de produits avec leurs UUID spécifiques pour l'API Dynamic Mockups
 */

export interface ProductVariantConfig {
  id: string;
  name: string;
  mockupUuid: string;
  smartObjectUuid: string;
  width: number; // largeur en cm
  height: number; // hauteur en cm
  description?: string;
}

export interface ProductConfig {
  id: string;
  name: string;
  variants: ProductVariantConfig[];
}

/**
 * Configuration des produits Canvas avec leurs variantes
 */
export const CANVAS_PRODUCT: ProductConfig = {
  id: 'canvas',
  name: 'Canvas',
  variants: [
    // Formats carrés
    {
      id: 'square-30x30',
      name: 'Carré 30×30 cm',
      mockupUuid: '03c8f957-e2b1-422e-a25a-293f2059ee48',
      smartObjectUuid: 'd2c14be6-cab6-4cbd-9b9a-c024f7f342b9',
      width: 30,
      height: 30,
      description: 'Format carré 30×30 cm'
    },
    {
      id: 'square-40x40',
      name: 'Carré 40×40 cm',
      mockupUuid: '03c8f957-e2b1-422e-a25a-293f2059ee48',
      smartObjectUuid: 'd2c14be6-cab6-4cbd-9b9a-c024f7f342b9',
      width: 40,
      height: 40,
      description: 'Format carré 40×40 cm'
    },
    {
      id: 'square-50x50',
      name: 'Carré 50×50 cm',
      mockupUuid: '03c8f957-e2b1-422e-a25a-293f2059ee48',
      smartObjectUuid: 'd2c14be6-cab6-4cbd-9b9a-c024f7f342b9',
      width: 50,
      height: 50,
      description: 'Format carré 50×50 cm'
    },
    
    // Formats portrait
    {
      id: 'portrait-30x40',
      name: 'Portrait 30×40 cm',
      mockupUuid: '08f31960-10cf-4102-82fd-708ed8e41847',
      smartObjectUuid: '261b96c6-1d44-40d7-a218-d5ac78500ec6',
      width: 30,
      height: 40,
      description: 'Format portrait 30×40 cm'
    },
    {
      id: 'portrait-50x70',
      name: 'Portrait 50×70 cm',
      mockupUuid: '08f31960-10cf-4102-82fd-708ed8e41847',
      smartObjectUuid: '261b96c6-1d44-40d7-a218-d5ac78500ec6',
      width: 50,
      height: 70,
      description: 'Format portrait 50×70 cm'
    },
    {
      id: 'portrait-60x90',
      name: 'Portrait 60×90 cm',
      mockupUuid: '08f31960-10cf-4102-82fd-708ed8e41847',
      smartObjectUuid: '261b96c6-1d44-40d7-a218-d5ac78500ec6',
      width: 60,
      height: 90,
      description: 'Format portrait 60×90 cm'
    },
    
    // Formats paysage
    {
      id: 'landscape-40x30',
      name: 'Paysage 40×30 cm',
      mockupUuid: '6521c8d7-ebb6-4172-9fa0-ab63bf498b90',
      smartObjectUuid: '7ee345a1-ee9b-4491-aad0-d0782997604a',
      width: 40,
      height: 30,
      description: 'Format paysage 40×30 cm'
    },
    {
      id: 'landscape-70x50',
      name: 'Paysage 70×50 cm',
      mockupUuid: '6521c8d7-ebb6-4172-9fa0-ab63bf498b90',
      smartObjectUuid: '7ee345a1-ee9b-4491-aad0-d0782997604a',
      width: 70,
      height: 50,
      description: 'Format paysage 70×50 cm'
    },
    {
      id: 'landscape-90x60',
      name: 'Paysage 90×60 cm',
      mockupUuid: '6521c8d7-ebb6-4172-9fa0-ab63bf498b90',
      smartObjectUuid: '7ee345a1-ee9b-4491-aad0-d0782997604a',
      width: 90,
      height: 60,
      description: 'Format paysage 90×60 cm'
    }
  ]
};

/**
 * Liste de tous les produits disponibles
 */
export const PRODUCTS: ProductConfig[] = [
  CANVAS_PRODUCT
];

/**
 * Fonction pour récupérer un produit par son ID
 */
export function getProductById(productId: string): ProductConfig | undefined {
  return PRODUCTS.find(product => product.id === productId);
}

/**
 * Fonction pour récupérer une variante de produit par son ID
 */
export function getVariantById(productId: string, variantId: string): ProductVariantConfig | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;
  
  return product.variants.find(variant => variant.id === variantId);
}

/**
 * Fonction pour récupérer l'UUID de mockup pour une variante spécifique
 */
export function getMockupUuid(productId: string, variantId: string): string | undefined {
  const variant = getVariantById(productId, variantId);
  return variant?.mockupUuid;
}
