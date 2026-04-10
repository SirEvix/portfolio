const fs = require('fs');
const path = require('path');
const inPath = path.join(__dirname, '..', 'Server', 'data', 'relics.json');
const outPath = path.join(__dirname, '..', 'Server', 'data', 'relics.csv');
try {
  const raw = fs.readFileSync(inPath, 'utf8');
  const arr = JSON.parse(raw);
  const headers = ['id','token_hash','internal_code_hash','status','owner_name','owner_date'];
  const csvLines = [headers.join(',')];
  arr.forEach(r => {
    const row = headers.map(h => {
      let v = r[h];
      if (v === null || v === undefined) return '';
      if (typeof v === 'string') {
        if (v.includes(',') || v.includes('\"') || v.includes('\n')) {
          return '"' + v.replace(/"/g, '""') + '"';
        }
        return v;
      }
      return String(v);
    }).join(',');
    csvLines.push(row);
  });
  fs.writeFileSync(outPath, csvLines.join('\n'), 'utf8');
  console.log('Wrote', outPath);
} catch (err) {
  console.error('Error:', err.message);
  process.exitCode = 1;
}
