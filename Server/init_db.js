// Initializes the SQLite database and creates the `relics` table with 500 entries.
// Run: from Server/ run `npm run init-db` (or `node init_db.js`).

const { saveRelics, JSON_PATH } = require('./db');
const fs = require('fs');
const path = require('path');

console.log('Using JSON file at', JSON_PATH);

// Create 500 dormant relics
const relics = [];
for (let i = 1; i <= 500; i++) {
  relics.push({
    id: i,
    token_hash: '',
    internal_code_hash: '',
    status: 'dormant',
    owner_name: null,
    owner_date: null
  });
}

saveRelics(relics);

console.log('Initialized relics.json with 500 dormant entries.');

console.log('\nInstructions:');
console.log('- To add token_hash values: compute SHA-256 and update the JSON file `Server/data/relics.json`.');
console.log("  Example (Node): const { hashToken } = require('./utils/hash'); console.log(hashToken('TOKEN'));");
console.log('- To add internal_code_hash values: use `hashInternalCode(code)` and store it in `internal_code_hash`.');
console.log('- To update statuses manually: edit the JSON or use the admin endpoints.');

console.log('\nDone.');
