const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Préparer l'application Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Analyser l'URL
      const parsedUrl = parse(req.url, true);
      
      // Laisser Next.js gérer la requête
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Erreur lors du traitement de la requête:', err);
      res.statusCode = 500;
      res.end('Erreur interne du serveur');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Serveur prêt sur http://${hostname}:${port}`);
  });
});
