const express = require('express');
const app = express();

// Route pour /api vide → date actuelle
app.get('/api', (req, res) => {
  const date = new Date();
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

// Route pour /api/:date → timestamp ou string
app.get('/api/:date', (req, res) => {
  const dateString = req.params.date;
  let date;

  // Si c’est un timestamp UNIX (seulement des chiffres)
  if (/^\d+$/.test(dateString)) {
    date = new Date(parseInt(dateString));
  } else {
    // Date normale
    date = new Date(dateString);
  }

  // Vérification date invalide
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Réponse JSON
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

module.exports = app;
