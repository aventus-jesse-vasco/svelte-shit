<script lang="ts">
  let {
    title = 'Over mij',
    subtitle = 'Student',
    body = 'Ik ben een student die Svelte leert.',
    emoji = '👋'
  } = $props();
</script>

<article class="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 shadow-lg">
  <div class="text-5xl">{emoji}</div>
  <h2 class="mt-3 text-2xl font-bold">{title}</h2>
  <p class="text-indigo-100 text-sm uppercase tracking-wide">{subtitle}</p>
  <p class="mt-4 leading-relaxed">{body}</p>
</article>
