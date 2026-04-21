// Shared types, constants and validation — safe for both client and server.
export const DIENSTEN = [
  'Knippen',
  'Knippen + wassen',
  'Kleuren',
  'Baard trimmen',
  'Permanent',
  'Kapsel styling'
] as const;

export type Dienst = (typeof DIENSTEN)[number];

export type Afspraak = {
  id: number;
  klant_naam: string;
  klant_email: string;
  datum: string;
  tijd: string;
  dienst: string;
  opmerking: string | null;
  created_at: string;
};

export type AfspraakInput = Omit<Afspraak, 'id' | 'created_at'>;
export type ValidationErrors = Partial<Record<keyof AfspraakInput, string>>;

export function validateAfspraak(input: Partial<AfspraakInput>): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!input.klant_naam || input.klant_naam.trim().length < 2) {
    errors.klant_naam = 'Naam moet minstens 2 tekens bevatten.';
  }
  if (!input.klant_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.klant_email)) {
    errors.klant_email = 'Vul een geldig e-mailadres in.';
  }
  if (!input.datum || !/^\d{4}-\d{2}-\d{2}$/.test(input.datum)) {
    errors.datum = 'Kies een geldige datum.';
  } else {
    const today = new Date().toISOString().slice(0, 10);
    if (input.datum < today) errors.datum = 'Datum mag niet in het verleden liggen.';
  }
  if (!input.tijd || !/^\d{2}:\d{2}$/.test(input.tijd)) {
    errors.tijd = 'Kies een geldige tijd (HH:MM).';
  }
  if (!input.dienst || !DIENSTEN.includes(input.dienst as Dienst)) {
    errors.dienst = 'Kies een geldige dienst.';
  }

  return errors;
}
