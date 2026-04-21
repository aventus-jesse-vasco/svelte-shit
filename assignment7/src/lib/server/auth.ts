import bcrypt from 'bcryptjs';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from './db';

const SECRET = process.env.SESSION_SECRET ?? 'dev-only-not-secure-change-me';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = { id: number; email: string; name: string; role: string };

export function hashPassword(plain: string): string {
  return bcrypt.hashSync(plain, 10);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

export function findUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
    | { id: number; email: string; password_hash: string; name: string; role: string }
    | undefined;
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

export function signSession(user: SessionUser): string {
  const payload = { ...user, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(createHmac('sha256', SECRET).update(body).digest());
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const expected = b64url(createHmac('sha256', SECRET).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(b64urlDecode(body).toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'session';
export const SESSION_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: SESSION_MAX_AGE
};
