# SVLT02 - Assignment 2: Props, Events & Condities

## Setup

```bash
npm install
npm run dev -- --open
```

## Wat is gedaan

- `TaskList.svelte` toont een interactieve takenlijst op de homepage
- Elke taak = eigen `TaskItem.svelte` component
- **Spreaded props** (`{...task}`) om taakdata door te geven
- **`$inspect`** logt tasks-state naar de console
- **`#if` / `#else`** toont "Alles is gedaan!" als geen open taken
- **`#each`** itereert door taken
- Knop markeert taak als afgerond (event-handler)
- Styling met Tailwind
