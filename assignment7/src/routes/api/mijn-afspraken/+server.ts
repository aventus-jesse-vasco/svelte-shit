import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

// Public endpoint: customers look up their own afspraken by email.
// Returns only afspraken matching the provided email (case-insensitive).
export function GET({ url }) {
  const email = url.searchParams.get('email');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw error(400, 'Geldig e-mailadres vereist');
  }
  const rows = db
    .prepare('SELECT * FROM afspraken WHERE LOWER(klant_email) = LOWER(?) ORDER BY datum, tijd')
    .all(email);
  return json(rows);
}
