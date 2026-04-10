const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dataDir = path.resolve(__dirname, '..', 'Server', 'data');
const relicsPath = path.join(dataDir, 'relics.json');
const credsPath = path.join(dataDir, 'relics_credentials.json');
const csvPath = path.join(dataDir, 'relics.csv');

function sha256hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

try {
  const relicsRaw = fs.readFileSync(relicsPath, 'utf8');
  const credsRaw = fs.readFileSync(credsPath, 'utf8');

  const relics = JSON.parse(relicsRaw);
  const creds = JSON.parse(credsRaw);

  const relicMap = new Map(relics.map(r => [r.id, r]));
  const credsMap = new Map(creds.map(c => [c.id, c]));

  const missing = [];
  for (const c of creds) {
    if (!relicMap.has(c.id)) missing.push(c.id);
  }

  if (missing.length === 0) {
    console.log('No missing ids found; nothing to add.');
  } else {
    console.log('Missing ids to add:', missing.join(', '));
    // Backup original
    const bakPath = path.join(dataDir, `relics.json.bak.${Date.now()}`);
    fs.copyFileSync(relicsPath, bakPath);
    console.log('Backed up relics.json ->', bakPath);

    for (const id of missing) {
      const c = credsMap.get(id);
      if (!c) continue;
      const token_hash = sha256hex(c.token);
      const internal_code_hash = sha256hex(c.internal_code);
      const obj = {
        id: c.id,
        token_hash,
        internal_code_hash,
        status: 'dormant',
        owner_name: null,
        owner_date: null
      };
      relics.push(obj);
    }

    // Sort by id
    relics.sort((a,b)=>a.id-b.id);

    // Write updated relics.json
    fs.writeFileSync(relicsPath, JSON.stringify(relics, null, 2), 'utf8');
    console.log('Wrote updated', relicsPath, ' (added', missing.length, 'entries)');

    // Regenerate CSV
    const header = 'id,token_hash,internal_code_hash,status,owner_name,owner_date\n';
    const lines = relics.map(r => {
      const owner_name = r.owner_name ? r.owner_name.replace(/,/g, '') : '';
      const owner_date = r.owner_date ? r.owner_date : '';
      return `${r.id},${r.token_hash},${r.internal_code_hash},${r.status},${owner_name},${owner_date}`;
    });
    fs.writeFileSync(csvPath, header + lines.join('\n') + '\n', 'utf8');
    console.log('Wrote CSV ->', csvPath);
  }

  // Summary
  const total = JSON.parse(fs.readFileSync(relicsPath, 'utf8')).length;
  console.log('Final relic count:', total);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
