<script lang="ts">
  import AfspraakForm from '$lib/components/AfspraakForm.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();
  let saved = $state(false);

  async function submit(input: any) {
    const res = await fetch(`/api/afspraken/${data.afspraak.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (res.status === 422) return { errors: (await res.json()).errors };
    if (!res.ok) return { error: 'Opslaan mislukt.' };
    saved = true;
    setTimeout(() => (saved = false), 3000);
  }

  async function remove() {
    if (!confirm('Afspraak verwijderen?')) return;
    const res = await fetch(`/api/afspraken/${data.afspraak.id}`, { method: 'DELETE' });
    if (res.ok) await goto('/admin');
    else alert('Verwijderen mislukt.');
  }
</script>

<a href="/admin" class="text-brand-700 hover:underline mb-4 inline-block">← Terug naar overzicht</a>

<h1 class="text-3xl font-bold text-slate-800 mb-6">
  Afspraak #{data.afspraak.id} bewerken
</h1>

{#if saved}
  <div class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3 mb-4">
    ✓ Wijzigingen opgeslagen
  </div>
{/if}

<div class="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-4">
  <AfspraakForm initial={data.afspraak} submitLabel="Opslaan" onSubmit={submit} />
</div>

<button onclick={remove} class="btn-danger">Afspraak verwijderen</button>
