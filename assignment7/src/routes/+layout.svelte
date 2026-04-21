<script lang="ts">
  import '../app.css';
  let { data, children } = $props();

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  }
</script>

<header class="bg-gradient-to-r from-brand-700 to-brand-900 text-white shadow-lg">
  <div class="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
    <a href="/" class="text-xl font-bold flex items-center gap-2">
      <span class="text-2xl">✂️</span> Salon Bella
    </a>
    <nav class="flex items-center gap-5 text-sm">
      <a href="/" class="hover:underline">Afspraak maken</a>
      <a href="/mijn-afspraak" class="hover:underline">Mijn afspraak</a>
      {#if data.user}
        <a href="/admin" class="hover:underline">Dashboard</a>
        <span class="text-brand-200">{data.user.name}</span>
        <button onclick={logout} class="btn btn-secondary text-slate-800 !py-1 !px-3 text-sm">
          Uitloggen
        </button>
      {:else}
        <a href="/login" class="btn bg-white/10 border border-white/30 hover:bg-white/20 !py-1 !px-3 text-sm">
          Medewerker login
        </a>
      {/if}
    </nav>
  </div>
</header>

<main class="max-w-5xl mx-auto px-6 py-8">
  {@render children()}
</main>

<footer class="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-slate-400">
  &copy; 2026 Salon Bella — Afsprakensysteem
</footer>
