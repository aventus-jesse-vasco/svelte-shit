<script lang="ts">
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = '';
    loading = true;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        error = body.error ?? 'Inloggen mislukt.';
        return;
      }
      await goto('/admin', { invalidateAll: true });
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-8">
  <div class="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
    <h1 class="text-2xl font-bold text-slate-800 mb-2">Medewerker login</h1>
    <p class="text-slate-500 text-sm mb-6">
      Alleen voor medewerkers. Log in om afspraken te beheren.
    </p>

    <form onsubmit={submit} class="space-y-4">
      <div>
        <label class="field-label" for="email">E-mailadres</label>
        <input id="email" type="email" bind:value={email} required class="field-input" />
      </div>
      <div>
        <label class="field-label" for="password">Wachtwoord</label>
        <input id="password" type="password" bind:value={password} required class="field-input" />
      </div>
      {#if error}
        <p class="text-red-600 text-sm">{error}</p>
      {/if}
      <button type="submit" disabled={loading} class="btn-primary w-full">
        {loading ? 'Bezig...' : 'Inloggen'}
      </button>
    </form>

    <p class="text-xs text-slate-400 mt-6 text-center">
      Test: admin@salon.nl / admin123
    </p>
  </div>
</div>
