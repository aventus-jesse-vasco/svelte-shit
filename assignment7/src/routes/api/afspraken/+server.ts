import { json, error } from '@sveltejs/kit';
import {
  listAfspraken,
  createAfspraak,
  validateAfspraak,
  type AfspraakInput
} from '$lib/server/afspraken';

export function GET({ url, locals }) {
  if (!locals.user) {
    // Only employees can list all afspraken
    throw error(401, 'Niet ingelogd');
  }
  const filters = {
    naam: url.searchParams.get('naam') ?? undefined,
    datum: url.searchParams.get('datum') ?? undefined,
    dienst: url.searchParams.get('dienst') ?? undefined
  };
  return json(listAfspraken(filters));
}

export async function POST({ request }) {
  let body: Partial<AfspraakInput>;
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Ongeldige JSON');
  }

  const errors = validateAfspraak(body);
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 422 });
  }

  const created = createAfspraak(body as AfspraakInput);
  return json(created, { status: 201 });
}
