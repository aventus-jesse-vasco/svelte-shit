<script lang="ts">
  import AfspraakForm from '$lib/components/AfspraakForm.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let id = $derived(Number($page.params.id));
  let email = $derived($page.url.searchParams.get('email') ?? '');

  let afspraak = $state<any>(null);
  let loading = $state(true);
  let loadError = $state('');
  let updated = $state(false);
  let deleted = $state(false);

  onMount(async () => {
    try {
      const res = await fetch(`/api/afspraken/${id}`);
      if (!res.ok) {
        loadError = 'Afspraak niet gevonden.';
        return;
      }
      const a = await res.json();
      if (email.toLowerCase() !== a.klant_email.toLowerCase()) {
        loadError = 'E-mailadres komt niet overeen met deze afspraak.';
        return;
      }
      afspraak = a;
    } finally {
      loading = false;
    }
  });

  async function submit(data: any) {
    const res = await fetch(`/api/afspraken/${id}?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.status === 422) return { errors: (await res.json()).errors };
    if (!res.ok) return { error: 'Opslaan mislukt.' };
    updated = true;
    setTimeout(() => (updated = false), 3000);
  }

  async function cancel() {
    if (!confirm('Weet je zeker dat je deze afspraak wilt annuleren?')) return;
    const res = await fetch(`/api/afspraken/${id}?email=${encodeURIComponent(email)}`, {
      method: 'DELETE'
    });
    if (res.ok) deleted = true;
  }
</script>

<a href="/mijn-afspraak" class="text-brand-700 hover:underline mb-4 inline-block">
  ← Terug naar zoeken
</a>

{#if loading}
  <p class="text-slate-500">Laden...</p>
{:else if loadError}
  <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
    {loadError}
  </div>
{:else if deleted}
  <div class="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
    <div class="text-5xl mb-3">👋</div>
    <h2 class="text-2xl font-bold text-green-800 mb-2">Afspraak geannuleerd</h2>
    <p class="text-slate-600">Je afspraak is succesvol verwijderd.</p>
  </div>
{:else}
  <h1 class="text-3xl font-bold text-slate-800 mb-6">Afspraak #{afspraak.id} wijzigen</h1>

  {#if updated}
    <div class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4">
      ✓ Wijzigingen opgeslagen
    </div>
  {/if}

  <div class="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-4">
    <AfspraakForm initial={afspraak} submitLabel="Wijzigingen opslaan" lockEmail onSubmit={submit} />
  </div>

  <button onclick={cancel} class="btn-danger">Afspraak annuleren</button>
{/if}
