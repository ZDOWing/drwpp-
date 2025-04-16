const fs = require('fs');

const filePath = '/Users/zdowthevibe/Desktop/drwpp-platform/components/editor-canvas.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// Créer une sauvegarde
fs.writeFileSync(`${filePath}.bak`, content);

// Trouver où se trouve l'accolade manquante
const lines = content.split('\n');
let openBraces = 0;
let missingPosition = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') openBraces++;
    if (line[j] === '}') openBraces--;
  }
  
  // Si à un moment donné nous avons plus d'accolades ouvrantes que fermantes
  // et ensuite nous arrivons à 0, c'est probablement là que se trouvait le problème
  if (openBraces === 0) {
    missingPosition = i;
  }
}

console.log(`Déséquilibre final d'accolades : ${openBraces}`);
console.log(`Position probable de l'accolade manquante : après la ligne ${missingPosition}`);

// Ajouter l'accolade manquante à la fin
if (openBraces === 1) {
  console.log("Ajout d'une accolade fermante à la fin du fichier");
  fs.writeFileSync(filePath, content + "\n}");
}
