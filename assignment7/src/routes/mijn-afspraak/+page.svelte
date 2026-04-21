<script lang="ts">
  let email = $state('');
  let results = $state<Array<{ id: number; klant_naam: string; datum: string; tijd: string; dienst: string }>>([]);
  let searched = $state(false);
  let loading = $state(false);
  let error = $state('');

  async function search(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error = 'Vul een geldig e-mailadres in.';
      return;
    }
    loading = true;
    try {
      const res = await fetch(`/api/mijn-afspraken?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        error = 'Zoeken mislukt. Probeer opnieuw.';
        results = [];
      } else {
        results = await res.json();
      }
      searched = true;
    } finally {
      loading = false;
    }
  }
</script>

<h1 class="text-3xl font-bold text-slate-800 mb-6">Mijn afspraak</h1>

<div class="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6">
  <p class="text-slate-600 mb-4">Vul je e-mailadres in om je afspraken te vinden.</p>
  <form onsubmit={search} class="flex gap-3 flex-col sm:flex-row">
    <input
      type="email"
      placeholder="jouw@email.nl"
      bind:value={email}
      class="field-input flex-1"
    />
    <button type="submit" disabled={loading} class="btn-primary">
      {loading ? 'Zoeken...' : 'Zoeken'}
    </button>
  </form>
  {#if error}<p class="field-error">{error}</p>{/if}
</div>

{#if searched}
  {#if results.length === 0}
    <p class="text-center text-slate-500 py-8">Geen afspraken gevonden voor dit e-mailadres.</p>
  {:else}
    <ul class="space-y-3">
      {#each results as a (a.id)}
        <li class="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex justify-between items-center">
          <div>
            <p class="font-semibold text-slate-800">{a.dienst}</p>
            <p class="text-sm text-slate-500">
              {a.datum} om {a.tijd} — {a.klant_naam}
            </p>
          </div>
          <a href={`/mijn-afspraak/${a.id}?email=${encodeURIComponent(email)}`} class="btn-secondary">
            Bekijk / wijzig
          </a>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
