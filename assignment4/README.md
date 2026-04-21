# SVLT04 - Assignment 4: Routing & Backend

## Setup

```bash
npm install
npm run dev -- --open
```

## Wat is gedaan

### API
- `src/routes/api/afspraken/+server.ts` - geeft lijst met afspraken terug (JSON)
- `src/routes/api/afspraken/[id]/+server.ts` - geeft één afspraak terug op basis van ID (dynamic route)
- Data staat in `src/lib/server/afspraken.ts`

### Frontend
- `/afspraken` overzichtspagina met `+page.ts` load function die `/api/afspraken` ophaalt
- `/afspraken/[id]` detailpagina met dynamic route die `/api/afspraken/[id]` ophaalt
- "Terug naar overzicht" knop op detailpagina
- Gedeelde `+layout.svelte` met navigatie
- Styling met Tailwind
