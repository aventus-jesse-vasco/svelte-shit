import { listAfspraken, DIENSTEN } from '$lib/server/afspraken';

export function load({ url }) {
  const filters = {
    naam: url.searchParams.get('naam') ?? '',
    datum: url.searchParams.get('datum') ?? '',
    dienst: url.searchParams.get('dienst') ?? ''
  };
  const afspraken = listAfspraken({
    naam: filters.naam || undefined,
    datum: filters.datum || undefined,
    dienst: filters.dienst || undefined
  });
  return { afspraken, filters, diensten: DIENSTEN };
}
