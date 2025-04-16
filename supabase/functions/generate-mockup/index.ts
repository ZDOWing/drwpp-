import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// En-têtes CORS intégrés directement
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req) => {
  // Gestion des CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { base64Image, designId, mockupType = 'default', format = 'webp', quality = 0.9 } = await req.json();
    
    if (!base64Image || !designId) {
      throw new Error('L\'image en base64 et l\'ID du design sont requis');
    }
    
    // Création du client Supabase avec la clé de service
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Extraction de la partie données de l'image base64
    const base64Data = base64Image.split(',')[1] || base64Image;
    
    // Génération d'un nom unique pour le mockup
    const timestamp = new Date().getTime();
    const mockupFilename = `mockup_${designId}_${timestamp}.${format}`;
    
    // Conversion de base64 en Uint8Array pour le stockage
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Stockage de l'image dans le bucket Storage
    const { data: storageData, error: storageError } = await supabaseAdmin
      .storage
      .from('mockups')
      .upload(mockupFilename, binaryData, {
        contentType: `image/${format}`,
        upsert: true
      });
    
    if (storageError) throw storageError;
    
    // Génération de l'URL publique
    const { data: publicUrlData } = await supabaseAdmin
      .storage
      .from('mockups')
      .getPublicUrl(mockupFilename);
    
    const mockupUrl = publicUrlData.publicUrl;
    
    // Stockage des informations dans la base de données
    const { error: dbError } = await supabaseAdmin
      .from('canvas_edits')
      .insert({
        design_id: designId,
        fabric_json: null,
        preview_url: mockupUrl,
        created_at: new Date().toISOString()
      });
    
    if (dbError) throw dbError;
    
    // Renvoyer la réponse avec l'URL du mockup
    return new Response(
      JSON.stringify({ 
        success: true, 
        mockupUrl,
        storagePath: storageData.path,
        format,
        mockupType,
        message: "Mockup généré avec succès"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Erreur dans la fonction Edge:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        message: "Échec de la génération du mockup"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
