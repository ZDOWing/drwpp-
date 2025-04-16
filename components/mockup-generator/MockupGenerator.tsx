import React, { useState } from 'react';
import { useDesignStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Share2 } from 'lucide-react';
import Image from 'next/image';

interface MockupGeneratorProps {
  canvas: fabric.Canvas | null;
  onMockupGenerated?: (url: string) => void;
}

const MOCKUP_TYPES = [
  { id: 'default', name: 'Standard' },
  { id: 'frame-white', name: 'Cadre blanc' },
  { id: 'frame-black', name: 'Cadre noir' },
  { id: 'wall', name: 'Mur intérieur' },
];

export default function MockupGenerator({ canvas, onMockupGenerated }: MockupGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [mockupType, setMockupType] = useState('default');
  const [error, setError] = useState<string | null>(null);
  
  const design = useDesignStore(state => state.design);

  const generateMockup = async () => {
    if (!canvas) {
      setError('Canvas non disponible');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Convertir le canvas en base64
      const dataURL = canvas.toDataURL({
        format: 'webp',
        quality: 0.9,
      });

      // Appeler la fonction Edge Supabase
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-mockup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          base64Image: dataURL,
          mockupType,
          designId: design.id,
          format: 'webp',
          quality: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération du mockup');
      }

      const result = await response.json();
      
      if (result.success && result.mockupUrl) {
        setMockupUrl(result.mockupUrl);
        if (onMockupGenerated) {
          onMockupGenerated(result.mockupUrl);
        }
      } else {
        throw new Error('URL du mockup non disponible dans la réponse');
      }
    } catch (err) {
      console.error('Erreur lors de la génération du mockup:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMockup = () => {
    if (!mockupUrl) return;
    
    const link = document.createElement('a');
    link.href = mockupUrl;
    link.download = `mockup-${mockupType}-${design.id}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareMockup = async () => {
    if (!mockupUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mon mockup DRWPP',
          text: 'Voici mon design généré avec DRWPP',
          url: mockupUrl,
        });
      } else {
        await navigator.clipboard.writeText(mockupUrl);
        alert('Lien copié dans le presse-papier !');
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Générer un mockup</CardTitle>
        <CardDescription>
          Créez une visualisation de votre design
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type de mockup</label>
          <Select value={mockupType} onValueChange={setMockupType}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              {MOCKUP_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {mockupUrl && (
          <div className="relative aspect-square w-full overflow-hidden rounded-md border">
            <Image
              src={mockupUrl}
              alt="Mockup généré"
              fill
              className="object-cover"
            />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button 
          onClick={generateMockup} 
          disabled={isGenerating || !canvas}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : 'Générer le mockup'}
        </Button>
        
        {mockupUrl && (
          <>
            <Button 
              variant="outline" 
              onClick={downloadMockup}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            <Button 
              variant="outline" 
              onClick={shareMockup}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
