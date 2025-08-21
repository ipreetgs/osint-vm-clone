// src/routes/framework.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '..', '..', 'data', 'osint.json');

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

router.get('/tree', (_req, res) => {
  try {
    const j = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    res.json(j);
  } catch (e) {
    res.status(500).json({ message: 'failed to read data' });
  }
});

export default router;
