<script lang="ts">
  import AfspraakForm from '$lib/components/AfspraakForm.svelte';

  let created = $state<null | { id: number; klant_email: string }>(null);

  async function submit(data: {
    klant_naam: string;
    klant_email: string;
    datum: string;
    tijd: string;
    dienst: string;
    opmerking: string;
  }) {
    const res = await fetch('/api/afspraken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.status === 422) {
      const body = await res.json();
      return { errors: body.errors ?? {} };
    }
    if (!res.ok) return { error: 'Er ging iets mis. Probeer opnieuw.' };

    const afspraak = await res.json();
    created = { id: afspraak.id, klant_email: afspraak.klant_email };
  }
</script>

<section class="bg-gradient-to-br from-brand-600 to-brand-800 text-white rounded-3xl p-10 mb-8 shadow-xl">
  <h1 class="text-4xl font-bold mb-3">Maak een afspraak</h1>
  <p class="text-brand-100 text-lg">
    Plan direct online een afspraak. Geen wachttijden aan de telefoon.
  </p>
</section>

{#if created}
  <div class="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
    <div class="text-5xl mb-3">✅</div>
    <h2 class="text-2xl font-bold text-green-800 mb-2">Afspraak bevestigd!</h2>
    <p class="text-slate-700 mb-2">
      Je afspraaknummer is <strong>#{created.id}</strong>.
    </p>
    <p class="text-slate-600 mb-6">
      Wil je je afspraak later wijzigen of annuleren? Ga naar
      <a href="/mijn-afspraak" class="text-brand-700 underline">Mijn afspraak</a>
      en zoek op je e-mailadres.
    </p>
    <button onclick={() => (created = null)} class="btn-secondary">Nog een afspraak maken</button>
  </div>
{:else}
  <div class="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
    <AfspraakForm onSubmit={submit} />
  </div>
{/if}
