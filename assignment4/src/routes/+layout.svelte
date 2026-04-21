<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<header class="bg-indigo-700 text-white shadow">
  <div class="max-w-4xl mx-auto p-4 flex justify-between items-center">
    <a href="/" class="text-xl font-bold">Kapperszaak</a>
    <nav class="flex gap-4">
      <a href="/" class="hover:underline">Home</a>
      <a href="/afspraken" class="hover:underline">Afspraken</a>
    </nav>
  </div>
</header>

<main class="max-w-4xl mx-auto p-6">
  {@render children()}
</main>
