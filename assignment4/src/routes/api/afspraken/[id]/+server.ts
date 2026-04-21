import { json, error } from '@sveltejs/kit';
import { afspraken } from '$lib/server/afspraken';

export function GET({ params }) {
  const id = Number(params.id);
  const afspraak = afspraken.find((a) => a.id === id);
  if (!afspraak) {
    throw error(404, `Afspraak met id ${params.id} niet gevonden`);
  }
  return json(afspraak);
}
