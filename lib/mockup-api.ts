/**
 * API de Mockup Dynamique
 * 
 * Cette API permet de générer des mockups pour les designs Wall Art
 * et de récupérer les ID associés à chaque rendu.
 */

// Fonction pour générer un ID unique sans dépendance externe
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

// Types pour l'API
export interface MockupRequest {
  designUrl: string;
  format: string;
  adjustments?: {
    scale?: number;
    rotation?: number;
    position?: { x: number; y: number };
  };
  filter?: string;
}

export interface MockupResponse {
  uuid: string;
  mockupUrl: string;
  format: string;
  timestamp: number;
}

// Données mockup temporaires (simulation locale)
const mockupData = [
  { id: 'living-room-1', name: 'Salon Moderne', url: '/mockups/living-room-1.jpg' },
  { id: 'living-room-2', name: 'Salon Scandinave', url: '/mockups/living-room-2.jpg' },
  { id: 'bedroom-1', name: 'Chambre Contemporaine', url: '/mockups/bedroom-1.jpg' },
  { id: 'office-1', name: 'Bureau Minimaliste', url: '/mockups/office-1.jpg' },
];

// Stockage local des mockups générés
interface StoredMockup extends MockupResponse {
  designUrl: string;
  format: string;
  adjustments?: {
    scale?: number;
    rotation?: number;
    position?: { x: number; y: number };
  };
  filter?: string;
}

// Fonction pour générer un mockup (simulation locale)
export async function generateMockup(request: MockupRequest): Promise<MockupResponse> {
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Générer un ID unique pour ce mockup
  const uuid = generateUniqueId();
  
  // Simuler une URL de mockup (dans une vraie implémentation, cela serait généré par l'API)
  const mockupIndex = Math.floor(Math.random() * mockupData.length);
  const mockupUrl = mockupData[mockupIndex].url;
  
  // Créer la réponse
  const response: MockupResponse = {
    uuid,
    mockupUrl,
    format: request.format,
    timestamp: Date.now()
  };
  
  // Stocker localement le mockup généré (pour simulation)
  const storedMockups = getStoredMockups();
  storedMockups.push({
    ...response,
    designUrl: request.designUrl,
    format: request.format,
    adjustments: request.adjustments,
    filter: request.filter
  });
  localStorage.setItem('drwpp_mockups', JSON.stringify(storedMockups));
  
  return response;
}

// Fonction pour récupérer un mockup par UUID
export function getMockupByUuid(uuid: string): StoredMockup | null {
  const storedMockups = getStoredMockups();
  return storedMockups.find(mockup => mockup.uuid === uuid) || null;
}

// Fonction pour récupérer tous les mockups stockés
export function getStoredMockups(): StoredMockup[] {
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem('drwpp_mockups');
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des mockups stockés:', error);
    return [];
  }
}

// Fonction pour supprimer un mockup par UUID
export function deleteMockupByUuid(uuid: string): boolean {
  const storedMockups = getStoredMockups();
  const filteredMockups = storedMockups.filter(mockup => mockup.uuid !== uuid);
  
  if (filteredMockups.length < storedMockups.length) {
    localStorage.setItem('drwpp_mockups', JSON.stringify(filteredMockups));
    return true;
  }
  
  return false;
}
