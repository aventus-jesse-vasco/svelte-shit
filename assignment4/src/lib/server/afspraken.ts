export type Afspraak = {
  id: number;
  klant: string;
  datum: string;
  tijd: string;
  dienst: string;
  prijs: number;
};

export const afspraken: Afspraak[] = [
  { id: 1, klant: 'Jan Jansen', datum: '2026-04-25', tijd: '09:00', dienst: 'Knippen', prijs: 25 },
  { id: 2, klant: 'Marie de Vries', datum: '2026-04-25', tijd: '10:30', dienst: 'Kleuren', prijs: 75 },
  { id: 3, klant: 'Piet Pieters', datum: '2026-04-26', tijd: '13:00', dienst: 'Baard trimmen', prijs: 15 },
  { id: 4, klant: 'Anna Bakker', datum: '2026-04-26', tijd: '15:30', dienst: 'Knippen + wassen', prijs: 35 },
  { id: 5, klant: 'Lucas Smits', datum: '2026-04-27', tijd: '11:00', dienst: 'Permanent', prijs: 95 }
];
