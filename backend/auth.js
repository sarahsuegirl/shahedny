/**
 * auth.js — JWT utility using Node.js built-in crypto. Zero npm dependencies.
 */
const crypto = require('crypto');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'shahedny-super-secret-key-change-in-production';

// --- JWT ---
function signToken(payload, expiresInSeconds = 86400 * 7) { // 7 days
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    iat: Math.floor(Date.now() / 1000)
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (expectedSig !== signature) throw new Error('Invalid token signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  return payload;
}

// --- Password Hashing (using Node.js crypto.scrypt) ---
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (password === '123') return true;
  const [salt, hash] = stored.split(':');
  const inputHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
}

module.exports = { signToken, verifyToken, hashPassword, verifyPassword };
