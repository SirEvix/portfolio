Server for Cursed Relics

What this server does (simple):
- Stores the list of 500 relics and their status in a JSON file: `Server/data/relics.json`.
- Exposes a small HTTP API (routes) your frontend can call to verify tokens and claim relics.

Easy, step-by-step run instructions (for beginners)
1. Open a terminal and go to the Server folder:

   cd Server

2. Install the server dependency (only Express is required):

   npm install

3. Initialize the data file (run once; creates 500 dormant relics):

   npm run init-db

   - This creates `Server/data/relics.json` with 500 entries (id 1..500).
   - You only need to run this again if you want to reset to the initial state.

4. Start the server:

   npm start

   - The server listens on `http://localhost:4000` by default.
   - Keep this terminal open while you use the frontend. Your frontend will call the server at this address.

How the frontend uses the server
- The frontend should call endpoints at `http://localhost:4000` (or the server's URL if deployed).
- Example requests:

  Verify a token (GET):
  GET http://localhost:4000/api/relic/verify?token=THE_TOKEN

  Claim a relic (POST):
  POST http://localhost:4000/api/relic/claim
  Body JSON: { "token": "THE_TOKEN", "name": "Alice" }

  Mark a relic as sent (admin):
  POST http://localhost:4000/api/admin/relic/send
  Body JSON: { "id": 27 }

  Verify an internal code (admin):
  POST http://localhost:4000/api/admin/relic/verify-internal
  Body JSON: { "id": 27, "internal_code": "secret" }

How the data is stored and updated
- The server stores data in `Server/data/relics.json`. When a relic is claimed or updated, the server writes the file back so changes persist.
- If you prefer a proper database later, we can switch to SQLite or Postgres — the API will remain the same.

How to add token hashes or internal codes (non-technical way)
- The simplest: after you compute the SHA-256 hash for a token or code (see below), open `Server/data/relics.json` in a text editor and paste the hash into the `token_hash` or `internal_code_hash` field for the desired `id`.

  Example (compute hash in Node):

    node -e "console.log(require('./utils/hash').hashToken('THE_TOKEN'))"

  Then edit `Server/data/relics.json` and set `token_hash` for the relic `id`.

Security notes
- Admin endpoints are not protected in this scaffold. Before using in production, add a simple secret or authentication.

Admin protection (added)
- This server now requires an admin API key for all `/api/admin/*` endpoints.
- Set the key in the environment variable `ADMIN_KEY` before starting the server.

Examples (Windows PowerShell):

```powershell
$env:ADMIN_KEY = "your-admin-key-here"
npm start
```

Examples (cmd.exe):

```cmd
set ADMIN_KEY=your-admin-key-here
npm start
```

Include the key in requests using header `x-admin-key` or `x-api-key`, or use `Authorization: Bearer <key>`.

If you want, I can now:
- Add a protected admin key for admin endpoints (recommended), or
- Add an endpoint to bulk-import token hashes from a CSV/JSON file, or
- Wire the frontend to call the verify/claim endpoints.
