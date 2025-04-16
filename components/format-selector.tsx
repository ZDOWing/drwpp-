"use client"

import { useDesignStore } from "@/lib/store"
import { formatGroups, formatConfigs } from "@/lib/format-configs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FormatSelector() {
  const { design, setDesign } = useDesignStore()
  
  // Trouver le format actuel pour l'affichage
  const currentFormat = formatConfigs[design.format || "30x40"] || { name: "Format standard", width: 30, height: 40 }
  
  // Fonction pour changer le format
  const handleFormatChange = (value: string) => {
    setDesign({ ...design, format: value, hasChanges: true })
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-wider font-medium">FORMAT</span>
          <Select value={design.format || "30x40"} onValueChange={handleFormatChange}>
            <SelectTrigger className="h-8 text-xs border-0 bg-transparent px-0 w-auto">
              <SelectValue>
                <span>{currentFormat.width}×{currentFormat.height}cm</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <Tabs defaultValue="square" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="square" className="text-xs">Carré</TabsTrigger>
                  <TabsTrigger value="portrait" className="text-xs">Portrait</TabsTrigger>
                  <TabsTrigger value="landscape" className="text-xs">Paysage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="square" className="mt-1">
                  <div className="grid grid-cols-2 gap-1">
                    {formatGroups.square.map((format) => (
                      <button
                        key={format.id}
                        className={`text-xs py-1 px-2 ${design.format === format.id ? 'border-b border-black' : 'hover:opacity-70'}`}
                        onClick={() => handleFormatChange(format.id)}
                      >
                        {format.width}×{format.height}
                      </button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="portrait" className="mt-1">
                  <div className="grid grid-cols-2 gap-1">
                    {formatGroups.portrait.map((format) => (
                      <button
                        key={format.id}
                        className={`text-xs py-1 px-2 ${design.format === format.id ? 'border-b border-black' : 'hover:opacity-70'}`}
                        onClick={() => handleFormatChange(format.id)}
                      >
                        {format.width}×{format.height}
                      </button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="landscape" className="mt-1">
                  <div className="grid grid-cols-2 gap-1">
                    {formatGroups.landscape.map((format) => (
                      <button
                        key={format.id}
                        className={`text-xs py-1 px-2 ${design.format === format.id ? 'border-b border-black' : 'hover:opacity-70'}`}
                        onClick={() => handleFormatChange(format.id)}
                      >
                        {format.width}×{format.height}
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

