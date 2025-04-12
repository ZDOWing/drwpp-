// Configuration des formats disponibles
export const formatConfigs: Record<
  string,
  {
    name: string
    width: number
    height: number
    type: "square" | "portrait" | "landscape"
    // Marges de sécurité pour la zone d'impression (en mm)
    safetyMargin?: number
    // Zone de contenu recommandée (en mm)
    contentMargin?: number
    // Zone de découpe (bleed) pour l'impression (en mm)
    bleedMargin?: number
  }
> = {
  // Carrés (Square)
  "30x30": {
    name: "Carré 30×30",
    width: 30,
    height: 30,
    type: "square",
    safetyMargin: 3,
    contentMargin: 5,
    bleedMargin: 2,
  },
  "40x40": {
    name: "Carré 40×40",
    width: 40,
    height: 40,
    type: "square",
    safetyMargin: 4,
    contentMargin: 7,
    bleedMargin: 3,
  },
  "50x50": {
    name: "Carré 50×50",
    width: 50,
    height: 50,
    type: "square",
    safetyMargin: 5,
    contentMargin: 8,
    bleedMargin: 3,
  },

  // Portrait (Vertical)
  "30x40": {
    name: "Portrait 30×40",
    width: 30,
    height: 40,
    type: "portrait",
    safetyMargin: 3,
    contentMargin: 5,
    bleedMargin: 2,
  },
  "50x70": {
    name: "Portrait 50×70",
    width: 50,
    height: 70,
    type: "portrait",
    safetyMargin: 5,
    contentMargin: 10,
    bleedMargin: 3,
  },
  "60x90": {
    name: "Portrait 60×90",
    width: 60,
    height: 90,
    type: "portrait",
    safetyMargin: 6,
    contentMargin: 12,
    bleedMargin: 4,
  },

  // Paysage (Horizontal)
  "40x30": {
    name: "Paysage 40×30",
    width: 40,
    height: 30,
    type: "landscape",
    safetyMargin: 3,
    contentMargin: 5,
    bleedMargin: 2,
  },
  "70x50": {
    name: "Paysage 70×50",
    width: 70,
    height: 50,
    type: "landscape",
    safetyMargin: 5,
    contentMargin: 10,
    bleedMargin: 3,
  },
  "90x60": {
    name: "Paysage 90×60",
    width: 90,
    height: 60,
    type: "landscape",
    safetyMargin: 6,
    contentMargin: 12,
    bleedMargin: 4,
  },
}

// Grouper les formats par type
export const formatGroups = {
  square: Object.entries(formatConfigs)
    .filter(([_, config]) => config.type === "square")
    .map(([id, config]) => ({ id, ...config })),

  portrait: Object.entries(formatConfigs)
    .filter(([_, config]) => config.type === "portrait")
    .map(([id, config]) => ({ id, ...config })),

  landscape: Object.entries(formatConfigs)
    .filter(([_, config]) => config.type === "landscape")
    .map(([id, config]) => ({ id, ...config })),
}

