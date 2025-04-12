"use client"

import { useEffect, useState } from "react"
import BaseFabricCanvas, { PrintArea } from "../shared/BaseFabricCanvas"
import { useDesignStore } from "@/lib/store"

// Canvas format configurations
const canvasFormats = {
  "square": {
    name: "Carré",
    formats: {
      "20x20": { name: "Petit", width: 20, height: 20 },
      "30x30": { name: "Moyen", width: 30, height: 30 },
      "40x40": { name: "Grand", width: 40, height: 40 }
    }
  },
  "portrait": {
    name: "Portrait",
    formats: {
      "20x30": { name: "Petit", width: 20, height: 30 },
      "30x40": { name: "Moyen", width: 30, height: 40 },
      "40x60": { name: "Grand", width: 40, height: 60 }
    }
  },
  "landscape": {
    name: "Paysage",
    formats: {
      "30x20": { name: "Petit", width: 30, height: 20 },
      "40x30": { name: "Moyen", width: 40, height: 30 },
      "60x40": { name: "Grand", width: 60, height: 40 }
    }
  }
}

interface CanvasFabricCanvasProps {
  formatType: string;
  formatSize: string;
  onScaleChange?: (scale: number) => void;
}

export default function CanvasFabricCanvas({ 
  formatType, 
  formatSize,
  onScaleChange 
}: CanvasFabricCanvasProps) {
  const { design } = useDesignStore()
  const [printAreas, setPrintAreas] = useState<PrintArea[]>([])
  
  // Update print area when format changes
  useEffect(() => {
    if (!formatType || !formatSize) return
    
    // Get format dimensions
    const formatConfig = canvasFormats[formatType as keyof typeof canvasFormats]?.formats[formatSize as keyof typeof canvasFormats[keyof typeof canvasFormats]['formats']]
    if (!formatConfig) return
    
    // Calculate print area dimensions (in pixels)
    // Using 150 DPI: 1 cm = 150 / 2.54 = ~59.05 pixels
    const DPI = 150
    const pixelsPerCm = DPI / 2.54
    
    const width = formatConfig.width * pixelsPerCm
    const height = formatConfig.height * pixelsPerCm
    
    // Canvas is 800x600, center the print area
    const x = (800 - width) / 2
    const y = (600 - height) / 2
    
    // Create print area
    const newPrintAreas: PrintArea[] = [
      {
        name: "Zone d'impression",
        x,
        y,
        width,
        height
      }
    ]
    
    setPrintAreas(newPrintAreas)
  }, [formatType, formatSize])
  
  return (
    <BaseFabricCanvas
      printAreas={printAreas}
      productType="canvas"
      onScaleChange={onScaleChange}
    />
  )
}
