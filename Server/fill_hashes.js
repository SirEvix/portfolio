const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const relicsPath = path.join(__dirname, 'data', 'relics.json')
const credsPath = path.join(__dirname, 'data', 'relics_credentials.json')

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex')
}

function randomToken(len = 64) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex')
}

function randomCode(len = 8) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

if (!fs.existsSync(relicsPath)) {
  console.error('relics.json not found at', relicsPath)
  process.exit(1)
}

const relics = JSON.parse(fs.readFileSync(relicsPath, 'utf8'))
const creds = []
let count = 0

for (const r of relics) {
  if (!r.token_hash) {
    const token = randomToken(64)
    const tokenHash = sha256Hex(token)
    r.token_hash = tokenHash
    creds.push({ id: r.id, token })
    count++
  }
  if (!r.internal_code_hash) {
    const internal = randomCode(8)
    const internalHash = sha256Hex(internal)
    r.internal_code_hash = internalHash
    // attach internal code to creds entry
    const entry = creds.find(c => c.id === r.id) || { id: r.id }
    entry.internal_code = internal
    if (!creds.find(c => c.id === entry.id)) creds.push(entry)
  }
}

fs.writeFileSync(relicsPath, JSON.stringify(relics, null, 2), 'utf8')
fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2), 'utf8')

console.log(`Updated ${relicsPath} — filled ${count} token_hash entries.`)
console.log(`Plaintext tokens/internal codes written to ${credsPath} — keep this file secret.`)
