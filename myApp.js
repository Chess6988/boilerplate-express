// myApp.js
const express = require('express');
const dns = require('dns');
const urlParser = require('url');
const app = express();

// Middleware pour parser les données POST
app.use(express.urlencoded({ extended: false }));

// Tableau pour stocker les URLs
const urls = [];

// Route POST pour raccourcir l'URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Vérifier le format de l'URL
  if (!/^https?:\/\//i.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Extraire le nom de domaine
  const hostname = urlParser.parse(originalUrl).hostname;

  // Vérifier si le domaine existe
  dns.lookup(hostname, (err) => {
    if (err) return res.json({ error: 'invalid url' });

    // Ajouter l'URL au tableau et générer un identifiant unique
    const shortUrl = urls.length + 1;
    urls.push(originalUrl);

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

// Route GET pour rediriger vers l'URL originale
app.get('/api/shorturl/:short_url', (req, res) => {
  const index = parseInt(req.params.short_url) - 1;
  const originalUrl = urls[index];

  if (!originalUrl) {
    return res.json({ error: 'No URL found for this short_url' });
  }

  res.redirect(originalUrl);
});

module.exports = app;
