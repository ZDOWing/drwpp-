import { supabase } from './supabaseClient';

/**
 * Récupère l'URL publique d'un fichier stocké dans Supabase
 * @param bucket Le nom du bucket de stockage
 * @param path Le chemin du fichier dans le bucket
 * @returns L'URL publique du fichier
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Exemple d'utilisation pour récupérer l'URL d'un design
 * @param userId L'identifiant de l'utilisateur
 * @param fileName Le nom du fichier
 * @returns L'URL publique du design
 */
export function getDesignPublicUrl(userId: string, fileName: string): string {
  return getPublicUrl('designs', `${userId}/${fileName}`);
}

/**
 * Exemple spécifique pour récupérer l'URL de "mon-image.png" pour un utilisateur donné
 * @param userId L'identifiant de l'utilisateur
 * @returns L'URL publique de l'image
 */
export function getMonImageUrl(userId: string): string {
  return getPublicUrl('designs', `${userId}/mon-image.png`);
}
