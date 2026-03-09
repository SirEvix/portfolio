// Simple JSON-backed datastore. Exports helpers to load/save relics.
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const JSON_PATH = path.join(DATA_DIR, 'relics.json');
const PERSIST_LOG = path.join(DATA_DIR, 'persist.log');

function loadRelics() {
	if (!fs.existsSync(JSON_PATH)) return [];
	try {
		const stat = fs.statSync(JSON_PATH);
		console.log(new Date().toISOString(), 'loadRelics:', JSON_PATH, `mtime=${stat.mtime.toISOString()}`, `size=${stat.size}`);
		const raw = fs.readFileSync(JSON_PATH, 'utf8');
		return JSON.parse(raw);
	} catch (e) {
		console.error('Failed to read relics.json', e);
		return [];
	}
}

function saveRelics(arr) {
	try {
		const tmp = JSON_PATH + '.tmp';
		fs.writeFileSync(tmp, JSON.stringify(arr, null, 2), 'utf8');
		fs.renameSync(tmp, JSON_PATH);

		const stat = fs.statSync(JSON_PATH);
		const now = new Date().toISOString();
		const entry = `${now} SAVE ${JSON_PATH} size=${stat.size} relics=${arr.length}\n`;
		try {
			fs.appendFileSync(PERSIST_LOG, entry, 'utf8');
		} catch (e) {
			console.error('Failed to append persist log', e);
		}
		console.log(entry.trim());
	} catch (e) {
		console.error('Failed to save relics.json', e);
		// Re-throw so callers can detect failure if desired
		throw e;
	}
}

function getPersistenceStatus() {
	try {
		if (!fs.existsSync(JSON_PATH)) return { exists: false };
		const stat = fs.statSync(JSON_PATH);
		return { exists: true, mtime: stat.mtime.toISOString(), size: stat.size };
	} catch (e) {
		console.error('Failed to stat relics.json', e);
		return { exists: false, error: String(e) };
	}
}

module.exports = { loadRelics, saveRelics, JSON_PATH, PERSIST_LOG, getPersistenceStatus };
