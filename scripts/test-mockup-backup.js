/**
 * Script de test pour le système de backup des mockups
 * 
 * Ce script teste la génération de mockups via le système de backup
 * en utilisant l'API Dynamic Mockups.
 */

const { generateDynamicMockup, isDynamicMockupApiAvailable } = require('../lib/services/dynamic-mockup-api');

// Configuration de test
const TEST_CONFIG = {
  // UUID d'un mockup de test (à remplacer par un UUID valide de l'API Dynamic Mockups)
  mockupUuid: 'poster-a3-white',
  
  // URL d'une image de design (remplacer par une URL publique valide)
  designUrl: 'https://picsum.photos/800/1200',
  
  // Zone d'impression
  printArea: {
    x: 50,
    y: 50,
    width: 400,
    height: 600,
    rotation: 0
  },
  
  // Format de sortie
  format: 'webp',
  
  // Qualité de l'image
  quality: 0.9
};

// Fonction principale de test
async function runTest() {
  console.log('🧪 Test du système de backup des mockups');
  console.log('---------------------------------------');
  
  // 1. Vérifier la disponibilité de l'API
  console.log('1. Vérification de la disponibilité de l\'API Dynamic Mockups...');
  const isApiAvailable = await isDynamicMockupApiAvailable();
  
  if (!isApiAvailable) {
    console.error('❌ L\'API Dynamic Mockups n\'est pas disponible. Vérifiez votre connexion internet ou les informations d\'API.');
    return;
  }
  
  console.log('✅ L\'API Dynamic Mockups est disponible.');
  
  // 2. Générer un mockup via l'API
  console.log('\n2. Génération d\'un mockup via l\'API Dynamic Mockups...');
  try {
    const result = await generateDynamicMockup({
      uuid: TEST_CONFIG.mockupUuid,
      designUrl: TEST_CONFIG.designUrl,
      printArea: TEST_CONFIG.printArea,
      format: TEST_CONFIG.format,
      quality: TEST_CONFIG.quality
    });
    
    if (result.success) {
      console.log('✅ Mockup généré avec succès!');
      console.log(`📸 URL du mockup: ${result.mockupUrl}`);
    } else {
      console.error(`❌ Échec de la génération du mockup: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la génération du mockup:', error);
  }
}

// Exécuter le test
runTest()
  .then(() => console.log('\n🏁 Test terminé.'))
  .catch(error => console.error('\n❌ Erreur lors de l\'exécution du test:', error));
