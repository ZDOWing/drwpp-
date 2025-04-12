"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, Image, Object as FabricObject, Rect } from "fabric"
import { useDesignStore } from "@/lib/store"

export interface PrintArea {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  clipPath?: FabricObject;
}

export interface BaseFabricCanvasProps {
  printAreas: PrintArea[];
  productType: 'canvas' | 'tshirt' | 'mug';
  backgroundImage?: string;
  onScaleChange?: (scale: number) => void;
}

export default function BaseFabricCanvas({ 
  printAreas, 
  productType, 
  backgroundImage,
  onScaleChange 
}: BaseFabricCanvasProps) {
  const { design, setDesign } = useDesignStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)
  const [activePrintArea, setActivePrintArea] = useState<string>(() => printAreas[0]?.name || "")
  
  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    // Create Fabric.js canvas
    const canvas = new Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      selection: false,
      backgroundColor: "#f5f5f5"
    })
    
    fabricCanvasRef.current = canvas
    
    // Set canvas dimensions
    canvas.setWidth(800)
    canvas.setHeight(600)
    
    // Add background image if provided
    if (backgroundImage) {
      Image.fromURL(backgroundImage, (img: Image) => {
        img.set({
          selectable: false,
          evented: false,
          scaleX: canvas.width! / (img.width ?? 1),
          scaleY: canvas.height! / (img.height ?? 1)
        })
        canvas.add(img)
        canvas.getObjects().forEach(obj => {
          if (obj !== img) {
            obj.bringToFront()
          }
        })
      }, { crossOrigin: 'anonymous' })
    }
    
    // Add print areas
    printAreas.forEach(area => {
      // Create print area rectangle
      const rect = new Rect({
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        fill: 'rgba(0, 0, 255, 0.1)',
        stroke: 'rgba(0, 0, 255, 0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        name: area.name
      })
      
      canvas.add(rect)
      
      // If there's a clip path, apply it
      if (area.clipPath) {
        rect.clipPath = area.clipPath
      }
    })
    
    // Load design image if available
    if (design.imageUrl) {
      Image.fromURL(design.imageUrl, (img: Image) => {
        // Calculate scale to fit within the active print area
        const currentPrintArea = printAreas.find(area => area.name === activePrintArea)
        if (!currentPrintArea) return
        
        const scaleX = currentPrintArea.width / (img.width ?? 1)
        const scaleY = currentPrintArea.height / (img.height ?? 1)
        const scale = Math.min(scaleX, scaleY)
        
        img.set({
          left: currentPrintArea.x + currentPrintArea.width / 2,
          top: currentPrintArea.y + currentPrintArea.height / 2,
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          centeredScaling: true,
          centeredRotation: true
        })
        
        canvas.add(img)
        canvas.setActiveObject(img)
        
        // Update design with initial position and scale
        setDesign({
          ...design,
          position: { x: img.left!, y: img.top! },
          scale: scale,
          rotation: 0
        })
        
        if (onScaleChange) {
          onScaleChange(scale)
        }
      })
    }
    
    // Event listeners
    canvas.on('object:modified', (e) => {
      const obj = e.target
      if (!obj) return
      
      setDesign({
        ...design,
        position: { x: obj.left!, y: obj.top! },
        scale: obj.scaleX!,
        rotation: obj.angle!,
        hasChanges: true
      })
      
      if (onScaleChange && obj.scaleX) {
        onScaleChange(obj.scaleX)
      }
    })
    
    // Cleanup
    return () => {
      canvas.dispose()
    }
  }, [design.imageUrl, activePrintArea])
  
  // Handle print area change
  const handlePrintAreaChange = (areaName: string) => {
    setActivePrintArea(areaName)
    
    // Move the design image to the new print area
    if (fabricCanvasRef.current && design.imageUrl) {
      const canvas = fabricCanvasRef.current
      const obj = canvas.getActiveObject()
      if (!obj) return
      
      const newPrintArea = printAreas.find(area => area.name === areaName)
      if (!newPrintArea) return
      
      obj.set({
        left: newPrintArea.x + newPrintArea.width / 2,
        top: newPrintArea.y + newPrintArea.height / 2
      })
      
      canvas.renderAll()
      
      setDesign({
        ...design,
        position: { x: obj.left!, y: obj.top! },
        hasChanges: true
      })
    }
  }
  
  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} />
      
      {/* Print area selector if multiple print areas */}
      {printAreas.length > 1 && (
        <div className="absolute top-4 right-4 bg-white rounded shadow-md p-2">
          <div className="text-sm font-medium mb-1">Zone d'impression</div>
          <div className="flex flex-col space-y-1">
            {printAreas.map(area => (
              <button
                key={area.name}
                className={`px-3 py-1 text-sm rounded ${
                  activePrintArea === area.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => handlePrintAreaChange(area.name)}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
