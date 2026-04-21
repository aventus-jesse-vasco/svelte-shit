<script lang="ts">
  import AddTask from '$lib/components/AddTask.svelte';
  import TaskList from '$lib/components/TaskList.svelte';
</script>

<main class="max-w-xl mx-auto p-8">
  <h1 class="text-3xl font-bold text-slate-800 mb-6">Takenlijst (met store)</h1>
  <AddTask />
  <TaskList />
</main>
