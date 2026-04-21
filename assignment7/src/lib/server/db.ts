import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DB_PATH = process.env.DATABASE_PATH ?? './data/app.db';

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'employee',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS afspraken (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    klant_naam TEXT NOT NULL,
    klant_email TEXT NOT NULL,
    datum TEXT NOT NULL,
    tijd TEXT NOT NULL,
    dienst TEXT NOT NULL,
    opmerking TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_afspraken_datum ON afspraken(datum);
  CREATE INDEX IF NOT EXISTS idx_afspraken_email ON afspraken(klant_email);
`);
