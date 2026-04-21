import { json, error } from '@sveltejs/kit';
import {
  findUserByEmail,
  verifyPassword,
  signSession,
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS
} from '$lib/server/auth';

export async function POST({ request, cookies }) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Ongeldige JSON');
  }

  const { email, password } = body;
  if (!email || !password) {
    return json({ error: 'E-mail en wachtwoord zijn verplicht.' }, { status: 400 });
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return json({ error: 'Ongeldige inloggegevens.' }, { status: 401 });
  }

  const sessionUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  cookies.set(SESSION_COOKIE, signSession(sessionUser), SESSION_COOKIE_OPTIONS);

  return json({ user: sessionUser });
}
