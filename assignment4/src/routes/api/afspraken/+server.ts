import { json } from '@sveltejs/kit';
import { afspraken } from '$lib/server/afspraken';

export function GET() {
  return json(afspraken);
}
