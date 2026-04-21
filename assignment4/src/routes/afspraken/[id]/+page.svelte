<script lang="ts">
  let { data } = $props();
  const { afspraak } = data;
</script>

<a
  href="/afspraken"
  class="inline-flex items-center text-indigo-600 hover:underline mb-4"
>
  ← Terug naar overzicht
</a>

<article class="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
  <header class="border-b pb-4 mb-4">
    <h1 class="text-3xl font-bold text-slate-800">{afspraak.klant}</h1>
    <p class="text-slate-500">Afspraak #{afspraak.id}</p>
  </header>

  <dl class="grid grid-cols-2 gap-4 text-slate-700">
    <div>
      <dt class="text-sm uppercase text-slate-400">Datum</dt>
      <dd class="font-medium">{afspraak.datum}</dd>
    </div>
    <div>
      <dt class="text-sm uppercase text-slate-400">Tijd</dt>
      <dd class="font-medium">{afspraak.tijd}</dd>
    </div>
    <div>
      <dt class="text-sm uppercase text-slate-400">Dienst</dt>
      <dd class="font-medium">{afspraak.dienst}</dd>
    </div>
    <div>
      <dt class="text-sm uppercase text-slate-400">Prijs</dt>
      <dd class="font-medium">€{afspraak.prijs}</dd>
    </div>
  </dl>
</article>
