<script lang="ts">
  let { data } = $props();
</script>

<h1 class="text-3xl font-bold text-slate-800 mb-6">Afspraken overzicht</h1>

<ul class="grid gap-4 sm:grid-cols-2">
  {#each data.afspraken as afspraak (afspraak.id)}
    <li>
      <a
        href={`/afspraken/${afspraak.id}`}
        class="block p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition"
      >
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-lg font-semibold text-indigo-700">{afspraak.klant}</h2>
          <span class="text-sm font-medium text-slate-500">€{afspraak.prijs}</span>
        </div>
        <p class="text-sm text-slate-600">{afspraak.dienst}</p>
        <p class="text-xs text-slate-400 mt-2">
          {afspraak.datum} om {afspraak.tijd}
        </p>
      </a>
    </li>
  {/each}
</ul>
