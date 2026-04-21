export async function load({ fetch }) {
  const res = await fetch('/api/afspraken');
  const afspraken = await res.json();
  return { afspraken };
}
