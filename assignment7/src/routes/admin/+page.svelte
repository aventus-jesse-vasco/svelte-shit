<script lang="ts">
  import { invalidateAll } from '$app/navigation';

  let { data } = $props();

  let naam = $state(data.filters.naam);
  let datum = $state(data.filters.datum);
  let dienst = $state(data.filters.dienst);

  function applyFilters(e: SubmitEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (naam) params.set('naam', naam);
    if (datum) params.set('datum', datum);
    if (dienst) params.set('dienst', dienst);
    window.location.search = params.toString();
  }

  function resetFilters() {
    window.location.search = '';
  }

  async function remove(id: number) {
    if (!confirm(`Afspraak #${id} verwijderen?`)) return;
    const res = await fetch(`/api/afspraken/${id}`, { method: 'DELETE' });
    if (res.ok) await invalidateAll();
    else alert('Verwijderen mislukt.');
  }
</script>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-3xl font-bold text-slate-800">Afspraken overzicht</h1>
  <p class="text-slate-500">{data.afspraken.length} afspraken</p>
</div>

<form onsubmit={applyFilters} class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
  <div class="grid md:grid-cols-4 gap-3">
    <div>
      <label class="field-label" for="f-naam">Naam</label>
      <input id="f-naam" type="text" bind:value={naam} class="field-input" placeholder="Zoek op naam..." />
    </div>
    <div>
      <label class="field-label" for="f-datum">Datum</label>
      <input id="f-datum" type="date" bind:value={datum} class="field-input" />
    </div>
    <div>
      <label class="field-label" for="f-dienst">Dienst</label>
      <select id="f-dienst" bind:value={dienst} class="field-input">
        <option value="">Alle diensten</option>
        {#each data.diensten as d}
          <option value={d}>{d}</option>
        {/each}
      </select>
    </div>
    <div class="flex items-end gap-2">
      <button type="submit" class="btn-primary flex-1">Filteren</button>
      <button type="button" onclick={resetFilters} class="btn-secondary">Reset</button>
    </div>
  </div>
</form>

{#if data.afspraken.length === 0}
  <div class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
    <p class="text-slate-500">Geen afspraken gevonden.</p>
  </div>
{:else}
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-xs">
        <tr>
          <th class="text-left p-3">#</th>
          <th class="text-left p-3">Klant</th>
          <th class="text-left p-3">Datum</th>
          <th class="text-left p-3">Tijd</th>
          <th class="text-left p-3">Dienst</th>
          <th class="text-right p-3">Acties</th>
        </tr>
      </thead>
      <tbody>
        {#each data.afspraken as a (a.id)}
          <tr class="border-b border-slate-100 hover:bg-slate-50">
            <td class="p-3 text-slate-400">#{a.id}</td>
            <td class="p-3">
              <div class="font-medium text-slate-800">{a.klant_naam}</div>
              <div class="text-slate-500 text-xs">{a.klant_email}</div>
            </td>
            <td class="p-3">{a.datum}</td>
            <td class="p-3">{a.tijd}</td>
            <td class="p-3">
              <span class="px-2 py-1 bg-brand-100 text-brand-800 rounded text-xs">{a.dienst}</span>
            </td>
            <td class="p-3 text-right space-x-2">
              <a href={`/admin/${a.id}`} class="btn-secondary !py-1 !px-3 text-xs">Bewerken</a>
              <button onclick={() => remove(a.id)} class="btn-danger !py-1 !px-3 text-xs">Verwijderen</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
