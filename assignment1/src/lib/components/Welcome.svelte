<script lang="ts">
  let { name = 'wereld' } = $props();
</script>

<section class="rounded-2xl bg-white shadow-md p-6 border border-slate-200">
  <h1 class="text-3xl font-bold text-indigo-700">Hallo {name}!</h1>
  <p class="mt-2 text-slate-600">
    Welkom bij mijn eerste Svelte-app. Dit is een herbruikbaar
    <code class="px-1 bg-slate-100 rounded">Welcome</code> component.
  </p>
</section>
