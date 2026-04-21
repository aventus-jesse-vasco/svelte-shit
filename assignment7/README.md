# SVLT07 — Eindopdracht: Afsprakensysteem "Salon Bella"

Een volledige full-stack webapp waarmee klanten zelf een afspraak kunnen maken,
en medewerkers (na inloggen) afspraken kunnen bekijken, filteren, bewerken en verwijderen.

## Architectuur

| Laag | Technologie |
|------|-------------|
| Frontend | SvelteKit (Svelte 5 runes) + Tailwind CSS |
| Backend | Node.js via SvelteKit server endpoints (`+server.ts`) |
| Database | SQLite (via `better-sqlite3`) |
| Auth | bcrypt (wachtwoord-hash) + HMAC-signed session cookie |

## Projectstructuur

```
assignment7/
├── data/                           # SQLite database (gegenereerd)
├── scripts/init-db.js              # Migratie + seed script
├── src/
│   ├── app.html / app.css / app.d.ts
│   ├── hooks.server.ts             # Leest session cookie, zet locals.user
│   ├── lib/
│   │   ├── shared.ts               # Gedeelde types, DIENSTEN, validatie
│   │   ├── components/
│   │   │   └── AfspraakForm.svelte # Herbruikbaar formulier (maken + bewerken)
│   │   └── server/
│   │       ├── db.ts               # SQLite verbinding + schema
│   │       ├── auth.ts             # Hash, verify, sign, verify session
│   │       └── afspraken.ts        # CRUD functies
│   └── routes/
│       ├── +layout.svelte          # Nav + auth state
│       ├── +layout.server.ts       # Geeft user door aan layout
│       ├── +page.svelte            # Klant — afspraak maken
│       ├── login/+page.svelte      # Medewerker login
│       ├── mijn-afspraak/          # Klant — eigen afspraak zoeken/wijzigen/annuleren
│       │   ├── +page.svelte
│       │   └── [id]/+page.svelte
│       ├── admin/                  # Medewerker dashboard (beveiligd)
│       │   ├── +layout.server.ts   # Auth-guard
│       │   ├── +page.server.ts     # List + filter (SSR)
│       │   ├── +page.svelte
│       │   └── [id]/+page.svelte   # Bewerken
│       └── api/
│           ├── afspraken/+server.ts        # GET (list), POST (create)
│           ├── afspraken/[id]/+server.ts   # GET, PUT, DELETE
│           ├── mijn-afspraken/+server.ts   # Publieke lookup op e-mail
│           ├── login/+server.ts            # POST
│           └── logout/+server.ts           # POST
```

## Installatie

### 1. Dependencies

```bash
cd assignment7
npm install
```

### 2. Environment

Kopieer `.env.example` naar `.env` en pas `SESSION_SECRET` aan:

```bash
cp .env.example .env
```

### 3. Database

```bash
npm run db:init
```

Dit maakt `./data/app.db` aan, zet het schema op en seedt twee test-accounts
en enkele voorbeeldafspraken.

### 4. Starten

```bash
npm run dev -- --open
```

App draait op `http://localhost:5173`.

### Test-accounts

| E-mail | Wachtwoord | Rol |
|--------|------------|-----|
| `admin@salon.nl` | `admin123` | admin |
| `kapper@salon.nl` | `kapper123` | employee |

## API

Alle endpoints verwachten/retourneren JSON.

### Publiek

- `POST /api/afspraken` — nieuwe afspraak aanmaken
  ```json
  { "klant_naam": "...", "klant_email": "...", "datum": "2026-05-01",
    "tijd": "14:00", "dienst": "Knippen", "opmerking": "" }
  ```
  → `201 Created` met de afspraak, of `422` met `{ "errors": {...} }`.

- `GET /api/afspraken/:id` — één afspraak ophalen.

- `PUT /api/afspraken/:id?email=<klant-email>` — klant wijzigt eigen afspraak
  (e-mail in query moet overeenkomen met `klant_email` op de afspraak).

- `DELETE /api/afspraken/:id?email=<klant-email>` — klant annuleert eigen afspraak.

- `GET /api/mijn-afspraken?email=<...>` — klant zoekt eigen afspraken.

- `POST /api/login` — `{ "email": "...", "password": "..." }` → zet session cookie.

- `POST /api/logout` — verwijdert session cookie.

### Alleen voor ingelogde medewerkers

- `GET /api/afspraken?naam=...&datum=...&dienst=...` — lijst met optionele filters.
- `PUT /api/afspraken/:id` — zonder `?email=` mag een medewerker elke afspraak wijzigen.
- `DELETE /api/afspraken/:id` — idem.

## User stories — gerealiseerd

| Prio | Story | Route |
|------|-------|-------|
| M | Klant maakt afspraak via formulier | `/` → `POST /api/afspraken` |
| M | Medewerker logt in | `/login` → `POST /api/login` |
| M | Medewerker ziet overzicht | `/admin` |
| M | Medewerker filtert op naam/datum/dienst | `/admin?naam=...&datum=...&dienst=...` |
| S | Medewerker bewerkt afspraak | `/admin/[id]` → `PUT /api/afspraken/[id]` |
| S | Medewerker verwijdert afspraak | knop op `/admin` → `DELETE /api/afspraken/[id]` |
| C | Klant wijzigt eigen afspraak | `/mijn-afspraak/[id]?email=...` |
| C | Klant annuleert eigen afspraak | idem, knop "Afspraak annuleren" |

## Validatie

- **Client-side** in `AfspraakForm.svelte` met live errors per veld.
- **Server-side** in `validateAfspraak` (`$lib/shared.ts`) — aangeroepen vanuit elk API endpoint. Beide gebruiken exact dezelfde regels.
- Datum in het verleden, lege velden, ongeldige e-mail, onbekende dienst worden afgewezen.

## Auth

- Wachtwoorden gehashed met `bcryptjs` (10 rounds).
- Sessie = HMAC-SHA256-signed JSON in HttpOnly cookie, 7 dagen geldig.
- `hooks.server.ts` verifieert bij elke request en vult `locals.user`.
- `/admin/+layout.server.ts` redirect naar `/login` als niet ingelogd.
- Rol zit in de sessie (`admin` / `employee`) — uitbreidbaar voor fijnmazige rechten.

## Productie build

```bash
npm run build
node build
```

Het `adapter-node` pakket bouwt een standalone Node server. Database blijft in `./data/`.
