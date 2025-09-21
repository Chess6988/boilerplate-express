// myApp.js
const express = require('express');
const multer = require('multer');
const app = express();

// middleware pour servir fichiers statiques (optionnel : public/index.html)
app.use(express.static('public'));

// multer en mémoire (on ne sauvegarde pas sur disque)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route POST qui reçoit le champ upfile
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = req.file;

  // Retourner le nom, le type (mimetype) et la taille en octets
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size
  });
});

module.exports = app;
