const JWT_LIFETIME_SECONDS = 60 * 60; // 1 hour

export function sanitizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[<>`"'\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validateEmail(email) {
  const normalized = sanitizeText(email).toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  return { normalized, valid };
}

export function validatePassword(password) {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }

  if (password.trim().length === 0) {
    return { valid: false, message: 'Password is required.' };
  }

  return { valid: true, message: '' };
}

export function createMockJwt(payload) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: nowSeconds,
    exp: nowSeconds + JWT_LIFETIME_SECONDS,
  };

  return btoa(JSON.stringify(body));
}

export function decodeMockJwt(token) {
  try {
    const decoded = JSON.parse(atob(token));
    if (!decoded || typeof decoded !== 'object') {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeMockJwt(token);
  if (!payload?.exp) {
    return true;
  }
  return payload.exp * 1000 <= Date.now();
}

export function generateCsrfToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `csrf_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
