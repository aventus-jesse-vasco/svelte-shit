<script lang="ts">
  import { tasks, removeTask, toggleTask } from '../../stores/taskStore.js';
</script>

{#if $tasks.length === 0}
  <p class="text-center text-slate-500 italic py-6">Nog geen taken. Voeg er een toe!</p>
{:else}
  <ul class="space-y-2">
    {#each $tasks as task (task.id)}
      <li
        class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-slate-200"
      >
        <label class="flex items-center gap-3 flex-1 cursor-pointer">
          <input
            type="checkbox"
            checked={task.done}
            onchange={() => toggleTask(task.id)}
            class="rounded text-indigo-600"
          />
          <span class={task.done ? 'line-through text-slate-400' : ''}>{task.title}</span>
        </label>
        <button
          class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          onclick={() => removeTask(task.id)}
        >
          Verwijderen
        </button>
      </li>
    {/each}
  </ul>
{/if}
