// server.js - backend entrypoint
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const NODE_ENV = process.env.NODE_ENV || 'dev';
const PORT = process.env.PORT || 4000;

const configPath = path.join(__dirname, 'config', NODE_ENV + '.json');
let config = {};
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.warn('Could not read config', configPath, e.message);
}

// serve static frontend build from /public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: NODE_ENV, time: new Date().toISOString() });
});

// sample API - returns the tree JSON
app.get('/api/tree', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'osint.json'), 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'error reading data' });
  }
});

// fallback - serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`OSINT backend listening on http://0.0.0.0:${PORT} (env=${NODE_ENV})`);
});
