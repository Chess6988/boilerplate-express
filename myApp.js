// myApp.js
const express = require('express');
const app = express();

app.get('/api/whoami', (req, res) => {
  // IP : utiliser x-forwarded-for si derrière un proxy, sinon req.ip / socket
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '').split(',')[0].trim();

  // Language : accept-language (prendre la première valeur)
  const language = (req.headers['accept-language'] || '').split(',')[0];

  // Software : user-agent complet
  const software = req.headers['user-agent'] || '';

  res.json({
    ipaddress: ip,
    language: language,
    software: software
  });
});

module.exports = app;
