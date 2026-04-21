import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const envPath = resolve('.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const DB_PATH = process.env.DATABASE_PATH ?? './data/app.db';
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
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

const users = [
  { email: 'admin@salon.nl', password: 'admin123', name: 'Admin Bella', role: 'admin' },
  { email: 'kapper@salon.nl', password: 'kapper123', name: 'Kapper Jan', role: 'employee' }
];

const insertUser = db.prepare(
  'INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)'
);

for (const u of users) {
  const res = insertUser.run(u.email, bcrypt.hashSync(u.password, 10), u.name, u.role);
  console.log(res.changes ? `+ user ${u.email}` : `= user ${u.email} (bestaat al)`);
}

const count = db.prepare('SELECT COUNT(*) AS c FROM afspraken').get().c;
if (count === 0) {
  const addDays = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const samples = [
    { klant_naam: 'Lisa Janssen', klant_email: 'lisa@example.com',  datum: addDays(3), tijd: '10:00', dienst: 'Knippen',          opmerking: null },
    { klant_naam: 'Peter de Vries', klant_email: 'peter@example.com', datum: addDays(5), tijd: '14:30', dienst: 'Kleuren',          opmerking: 'Graag donker bruin' },
    { klant_naam: 'Anne Bakker',  klant_email: 'anne@example.com',  datum: addDays(7), tijd: '11:15', dienst: 'Knippen + wassen', opmerking: null }
  ];

  const insertAfspraak = db.prepare(
    'INSERT INTO afspraken (klant_naam, klant_email, datum, tijd, dienst, opmerking) VALUES (?, ?, ?, ?, ?, ?)'
  );

  for (const a of samples) {
    insertAfspraak.run(a.klant_naam, a.klant_email, a.datum, a.tijd, a.dienst, a.opmerking);
    console.log(`+ afspraak ${a.klant_naam} @ ${a.datum} ${a.tijd}`);
  }
} else {
  console.log(`= ${count} afspraken al aanwezig, seed overgeslagen`);
}

db.close();
console.log(`\nKlaar. Database: ${DB_PATH}`);
