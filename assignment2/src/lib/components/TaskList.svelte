<script lang="ts">
  import TaskItem from './TaskItem.svelte';

  type Task = {
    id: number;
    title: string;
    priority?: 'low' | 'medium' | 'high';
    done?: boolean;
  };

  let tasks: Task[] = $state([
    { id: 1, title: 'Svelte tutorial afronden', priority: 'high', done: false },
    { id: 2, title: 'Boodschappen doen', priority: 'medium', done: false },
    { id: 3, title: 'Hond uitlaten', priority: 'low', done: true },
    { id: 4, title: 'Code commit pushen', priority: 'high', done: false }
  ]);

  $inspect(tasks).with((_type, value) => {
    console.log('tasks state:', value);
  });

  const openTasks = $derived(tasks.filter((t) => !t.done));

  function complete(id: number) {
    const task = tasks.find((t) => t.id === id);
    if (task) task.done = true;
  }
</script>

<section class="max-w-xl mx-auto p-8">
  <h1 class="text-3xl font-bold text-slate-800 mb-2">Mijn takenlijst</h1>
  <p class="text-slate-500 mb-6">
    {openTasks.length} open {openTasks.length === 1 ? 'taak' : 'taken'}
  </p>

  {#if openTasks.length > 0}
    <ul class="space-y-3">
      {#each openTasks as task (task.id)}
        <TaskItem {...task} onComplete={complete} />
      {/each}
    </ul>
  {:else}
    <div class="text-center p-12 bg-green-50 border-2 border-green-200 rounded-2xl">
      <div class="text-5xl mb-3">🎉</div>
      <p class="text-xl font-semibold text-green-800">Alles is gedaan!</p>
    </div>
  {/if}
</section>
