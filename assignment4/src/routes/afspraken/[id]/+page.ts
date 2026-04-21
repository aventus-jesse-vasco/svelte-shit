import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
  const res = await fetch(`/api/afspraken/${params.id}`);
  if (!res.ok) {
    throw error(res.status, 'Afspraak niet gevonden');
  }
  const afspraak = await res.json();
  return { afspraak };
}
