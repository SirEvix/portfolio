/*
 Simple Express server exposing the relics API.

 Endpoints:
 - GET  /api/relic/verify?token=...         -> verify token, return relic info or error
 - POST /api/relic/claim                     -> { token, name } claim a relic
 - POST /api/admin/relic/send                -> { id } mark relic as sent
 - POST /api/admin/relic/verify-internal     -> { id, internal_code } compare internal code hash

 How to run:
 - cd Server
 - npm install
 - npm run init-db   (creates ./data/relics.db with 500 dormant relics)
 - npm start

 Notes/Instructions are included as comments where relevant.
*/

const express = require('express');
const bodyParser = require('express').json;
const { loadRelics, saveRelics, JSON_PATH } = require('./db');
const { hashToken, hashInternalCode } = require('./utils/hash');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser());

// Admin key (set this in your environment): process.env.ADMIN_KEY
const ADMIN_KEY = process.env.ADMIN_KEY || '';

function adminAuth(req, res, next) {
  if (!ADMIN_KEY) return res.status(500).json({ error: 'admin_key_not_configured' });
  // Accept header 'x-admin-key', 'x-api-key', or 'Authorization: Bearer <key>'
  const key = req.headers['x-admin-key'] || req.headers['x-api-key'] || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!key || key !== ADMIN_KEY) return res.status(401).json({ error: 'invalid_admin_key' });
  return next();
}

// In-memory cache of relics (loaded on demand)
let RELICS = loadRelics();
function reloadRelics() { RELICS = loadRelics(); }

// Log how many relics were loaded at startup to aid deployments/health checks
try {
  console.log(`Loaded ${Array.isArray(RELICS) ? RELICS.length : 0} relics from ${JSON_PATH}`);
} catch (e) { console.warn('Unable to log relic count', e) }

// Simple root/status route useful for healthchecks and for verifying deployed data
app.get('/', (req, res) => {
  return res.json({ message: 'Relic backend is live', time: new Date().toISOString(), relic_count: Array.isArray(RELICS) ? RELICS.length : 0 });
});

function findRelicByTokenHash(tokenHash) {
  return RELICS.find(r => r.token_hash === tokenHash) || null;
}

function findRelicById(id) {
  return RELICS.find(r => r.id === id) || null;
}

function persist() {
  saveRelics(RELICS);
}

// GET /api/relic/verify?token=...
app.get('/api/relic/verify', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).json({ error: 'missing_token' });
  const th = hashToken(token);
  const relic = findRelicByTokenHash(th);
  if (!relic) return res.status(404).json({ error: 'invalid_token' });
  return res.json({ relic_id: relic.id, status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date });
});

// POST /api/relic/claim  Body: { token, name }
app.post('/api/relic/claim', (req, res) => {
  const { token, name } = req.body || {};
  if (!token || !name) return res.status(400).json({ error: 'missing_fields' });
  // validate name: 1-15 chars, alphanumeric only
  if (!/^[A-Za-z0-9]{1,15}$/.test(name)) return res.status(400).json({ error: 'invalid_name' });
  const th = hashToken(token);
  const relic = findRelicByTokenHash(th);
  if (!relic) return res.status(404).json({ error: 'invalid_token' });
  if (relic.status === 'claimed') return res.status(409).json({ error: 'already_claimed' });
  // update to claimed
  const now = new Date().toISOString();
  relic.status = 'claimed';
  relic.owner_name = name;
  relic.owner_date = now;
  persist();
  const updated = { id: relic.id, status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date };
  return res.json({ success: true, relic: updated });
});

// POST /api/admin/relic/send  Body: { id }
app.post('/api/admin/relic/send', adminAuth, (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'missing_id' });
  const relic = findRelicById(id);
  if (!relic) return res.status(404).json({ error: 'not_found' });
  relic.status = 'sent';
  persist();
  return res.json({ success: true, id });
});

// POST /api/admin/relic/verify-internal  Body: { id, internal_code }
app.post('/api/admin/relic/verify-internal', adminAuth, (req, res) => {
  const { id, internal_code } = req.body || {};
  if (!id || !internal_code) return res.status(400).json({ error: 'missing_fields' });
  const relic = findRelicById(id);
  if (!relic) return res.status(404).json({ error: 'not_found' });
  const providedHash = hashInternalCode(internal_code);
  const matches = relic.internal_code_hash === providedHash;
  return res.json({ match: matches });
});

// POST /api/admin/relic/update  Body: { id, status?, owner_name?, owner_date? }
// Allows admins to update metadata for a relic (status, owner_name, owner_date)
app.post('/api/admin/relic/update', adminAuth, (req, res) => {
  const { id, status, owner_name, owner_date } = req.body || {};
  if (!id) return res.status(400).json({ error: 'missing_id' });
  const relic = findRelicById(id);
  if (!relic) return res.status(404).json({ error: 'not_found' });
  if (typeof status === 'string') relic.status = status;
  if (typeof owner_name === 'string') relic.owner_name = owner_name;
  if (typeof owner_date === 'string') relic.owner_date = owner_date;
  // persist changes
  persist();
  return res.json({ success: true, relic: { id: relic.id, status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date } });
});

// Simple admin endpoint to list small sample (not paginated)
app.get('/api/admin/relics/sample', adminAuth, (req, res) => {
  const rows = RELICS.slice(0, 50).map(r => ({ id: r.id, status: r.status, owner_name: r.owner_name, owner_date: r.owner_date }));
  res.json(rows);
});

// Public endpoint: list all relics (public metadata only)
// Returns array of { id, status, owner_name, owner_date }
app.get('/api/relics', (req, res) => {
  const rows = RELICS.map(r => ({ id: r.id, status: r.status, owner_name: r.owner_name, owner_date: r.owner_date }));
  res.json(rows);
});

// POST /api/relic/rename  Body: { token, name }
// Allows the holder of a token to change the owner_name for their relic.
app.post('/api/relic/rename', (req, res) => {
  const { token, name } = req.body || {};
  if (!token || !name) return res.status(400).json({ error: 'missing_fields' });
  // validate name: 1-15 chars, alphanumeric only
  if (!/^[A-Za-z0-9]{1,15}$/.test(name)) return res.status(400).json({ error: 'invalid_name' });
  const th = hashToken(token);
  const relic = findRelicByTokenHash(th);
  if (!relic) return res.status(404).json({ error: 'invalid_token' });
  // Permit rename regardless of claimed status as long as token matches
  relic.owner_name = name;
  relic.owner_date = new Date().toISOString();
  persist();
  return res.json({ success: true, relic: { id: relic.id, status: relic.status, owner_name: relic.owner_name, owner_date: relic.owner_date } });
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

module.exports = app; // exported for tests or imports
