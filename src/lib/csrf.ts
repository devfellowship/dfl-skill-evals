import crypto from 'crypto';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER_NAME = 'x-csrf-token';

export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

export function validateCSRFToken(token: string | null, storedToken: string | null): boolean {
  if (!token || !storedToken) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
  } catch {
    return false;
  }
}

export function getCSRFTokenFromRequest(request: Request): string | null {
  const header = request.headers.get(CSRF_HEADER_NAME);
  if (header) {
    return header;
  }

  const body = request.body;
  if (body) {
    try {
      const data = JSON.parse(body as any);
      return data._csrf_token || null;
    } catch {
      return null;
    }
  }

  return null;
}

export function validateRequestOrigin(request: Request, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (!origin && !referer) {
    return false;
  }

  const sourceOrigin = origin || (referer ? new URL(referer).origin : null);

  if (!sourceOrigin) {
    return false;
  }

  return allowedOrigins.some(allowed => sourceOrigin.includes(allowed));
}
