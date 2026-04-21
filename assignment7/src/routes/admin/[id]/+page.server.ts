import { error } from '@sveltejs/kit';
import { getAfspraak, DIENSTEN } from '$lib/server/afspraken';

export function load({ params }) {
  const afspraak = getAfspraak(Number(params.id));
  if (!afspraak) throw error(404, 'Afspraak niet gevonden');
  return { afspraak, diensten: DIENSTEN };
}
