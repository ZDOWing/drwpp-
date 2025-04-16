"use client"

import { useState } from "react"
import { useDesignStore } from "@lib/store"
import BaseEditor from "../shared/BaseEditor"
import CanvasFabricCanvas from "./CanvasFabricCanvas"
import { Button } from "@components/ui/button"
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  FlipHorizontal,
  FlipVertical
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Slider } from "@components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group"
import { Label } from "@components/ui/label"

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

export default function CanvasEditor() {
  const { design, setDesign } = useDesignStore()
  const [previewMode, setPreviewMode] = useState(false)
  const [formatType, setFormatType] = useState<string>("portrait")
  const [formatSize, setFormatSize] = useState<string>("30x40")
  
  // Handle format type change
  const handleFormatTypeChange = (value: string) => {
    setFormatType(value)
    // Set default format size for the selected type
    const defaultFormat = Object.keys(canvasFormats[value as keyof typeof canvasFormats].formats)[1] // Medium size
    setFormatSize(defaultFormat)
    
    setDesign({
      ...design,
      format: defaultFormat,
      formatType: value,
      hasChanges: true
    })
  }
  
  // Handle format size change
  const handleFormatSizeChange = (value: string) => {
    setFormatSize(value)
    
    setDesign({
      ...design,
      format: value,
      hasChanges: true
    })
  }
  
  // Toolbar content for image manipulation
  const toolbarContent = (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          setDesign({
            ...design,
            rotation: (design.rotation || 0) - 90,
            hasChanges: true
          })
        }}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          setDesign({
            ...design,
            rotation: (design.rotation || 0) + 90,
            hasChanges: true
          })
        }}
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          setDesign({
            ...design,
            flipX: !design.flipX,
            hasChanges: true
          })
        }}
      >
        <FlipHorizontal className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          setDesign({
            ...design,
            flipY: !design.flipY,
            hasChanges: true
          })
        }}
      >
        <FlipVertical className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          const newScale = Math.max(0.5, (design.scale || 1) - 0.1)
          setDesign({
            ...design,
            scale: newScale,
            hasChanges: true
          })
        }}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <div className="text-xs font-medium">
        {Math.round((design.scale || 1) * 100)}%
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => {
          const newScale = Math.min(2, (design.scale || 1) + 0.1)
          setDesign({
            ...design,
            scale: newScale,
            hasChanges: true
          })
        }}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  )
  
  // Options content for canvas format selection
  const optionsContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Type de format</h3>
        <RadioGroup 
          value={formatType} 
          onValueChange={handleFormatTypeChange}
          className="flex space-x-2"
        >
          {Object.entries(canvasFormats).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <RadioGroupItem value={key} id={`format-${key}`} />
              <Label htmlFor={`format-${key}`}>{value.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Taille</h3>
        <Select value={formatSize} onValueChange={handleFormatSizeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une taille" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(canvasFormats[formatType as keyof typeof canvasFormats].formats).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.name} - {value.width}×{value.height} cm
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
  
  // If in preview mode, show preview component
  if (previewMode) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="container px-4 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPreviewMode(false)}
              className="mr-4"
            >
              Retour à l'éditeur
            </Button>
            <h1 className="text-xl font-bold">Prévisualisation du Canvas</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="aspect-ratio-container relative" style={{ paddingBottom: "75%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {design.imageUrl && (
                  <img 
                    src={design.imageUrl} 
                    alt="Canvas Mockup"
                    className="max-w-full max-h-full object-contain"
                    style={{ 
                      transform: `rotate(${design.rotation || 0}deg) 
                                scaleX(${design.flipX ? -1 : 1}) 
                                scaleY(${design.flipY ? -1 : 1})` 
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <div>
                <h2 className="text-lg font-medium">Canvas Personnalisé</h2>
                <p className="text-sm text-gray-500">
                  {canvasFormats[formatType as keyof typeof canvasFormats].name} - 
                  {canvasFormats[formatType as keyof typeof canvasFormats].formats[formatSize as keyof typeof canvasFormats[keyof typeof canvasFormats]['formats']].width}×
                  {canvasFormats[formatType as keyof typeof canvasFormats].formats[formatSize as keyof typeof canvasFormats[keyof typeof canvasFormats]['formats']].height} cm
                </p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => alert('Fonctionnalité à venir dans une prochaine version')}
              >
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Handle scale change from canvas
  const handleScaleChange = (newScale: number) => {
    setDesign({
      ...design,
      scale: newScale,
      hasChanges: true
    })
  }

  return (
    <BaseEditor
      onPreview={() => setPreviewMode(true)}
      toolbarContent={toolbarContent}
      optionsContent={optionsContent}
    >
      <CanvasFabricCanvas 
        formatType={formatType}
        formatSize={formatSize}
        onScaleChange={handleScaleChange}
      />
    </BaseEditor>
  )
}
