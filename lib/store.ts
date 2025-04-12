import { create } from "zustand"
import { persist, createJSONStorage, StateStorage, PersistOptions } from "zustand/middleware"

// Fonction pour générer un ID unique sans dépendance externe
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

// Interface TextElement supprimée

// Types de filtres disponibles
export type FilterType = 'normal' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'saturate' | 'custom'

// Type TextAlign supprimé

export interface FilterSettings {
  type: FilterType
  intensity?: number
  customCss?: string
}

// État du design avec historique
export interface DesignState {
  id: string
  imageUrl: string | null
  format: string | null
  formatType?: string // Type de format (carré, portrait, paysage)
  scale: number
  rotation: number
  position: { x: number; y: number }
  hasChanges: boolean
  filter: FilterSettings
  // textLayers supprimés
  flipX: boolean // Renommé de isFlippedH à flipX
  flipY: boolean // Renommé de isFlippedV à flipY
  productOptions?: {
    // Options spécifiques aux t-shirts
    size?: string
    color?: string
    printArea?: string
    
    // Options spécifiques aux mugs
    mugType?: string
    designPosition?: string
  }
}

// Interface pour l'historique
export interface HistoryState {
  past: DesignState[]
  present: DesignState
  future: DesignState[]
}

interface DesignStore {
  history: HistoryState
  design: DesignState
  setDesign: (design: DesignState) => void
  resetDesign: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  // Fonctions de gestion du texte supprimées
  setFilter: (filter: FilterSettings) => void
  toggleFlipX: () => void
  toggleFlipY: () => void
}

const initialState: DesignState = {
  id: generateUniqueId(),
  imageUrl: null,
  format: "30x40", // Format par défaut
  formatType: "portrait", // Type de format par défaut
  scale: 1,
  rotation: 0,
  position: { x: 0, y: 0 },
  hasChanges: false,
  filter: { type: 'normal' },
  // textLayers supprimés
  flipX: false,
  flipY: false,
}

const initialHistoryState: HistoryState = {
  past: [],
  present: initialState,
  future: [],
}

// Cette fonction n'est plus nécessaire avec le middleware persist
// Gardée pour référence mais n'est plus utilisée
const loadInitialState = (): HistoryState => {
  if (typeof window === "undefined") return initialHistoryState

  try {
    const savedState = localStorage.getItem("drwpp-design-storage")
    if (savedState) {
      const parsed = JSON.parse(savedState)
      if (parsed.state?.history) {
        const history = parsed.state.history;
        
        // Migration des propriétés renommées
        if (history.present) {
          // Migrer textElements vers textLayers
          if (history.present.textElements && !history.present.textLayers) {
            history.present.textLayers = history.present.textElements;
            delete history.present.textElements;
          }
          
          // Migrer isFlippedH vers flipX
          if (history.present.isFlippedH !== undefined && history.present.flipX === undefined) {
            history.present.flipX = history.present.isFlippedH;
            delete history.present.isFlippedH;
          }
          
          // Migrer isFlippedV vers flipY
          if (history.present.isFlippedV !== undefined && history.present.flipY === undefined) {
            history.present.flipY = history.present.isFlippedV;
            delete history.present.isFlippedV;
          }
        }
        
        // Appliquer les mêmes migrations aux états passés et futurs
        history.past = history.past.map((state: any) => {
          const newState = { ...state };
          
          if (newState.textElements && !newState.textLayers) {
            newState.textLayers = newState.textElements;
            delete newState.textElements;
          }
          
          if (newState.isFlippedH !== undefined && newState.flipX === undefined) {
            newState.flipX = newState.isFlippedH;
            delete newState.isFlippedH;
          }
          
          if (newState.isFlippedV !== undefined && newState.flipY === undefined) {
            newState.flipY = newState.isFlippedV;
            delete newState.isFlippedV;
          }
          
          return newState;
        });
        
        history.future = history.future.map((state: any) => {
          const newState = { ...state };
          
          if (newState.textElements && !newState.textLayers) {
            newState.textLayers = newState.textElements;
            delete newState.textElements;
          }
          
          if (newState.isFlippedH !== undefined && newState.flipX === undefined) {
            newState.flipX = newState.isFlippedH;
            delete newState.isFlippedH;
          }
          
          if (newState.isFlippedV !== undefined && newState.flipY === undefined) {
            newState.flipY = newState.isFlippedV;
            delete newState.isFlippedV;
          }
          
          return newState;
        });
        
        return history;
      } else if (parsed.state?.design) {
        // Migration de l'ancien format vers le nouveau
        const design = parsed.state.design;
        // S'assurer que le design a un ID
        if (!design.id) design.id = generateUniqueId();
        // S'assurer que le filtre est un objet
        if (typeof design.filter === 'string') {
          design.filter = { type: design.filter as FilterType };
        }
        
        // Migration des propriétés renommées
        if (design.textElements && !design.textLayers) {
          design.textLayers = design.textElements;
          delete design.textElements;
        } else if (!design.textLayers) {
          design.textLayers = [];
        }
        
        if (design.isFlippedH !== undefined && design.flipX === undefined) {
          design.flipX = design.isFlippedH;
          delete design.isFlippedH;
        } else if (design.flipX === undefined) {
          design.flipX = false;
        }
        
        if (design.isFlippedV !== undefined && design.flipY === undefined) {
          design.flipY = design.isFlippedV;
          delete design.isFlippedV;
        } else if (design.flipY === undefined) {
          design.flipY = false;
        }
        
        return {
          past: [],
          present: design,
          future: [],
        };
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement depuis localStorage:", error)
  }

  return initialHistoryState
}

export const useDesignStore = create<DesignStore>()(persist((set, get) => ({
  history: initialHistoryState,
  design: initialState,
  setDesign: (design) => {
    const { history } = get();
    const newHistory = {
      past: [...history.past, history.present],
      present: { ...design, id: design.id || generateUniqueId() },
      future: [],
    };
    
    set({ 
      design: newHistory.present,
      history: newHistory 
    });

    // Sauvegarder dans localStorage
    if (typeof window !== "undefined") {
      try {
        // Créer une copie pour éviter de modifier l'état original
        const historyForStorage = { ...newHistory };
        const designForStorage = { ...historyForStorage.present };
        
        // Limiter la taille de l'historique pour localStorage
        historyForStorage.past = historyForStorage.past.slice(-10);
        historyForStorage.future = historyForStorage.future.slice(0, 10);
        
        // Si l'URL de l'image est une data URL, la remplacer par un placeholder
        if (designForStorage.imageUrl && designForStorage.imageUrl.startsWith('data:')) {
          designForStorage.imageUrl = "[DATA_URL]";
        }
        
        historyForStorage.present = designForStorage;
        
        localStorage.setItem(
          "drwpp-design-storage",
          JSON.stringify({
            state: { history: historyForStorage },
            version: 1,
          }),
        )
      } catch (error) {
        console.error("Erreur lors de la sauvegarde dans localStorage:", error)
        // En cas d'erreur, essayer de sauvegarder sans l'image
        try {
          const minimalHistory = { 
            past: [], 
            present: { ...design, imageUrl: "[IMAGE_NON_STOCKEE]" },
            future: [] 
          };
          localStorage.setItem(
            "drwpp-design-storage",
            JSON.stringify({
              state: { history: minimalHistory },
              version: 1,
            }),
          )
          console.log("Sauvegarde minimale effectuée sans l'image");
        } catch (fallbackError) {
          console.error("Échec de la sauvegarde minimale:", fallbackError);
        }
      }
    }
  },
  resetDesign: () => {
    set({ 
      design: { ...initialState, id: generateUniqueId() },
      history: { past: [], present: { ...initialState, id: generateUniqueId() }, future: [] }
    })

    // Effacer de localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("drwpp-design-storage")
    }
  },
  
  undo: () => {
    const { history } = get();
    
    if (history.past.length === 0) return;
    
    const newHistory = {
      past: history.past.slice(0, -1),
      present: history.past[history.past.length - 1],
      future: [history.present, ...history.future],
    };
    
    set({ 
      design: newHistory.present,
      history: newHistory 
    });
  },
  
  redo: () => {
    const { history } = get();
    
    if (history.future.length === 0) return;
    
    const newHistory = {
      past: [...history.past, history.present],
      present: history.future[0],
      future: history.future.slice(1),
    };
    
    set({ 
      design: newHistory.present,
      history: newHistory 
    });
  },
  
  canUndo: () => {
    return get().history.past.length > 0;
  },
  
  canRedo: () => {
    return get().history.future.length > 0;
  },
  
  // Fonctions de gestion du texte supprimées
  
  setFilter: (filter) => {
    const { design } = get();
    const newDesign = {
      ...design,
      filter,
      hasChanges: true,
    };
    
    get().setDesign(newDesign);
  },
  
  toggleFlipX: () => {
    const { design } = get();
    const newDesign = {
      ...design,
      flipX: !design.flipX,
      hasChanges: true,
    };
    
    get().setDesign(newDesign);
  },
  
  toggleFlipY: () => {
    const { design } = get();
    const newDesign = {
      ...design,
      flipY: !design.flipY,
      hasChanges: true,
    };
    
    get().setDesign(newDesign);
  },
}), {
  name: "drwpp-design-storage",
  storage: createJSONStorage(() => localStorage),
  version: 1, // Définir la version actuelle du schéma
  partialize: (state) => {
    // Créer une copie pour le stockage (sans les images si trop grandes)
    const designForStorage = { ...state.design };
    
    // Si l'URL de l'image est une data URL (base64), on ne la stocke pas
    if (designForStorage.imageUrl && designForStorage.imageUrl.startsWith('data:')) {
      designForStorage.imageUrl = "[IMAGE_NON_STOCKEE]";
    }
    
    const historyForStorage = {
      past: state.history.past.map(state => {
        const stateCopy = { ...state };
        if (stateCopy.imageUrl && stateCopy.imageUrl.startsWith('data:')) {
          stateCopy.imageUrl = "[IMAGE_NON_STOCKEE]";
        }
        return stateCopy;
      }),
      present: designForStorage,
      future: state.history.future.map(state => {
        const stateCopy = { ...state };
        if (stateCopy.imageUrl && stateCopy.imageUrl.startsWith('data:')) {
          stateCopy.imageUrl = "[IMAGE_NON_STOCKEE]";
        }
        return stateCopy;
      }),
    };
    
    return {
      design: designForStorage,
      history: historyForStorage
    };
  },
  // Fonction explicite de migration pour résoudre l'erreur
  migrate: (persistedState: any, version: number) => {
    // Si l'état persisté est vide ou corrompu, retourner l'état par défaut
    if (!persistedState) {
      return {
        design: initialState,
        history: initialHistoryState
      };
    }
    
    // Migrer les propriétés renommées si nécessaire
    if (persistedState.design) {
      // Migration textElements → textLayers
      const designAny = persistedState.design as any;
      if (designAny.textElements && !designAny.textLayers) {
        designAny.textLayers = designAny.textElements;
        delete designAny.textElements;
      }
      
      // Migration isFlippedH → flipX
      if (designAny.isFlippedH !== undefined && designAny.flipX === undefined) {
        designAny.flipX = designAny.isFlippedH;
        delete designAny.isFlippedH;
      }
      
      // Migration isFlippedV → flipY
      if (designAny.isFlippedV !== undefined && designAny.flipY === undefined) {
        designAny.flipY = designAny.isFlippedV;
        delete designAny.isFlippedV;
      }
    }
    
    // Migrer l'historique si nécessaire
    if (persistedState.history) {
      if (persistedState.history.past) {
        persistedState.history.past = persistedState.history.past.map((state: any) => {
          // Appliquer les mêmes migrations aux états passés
          if (state.textElements && !state.textLayers) {
            state.textLayers = state.textElements;
            delete state.textElements;
          }
          if (state.isFlippedH !== undefined && state.flipX === undefined) {
            state.flipX = state.isFlippedH;
            delete state.isFlippedH;
          }
          if (state.isFlippedV !== undefined && state.flipY === undefined) {
            state.flipY = state.isFlippedV;
            delete state.isFlippedV;
          }
          return state;
        });
      }
      
      if (persistedState.history.future) {
        persistedState.history.future = persistedState.history.future.map((state: any) => {
          // Appliquer les mêmes migrations aux états futurs
          if (state.textElements && !state.textLayers) {
            state.textLayers = state.textElements;
            delete state.textElements;
          }
          if (state.isFlippedH !== undefined && state.flipX === undefined) {
            state.flipX = state.isFlippedH;
            delete state.isFlippedH;
          }
          if (state.isFlippedV !== undefined && state.flipY === undefined) {
            state.flipY = state.isFlippedV;
            delete state.isFlippedV;
          }
          return state;
        });
      }
    }
    
    console.log('State migré avec succès');
    return persistedState;
  },
  
  // Fonction pour gérer les événements après la réhydratation
  onRehydrateStorage: (state) => {
    return (rehydratedState, error) => {
      if (error) {
        console.error('Erreur lors de la réhydratation du state:', error);
      } else if (rehydratedState) {
        console.log('State réhydraté avec succès');
      }
    };
  },
}))
