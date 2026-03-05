import {
  createMockJwt,
  decodeMockJwt,
  isTokenExpired,
  sanitizeText,
  validateEmail,
  validatePassword,
} from '../security';

describe('security utilities', () => {
  it('sanitizes potentially unsafe text', () => {
    expect(sanitizeText('<script>alert(1)</script>  hi')).toBe('scriptalert(1)/script hi');
  });

  it('validates and normalizes email', () => {
    const result = validateEmail(' Test@Example.com ');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('test@example.com');
  });

  it('allows any non-empty password', () => {
    expect(validatePassword('short').valid).toBe(true);
    expect(validatePassword('123').valid).toBe(true);
    expect(validatePassword('   ').valid).toBe(false);
  });

  it('creates decodable JWT payloads', () => {
    const token = createMockJwt({ sub: 'test@example.com', role: 'admin' });
    const payload = decodeMockJwt(token);
    expect(payload.sub).toBe('test@example.com');
    expect(payload.role).toBe('admin');
  });

  it('detects malformed or missing-exp tokens as expired', () => {
    expect(isTokenExpired('bad token')).toBe(true);
    const tokenWithoutExp = btoa(JSON.stringify({ sub: 'x' }));
    expect(isTokenExpired(tokenWithoutExp)).toBe(true);
  });
});
