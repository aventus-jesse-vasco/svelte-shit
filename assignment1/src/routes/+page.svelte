<script lang="ts">
  import Welcome from '$lib/components/Welcome.svelte';
  import InfoCard from '$lib/components/InfoCard.svelte';
</script>

<main class="max-w-3xl mx-auto p-8 space-y-6">
  <Welcome name="Vasie" />

  <InfoCard
    title="Mijn hond Rex"
    subtitle="Labrador, 4 jaar"
    emoji="🐶"
    body="Rex is gek op wandelen, bal apporteren en slapen op de bank. Zijn favoriete snack is kaas."
  />

  <InfoCard
    title="Over mij"
    subtitle="Software Student"
    emoji="💻"
    body="Ik leer graag nieuwe frameworks. Op dit moment duik ik in Svelte en SvelteKit."
  />
</main>
