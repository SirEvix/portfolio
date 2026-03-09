// Simple SHA-256 hashing utilities
const crypto = require('crypto');

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

function hashToken(token) {
  // Add any pepper/salting here if desired.
  return sha256Hex(token);
}

function hashInternalCode(code) {
  return sha256Hex(code);
}

module.exports = { hashToken, hashInternalCode };
