const path = require('path');
const fs = require('fs').promises;
const { saveRelics, JSON_PATH } = require('./db');

async function run() {
  try {
    const raw = await fs.readFile(JSON_PATH, 'utf8');
    const arr = JSON.parse(raw);
    console.log('Migrating', arr.length, 'relics to DB (using saveRelics)');
    await saveRelics(arr);
    console.log('Migration complete');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed', e);
    process.exit(2);
  }
}

run();
