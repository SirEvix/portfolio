// Simple JSON-backed datastore. Exports helpers to load/save relics.
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const JSON_PATH = path.join(DATA_DIR, 'relics.json');

function loadRelics() {
	if (!fs.existsSync(JSON_PATH)) return [];
	try {
		const raw = fs.readFileSync(JSON_PATH, 'utf8');
		return JSON.parse(raw);
	} catch (e) {
		console.error('Failed to read relics.json', e);
		return [];
	}
}

function saveRelics(arr) {
	fs.writeFileSync(JSON_PATH, JSON.stringify(arr, null, 2), 'utf8');
}

module.exports = { loadRelics, saveRelics, JSON_PATH };
