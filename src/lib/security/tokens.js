import crypto from 'crypto';

/**
 * Generates an unambiguous, cryptographically random room code (e.g. CYBER-7X9 or 6-char ALPHANUMERIC)
 */
export function generateRoomCode() {
  // Characters excluding easily confused glyphs (0, O, 1, I, L)
  const charset = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += charset[bytes[i] % charset.length];
  }
  return code;
}

/**
 * Generates a high-entropy secret token for session authorization (host or participant)
 */
export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a token using SHA-256 for safe storage in the database
 */
export function hashToken(token) {
  if (!token || typeof token !== 'string') return '';
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Sanitizes and validates player nicknames
 * - Max length 25
 * - Min length 2
 * - Alphanumeric, spaces, underscores, dashes
 */
export function sanitizeNickname(rawNickname) {
  if (!rawNickname || typeof rawNickname !== 'string') {
    return { valid: false, error: 'Nickname tidak boleh kosong.' };
  }

  const trimmed = rawNickname.trim().replace(/\s+/g, ' ');

  if (trimmed.length < 2) {
    return { valid: false, error: 'Nickname minimal 2 karakter.' };
  }

  if (trimmed.length > 25) {
    return { valid: false, error: 'Nickname maksimal 25 karakter.' };
  }

  // Allow letters, numbers, spaces, underscores, dashes
  const safeRegex = /^[a-zA-Z0-9_\-\s]+$/;
  if (!safeRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Nickname hanya boleh berisi huruf, angka, spasi, dash (-), dan underscore (_).',
    };
  }

  return { valid: true, nickname: trimmed };
}
