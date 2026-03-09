const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'https://relic-backend-oh7f.onrender.com';
const ADMIN = process.env.ADMIN_KEY || 'florin-ADMIN-9f2b1c8d22-2026';

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function run(){
  const p = path.join(__dirname, 'data', 'relics.json');
  const raw = fs.readFileSync(p,'utf8');
  const arr = JSON.parse(raw);
  console.log('Will send', arr.length, 'relic updates to', BASE);
  let ok = 0;
  for (let i=0;i<arr.length;i++){
    const r = arr[i];
    const body = { id: r.id };
    if (typeof r.status !== 'undefined') body.status = r.status;
    if (Object.prototype.hasOwnProperty.call(r,'owner_name')) body.owner_name = r.owner_name === undefined ? null : r.owner_name;
    if (Object.prototype.hasOwnProperty.call(r,'owner_date')) body.owner_date = r.owner_date === undefined ? null : r.owner_date;
    try{
      const res = await fetch(BASE + '/api/admin/relic/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN },
        body: JSON.stringify(body),
      });
      if (!res.ok){
        const text = await res.text();
        console.error('FAILED', r.id, res.status, text);
      } else {
        ok++;
      }
    }catch(e){
      console.error('ERR', r.id, e.message || e);
    }
    if ((i+1) % 50 === 0) console.log('Progress', i+1, '/', arr.length);
    await sleep(20);
  }
  console.log('Done. successful updates:', ok, '/', arr.length);
}

run().catch(e=>{ console.error('Script failed', e); process.exit(1); });
