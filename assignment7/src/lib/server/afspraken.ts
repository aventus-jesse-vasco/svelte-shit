import { db } from './db';
import type { Afspraak, AfspraakInput } from '$lib/shared';

export { DIENSTEN, validateAfspraak } from '$lib/shared';
export type { Afspraak, AfspraakInput, ValidationErrors } from '$lib/shared';

export function listAfspraken(filters: { naam?: string; datum?: string; dienst?: string } = {}): Afspraak[] {
  const clauses: string[] = [];
  const params: Record<string, string> = {};

  if (filters.naam) {
    clauses.push('LOWER(klant_naam) LIKE @naam');
    params.naam = `%${filters.naam.toLowerCase()}%`;
  }
  if (filters.datum) {
    clauses.push('datum = @datum');
    params.datum = filters.datum;
  }
  if (filters.dienst) {
    clauses.push('dienst = @dienst');
    params.dienst = filters.dienst;
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `SELECT * FROM afspraken ${where} ORDER BY datum ASC, tijd ASC`;
  return db.prepare(sql).all(params) as Afspraak[];
}

export function getAfspraak(id: number): Afspraak | undefined {
  return db.prepare('SELECT * FROM afspraken WHERE id = ?').get(id) as Afspraak | undefined;
}

export function createAfspraak(input: AfspraakInput): Afspraak {
  const stmt = db.prepare(`
    INSERT INTO afspraken (klant_naam, klant_email, datum, tijd, dienst, opmerking)
    VALUES (@klant_naam, @klant_email, @datum, @tijd, @dienst, @opmerking)
  `);
  const result = stmt.run({ ...input, opmerking: input.opmerking ?? null });
  return getAfspraak(Number(result.lastInsertRowid))!;
}

export function updateAfspraak(id: number, input: Partial<AfspraakInput>): Afspraak | undefined {
  const current = getAfspraak(id);
  if (!current) return undefined;
  const merged = { ...current, ...input };
  db.prepare(`
    UPDATE afspraken
    SET klant_naam = @klant_naam,
        klant_email = @klant_email,
        datum = @datum,
        tijd = @tijd,
        dienst = @dienst,
        opmerking = @opmerking
    WHERE id = @id
  `).run({ ...merged, id });
  return getAfspraak(id);
}

export function deleteAfspraak(id: number): boolean {
  const result = db.prepare('DELETE FROM afspraken WHERE id = ?').run(id);
  return result.changes > 0;
}
