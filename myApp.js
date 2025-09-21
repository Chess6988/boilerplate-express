const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Stockage en mémoire
let users = [];

// Créer un utilisateur
app.post('/api/users', (req, res) => {
  const username = req.body.username;
  const newUser = { username, _id: uuidv4(), log: [] };
  users.push(newUser);
  res.json({ username: newUser.username, _id: newUser._id });
});

// Lister tous les utilisateurs
app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ username: u.username, _id: u._id })));
});

// Ajouter un exercice
app.post('/api/users/:_id/exercises', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.json({ error: 'User not found' });

  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  const date = req.body.date ? new Date(req.body.date) : new Date();

  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid date' });
  }

  const exercise = {
    description,
    duration,
    date: date.toDateString()
  };

  user.log.push(exercise);

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id
  });
});

// Obtenir le log d’un utilisateur
app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.json({ error: 'User not found' });

  let { from, to, limit } = req.query;
  let log = [...user.log];

  if (from) {
    const fromDate = new Date(from);
    log = log.filter(e => new Date(e.date) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    log = log.filter(e => new Date(e.date) <= toDate);
  }
  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log
  });
});

module.exports = app;
