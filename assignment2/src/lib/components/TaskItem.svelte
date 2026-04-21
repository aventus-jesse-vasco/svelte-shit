<script lang="ts">
  type Props = {
    id: number;
    title: string;
    priority?: 'low' | 'medium' | 'high';
    done?: boolean;
    onComplete: (id: number) => void;
  };

  let { id, title, priority = 'medium', done = false, onComplete }: Props = $props();

  const colors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  };
</script>

<li
  class="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition"
>
  <div class="flex items-center gap-3">
    <span class="text-slate-400 text-sm">#{id}</span>
    <span class={done ? 'line-through text-slate-400' : 'font-medium'}>{title}</span>
    <span class="text-xs px-2 py-1 rounded-full border {colors[priority]}">{priority}</span>
  </div>

  {#if !done}
    <button
      class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      onclick={() => onComplete(id)}
    >
      Afronden
    </button>
  {:else}
    <span class="text-green-600 text-sm font-semibold">✓ Klaar</span>
  {/if}
</li>
