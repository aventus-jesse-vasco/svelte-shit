<script lang="ts">
  import { addTask } from '../../stores/taskStore.js';

  class TaskInput {
    #value = '';
    #error = '';

    get value() {
      return this.#value;
    }

    set value(v) {
      this.#value = v;
      const trimmed = v.trim();
      if (trimmed.length === 0) {
        this.#error = 'Taak mag niet leeg zijn.';
      } else if (trimmed.length < 3) {
        this.#error = 'Taak moet minstens 3 tekens lang zijn.';
      } else {
        this.#error = '';
      }
    }

    get error() {
      return this.#error;
    }

    get isValid() {
      return this.#value.trim().length >= 3;
    }

    reset() {
      this.#value = '';
      this.#error = '';
    }
  }

  const input = $state(new TaskInput());

  function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!input.isValid) {
      input.value = input.value;
      return;
    }
    addTask(input.value.trim());
    input.reset();
  }
</script>

<form onsubmit={submit} class="flex flex-col gap-2 mb-6">
  <div class="flex gap-2">
    <input
      type="text"
      placeholder="Nieuwe taak..."
      bind:value={input.value}
      class="flex-1 rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
    />
    <button
      type="submit"
      disabled={!input.isValid}
      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Toevoegen
    </button>
  </div>
  {#if input.error}
    <p class="text-red-600 text-sm">{input.error}</p>
  {/if}
</form>
