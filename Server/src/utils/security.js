import crypto from 'crypto';

/**
 * Encrypts plain text using AES-256-CBC.
 * Uses SHA-256 hash of keys to derive a 32-byte encryption key.
 */
const security = {
encrypt: async (text, encryptionKey, extraKey) => {
  const key = crypto.createHash('sha256').update(encryptionKey + extraKey).digest().slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
},

/**
 * Decrypts text encrypted with the encrypt function.
 * Expects format: iv:encryptedData (IV prepended as hex).
 */
decrypt: async (encryptedText, encryptionKey, extraKey) => {
  const key = crypto.createHash('sha256').update(encryptionKey + extraKey).digest().slice(0, 32);
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}
}
export default security;