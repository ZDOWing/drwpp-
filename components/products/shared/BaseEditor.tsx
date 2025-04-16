"use client"

import { useState, useRef } from "react"
import { useDesignStore } from "@lib/store"
import { Button } from "@components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { 
  Upload, 
  Image as ImageIcon, 
  ArrowLeft,
  Undo,
  Redo
} from "lucide-react"
import Link from "next/link"

interface BaseEditorProps {
  children: React.ReactNode;
  onPreview: () => void;
  toolbarContent?: React.ReactNode;
  optionsContent?: React.ReactNode;
}

export default function BaseEditor({ 
  children, 
  onPreview,
  toolbarContent,
  optionsContent
}: BaseEditorProps) {
  const { design, undo, redo, canUndo, canRedo } = useDesignStore()
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fonction pour gérer l'upload d'image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      // Mise à jour du design avec la nouvelle image
      useDesignStore.setState(state => ({
        ...state,
        design: {
          ...state.design,
          imageUrl,
          hasChanges: true
        }
      }))
      setActiveTab("edit")
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Accueil
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Éditeur de Canvas</h1>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={undo} 
                  disabled={!canUndo()}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Annuler
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={redo} 
                  disabled={!canRedo()}
                >
                  <Redo className="h-4 w-4 mr-1" />
                  Rétablir
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4 h-[500px] flex flex-col relative">
              {!design.imageUrl ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl uppercase tracking-widest font-normal mb-4">Aucune image</h2>
                  <p className="text-center text-muted-foreground mb-8 max-w-md">
                    Téléchargez une image pour commencer à personnaliser votre canvas
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger une image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <>
                  {children}
                  {toolbarContent && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-md px-4 py-2">
                      {toolbarContent}
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-4 flex justify-center">
              {design.imageUrl && (
                <Button 
                  onClick={onPreview}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Prévisualiser
                </Button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="upload">
                  Upload
                </TabsTrigger>
                <TabsTrigger value="edit" disabled={!design.imageUrl}>
                  Éditer
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Image</h3>
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      {design.imageUrl ? "Changer d'image" : "Télécharger une image"}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="edit" className="mt-4">
                {optionsContent}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
