const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const token = process.argv[2];
if (!token) { console.error('Usage: node scripts/check_token.js <token>'); process.exit(2); }
const raw = fs.readFileSync(path.join(__dirname, '..', 'Server', 'data', 'relics.json'), 'utf8');
const arr = JSON.parse(raw);
const h = crypto.createHash('sha256').update(String(token)).digest('hex');
const found = arr.find(r => r.token_hash === h);
console.log('token:', token);
console.log('sha256:', h);
if (found) console.log('FOUND: id=', found.id, 'status=', found.status, 'owner_name=', found.owner_name, 'owner_date=', found.owner_date);
else console.log('No matching relic for that token hash');
