// Datastore adapter: supports local JSON file or Postgres when DATABASE_URL is provided.
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { Pool } = require('pg');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const JSON_PATH = path.join(DATA_DIR, 'relics.json');
const PERSIST_LOG = path.join(DATA_DIR, 'persist.log');

const DATABASE_URL = process.env.DATABASE_URL || process.env.INTERNAL_DATABASE_URL || process.env.EXTERNAL_DATABASE_URL || null;
// Supabase REST fallback: use HTTP PostgREST when direct TCP to Postgres is not available.
const SUPABASE_URL = process.env.SUPABASE_URL || null;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || null;
let pool = null;
if (DATABASE_URL) {
	pool = new Pool({ connectionString: DATABASE_URL });
}
const useRest = !!(SUPABASE_URL && SUPABASE_SERVICE_KEY) && !pool;
const REST_RELICS = useRest ? `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/relics` : null;

async function ensurePostgres() {
	if (useRest) {
		// Nothing to ensure for REST mode - assume table exists in Supabase
		return;
	}
	if (!pool) return;
	const create = `CREATE TABLE IF NOT EXISTS relics (
		id integer PRIMARY KEY,
		token_hash text,
		internal_code_hash text,
		status text,
		owner_name text,
		owner_date timestamptz
	);`;
	await pool.query(create);
}

async function loadRelics() {
	if (useRest) {
		try {
			const hdr = { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` };
			const url = `${REST_RELICS}?select=id,token_hash,internal_code_hash,status,owner_name,owner_date&order=id`;
			const res = await fetch(url, { headers: hdr });
			if (!res.ok) throw new Error(`rest_load_failed ${res.status}`);
			const rows = await res.json();
			return rows.map(r => ({ id: r.id, token_hash: r.token_hash, internal_code_hash: r.internal_code_hash, status: r.status, owner_name: r.owner_name, owner_date: r.owner_date || null }));
		} catch (e) {
			console.error('REST loadRelics failed', e);
			return [];
		}
	}
	if (pool) {
		await ensurePostgres();
		const res = await pool.query('SELECT id, token_hash, internal_code_hash, status, owner_name, owner_date FROM relics ORDER BY id');
		return res.rows.map(r => ({
			id: r.id,
			token_hash: r.token_hash,
			internal_code_hash: r.internal_code_hash,
			status: r.status,
			owner_name: r.owner_name,
			owner_date: r.owner_date ? r.owner_date.toISOString() : null
		}));
	}
	// file fallback
	try {
		const raw = await fsp.readFile(JSON_PATH, 'utf8');
		const stat = await fsp.stat(JSON_PATH);
		console.log(new Date().toISOString(), 'loadRelics:', JSON_PATH, `mtime=${stat.mtime.toISOString()}`, `size=${stat.size}`);
		return JSON.parse(raw);
	} catch (e) {
		if (e.code === 'ENOENT') return [];
		console.error('Failed to read relics.json', e);
		return [];
	}
}

async function saveRelics(arr) {
	if (useRest) {
		try {
			const hdr = { 'Content-Type': 'application/json', 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`, 'Prefer': 'resolution=merge-duplicates,return=representation' };
			// PostgREST: send array of rows to upsert (merge duplicates by primary key)
			const res = await fetch(REST_RELICS, { method: 'POST', headers: hdr, body: JSON.stringify(arr) });
			if (!res.ok) throw new Error(`rest_save_failed ${res.status}`);
			// append log entry to local file for visibility
			try {
				const now = new Date().toISOString();
				const entry = `${now} SAVE rest relics=${arr.length}\n`;
				await fsp.appendFile(PERSIST_LOG, entry, 'utf8');
				console.log(entry.trim());
			} catch (e) { console.error('Failed to append persist log', e); }
			return;
		} catch (e) {
			console.error('REST saveRelics failed', e);
			throw e;
		}
	}
	if (pool) {
		await ensurePostgres();
		const client = await pool.connect();
		try {
			await client.query('BEGIN');
			const upsertText = `INSERT INTO relics (id, token_hash, internal_code_hash, status, owner_name, owner_date)
				VALUES ($1,$2,$3,$4,$5,$6)
				ON CONFLICT (id) DO UPDATE SET token_hash=EXCLUDED.token_hash, internal_code_hash=EXCLUDED.internal_code_hash, status=EXCLUDED.status, owner_name=EXCLUDED.owner_name, owner_date=EXCLUDED.owner_date`;
			for (const r of arr) {
				await client.query(upsertText, [r.id, r.token_hash || null, r.internal_code_hash || null, r.status || null, r.owner_name || null, r.owner_date || null]);
			}
			await client.query('COMMIT');
		} catch (e) {
			await client.query('ROLLBACK');
			throw e;
		} finally {
			client.release();
		}
		// append log entry to local file for visibility
		try {
			const now = new Date().toISOString();
			const entry = `${now} SAVE postgres relics=${arr.length}\n`;
			await fsp.appendFile(PERSIST_LOG, entry, 'utf8');
			console.log(entry.trim());
		} catch (e) {
			console.error('Failed to append persist log', e);
		}
		return;
	}
	// file fallback: atomic write
	const tmp = JSON_PATH + '.tmp';
	try {
		await fsp.writeFile(tmp, JSON.stringify(arr, null, 2), 'utf8');
		await fsp.rename(tmp, JSON_PATH);
		const stat = await fsp.stat(JSON_PATH);
		const now = new Date().toISOString();
		const entry = `${now} SAVE ${JSON_PATH} size=${stat.size} relics=${arr.length}\n`;
		try { await fsp.appendFile(PERSIST_LOG, entry, 'utf8'); } catch (e) { console.error('Failed to append persist log', e); }
		console.log(entry.trim());
	} catch (e) {
		console.error('Failed to save relics.json', e);
		throw e;
	}
}

async function getPersistenceStatus() {
	if (useRest) {
		try {
			const hdr = { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` };
			const res = await fetch(`${REST_RELICS}?select=id,owner_date`, { headers: hdr });
			if (!res.ok) throw new Error(`rest_status_failed ${res.status}`);
			const rows = await res.json();
			const count = Array.isArray(rows) ? rows.length : 0;
			let latest = null;
			for (const r of rows) if (r.owner_date) latest = !latest || new Date(r.owner_date) > new Date(latest) ? r.owner_date : latest;
			return { exists: true, backend: 'postgres', count, latest_owner_date: latest };
		} catch (e) {
			console.error('Failed to stat REST postgres', e);
			return { exists: false, error: String(e) };
		}
	}
	if (pool) {
		try {
			await ensurePostgres();
			// Query count and latest update time from owner_date
			const res = await pool.query('SELECT COUNT(*)::int AS count, MAX(owner_date) AS latest_owner_date FROM relics');
			const count = res.rows[0].count;
			const latest = res.rows[0].latest_owner_date ? res.rows[0].latest_owner_date.toISOString() : null;
			return { exists: true, backend: 'postgres', count, latest_owner_date: latest };
		} catch (e) {
			console.error('Failed to stat postgres', e);
			return { exists: false, error: String(e) };
		}
	}
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
