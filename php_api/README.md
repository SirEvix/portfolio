# PHP API (migration of Node backend)

Overview
- This folder (`php_api`) contains the PHP implementation of the Relics backend and CLI utilities, designed for deployment on shared hosting (PHP 8 + MySQL + PDO).
- The PHP API preserves the original route names and JSON shapes so the frontend requires only a base-URL change.

Quick answers to your questions
1) Frontend changes: you do NOT need to rewrite frontend logic. Only update the base API URL used by the frontend to point to your Nominalia host (see "Frontend URL" below).
2) Route compatibility: the PHP API maintains the same routes and response shapes as the Node server (e.g. `GET /api/relic/verify?token=...`, `POST /api/relic/claim`).
3) Clean URLs: the included `.htaccess` rewrites allow clean URLs like `/api/relic/verify` to be served by `api/relic/verify.php` so the frontend does not need to include `.php` in paths.

Deployment checklist
- Upload the `php_api` directory to your hosting account's web root (or a subfolder). Ensure `php_api` is the served document root or place the files beneath the web root.
- Ensure `mod_rewrite` and `mod_headers` are enabled on Apache (Nominalia shared hosting typically supports .htaccess).
- Create a MySQL database and run `schema.sql` to create the `relics` table:

```sql
-- adjust DB name then run
CREATE DATABASE IF NOT EXISTS relics_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE relics_db;
SOURCE schema.sql;
```

Environment variables (recommended)
- `DB_HOST` (default: `127.0.0.1`)
- `DB_PORT` (default: `3306`)
- `DB_NAME` (default: `relics_db`)
- `DB_USER`
- `DB_PASS`
- `ADMIN_KEY` (required for admin endpoints)
- `ALLOWED_ORIGIN` (optional CORS origin; defaults to `*` in helpers)

Files and structure
- `config.php` — env-backed PDO factory
- `lib/` — helper libraries: `db.php`, `hash.php`, `auth.php`, `helpers.php`
- `api/` — API handlers following the same paths as the Node server, e.g. `api/relic/verify` (rewritten to `api/relic/verify.php` via .htaccess)
- `cli/` — CLI maintenance scripts (PHP-based): `init_db.php`, `migrate_to_mysql.php`, `fill_hashes.php`, `import_via_admin.php`, `check_token.php`, `json_to_csv.php`, `merge_relics_from_credentials.php`
- `data/` — optional local backups and `persist.log`

How the frontend should call the new API
- Update your frontend's base API URL (one place) from the old Render URL to the Nominalia URL. Example:

Old (Render):
```
https://relic-backend-on-render.example.com
```

New (Nominalia), where `example.com` is your domain and `php_api` is the folder serving the API (adjust if deployed at root):
```
https://example.com/php_api
```

With `.htaccess` rewrites enabled, the frontend continues to call the same endpoint paths, for example:
- `GET https://example.com/php_api/api/relic/verify?token=THE_TOKEN`
- `POST https://example.com/php_api/api/relic/claim` with JSON body `{ "token": "...", "name": "Alice" }`

CLI usage (examples run on the server or locally with PHP CLI)
- Initialize DB seed (creates 500 dormant rows):
```
php cli/init_db.php
```
- Migrate from `data/relics.json` into MySQL:
```
php cli/migrate_to_mysql.php
```
- Fill missing token/internal hashes and write plaintext creds to `data/relics_credentials.json` (KEEP SECRET):
```
php cli/fill_hashes.php
```
- Import updates via admin API (make sure `BASE` and `ADMIN_KEY` env vars are set):
```
BASE='https://example.com/php_api' ADMIN_KEY='your-admin-key' php cli/import_via_admin.php
```
- Check a token via CLI:
```
php cli/check_token.php <token>
```
- Export CSV from DB:
```
php cli/json_to_csv.php
```

Security notes
- `relics_credentials.json` contains plaintext tokens/internal codes — treat as secret and remove from public servers after migrating.
- Set `ADMIN_KEY` in hosting environment (do not commit it to repo).
- Use HTTPS for your public endpoints and for `import_via_admin` calls.

Next steps I can take for you
- (Optional) Add a simple test script that exercises `verify` and `claim` against a dev DB.
- (Optional) Add a small `deploy.sh` or instructions specific to Nominalia if you want exact steps.
