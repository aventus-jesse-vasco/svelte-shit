# SVLT03 - Assignment 3: Bindings, Stores & Forms

## Setup

```bash
npm install
npm run dev -- --open
```

## Wat is gedaan

- `src/stores/taskStore.js` - `writable([])` met `addTask`, `removeTask`, `toggleTask` via `tasks.update(...)`
- `AddTask.svelte` - invoerveld + submit-knop, `bind:value` op invoer
- Validatie via **private properties** (`#value`, `#error`) en **setters** — leeg of < 3 tekens geeft foutmelding
- `TaskList.svelte` - toont taken met `{#each}`, delete-knop per taak
- Styling met Tailwind
