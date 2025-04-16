const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node check_braces.js <file_path>');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

let openBraces = 0;
let closeBraces = 0;
let openParens = 0;
let closeParens = 0;

for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') openBraces++;
  if (content[i] === '}') closeBraces++;
  if (content[i] === '(') openParens++;
  if (content[i] === ')') closeParens++;
}

console.log(`Open braces: ${openBraces}`);
console.log(`Close braces: ${closeBraces}`);
console.log(`Open parentheses: ${openParens}`);
console.log(`Close parentheses: ${closeParens}`);

if (openBraces !== closeBraces) {
  console.log('MISMATCH: Braces are not balanced!');
} else {
  console.log('Braces are balanced.');
}

if (openParens !== closeParens) {
  console.log('MISMATCH: Parentheses are not balanced!');
} else {
  console.log('Parentheses are balanced.');
}
