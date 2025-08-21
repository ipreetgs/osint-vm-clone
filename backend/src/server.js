// src/server.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import routes from './routes/framework.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

app.use('/api', routes);

// Serve frontend static from the build placed in ../public
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`OSINT backend running on port ${PORT} (${NODE_ENV})`);
});
