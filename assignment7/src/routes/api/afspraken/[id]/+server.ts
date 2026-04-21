import { json, error } from '@sveltejs/kit';
import {
  getAfspraak,
  updateAfspraak,
  deleteAfspraak,
  validateAfspraak,
  type AfspraakInput
} from '$lib/server/afspraken';

export function GET({ params }) {
  const id = Number(params.id);
  const afspraak = getAfspraak(id);
  if (!afspraak) throw error(404, 'Afspraak niet gevonden');
  return json(afspraak);
}

export async function PUT({ params, request, locals, url }) {
  const id = Number(params.id);
  const current = getAfspraak(id);
  if (!current) throw error(404, 'Afspraak niet gevonden');

  let body: Partial<AfspraakInput> & { klant_email?: string };
  try {
    body = await request.json();
  } catch {
    throw error(400, 'Ongeldige JSON');
  }

  // Authorization: employees may edit anything; customers may only edit their
  // own via ?email=<hun email> matching the stored email on the afspraak.
  if (!locals.user) {
    const providedEmail = url.searchParams.get('email');
    if (!providedEmail || providedEmail.toLowerCase() !== current.klant_email.toLowerCase()) {
      throw error(403, 'Niet geautoriseerd');
    }
  }

  const errors = validateAfspraak({ ...current, ...body });
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 422 });
  }

  const updated = updateAfspraak(id, body);
  return json(updated);
}

export function DELETE({ params, locals, url }) {
  const id = Number(params.id);
  const current = getAfspraak(id);
  if (!current) throw error(404, 'Afspraak niet gevonden');

  if (!locals.user) {
    const providedEmail = url.searchParams.get('email');
    if (!providedEmail || providedEmail.toLowerCase() !== current.klant_email.toLowerCase()) {
      throw error(403, 'Niet geautoriseerd');
    }
  }

  deleteAfspraak(id);
  return new Response(null, { status: 204 });
}
