import type { Handle } from '@sveltejs/kit';
import { verifySession, SESSION_COOKIE } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE);
  event.locals.user = verifySession(token);
  return resolve(event);
};
