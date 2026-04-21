<script lang="ts">
  import { DIENSTEN } from '$lib/shared';

  type Props = {
    initial?: {
      klant_naam?: string;
      klant_email?: string;
      datum?: string;
      tijd?: string;
      dienst?: string;
      opmerking?: string | null;
    };
    submitLabel?: string;
    lockEmail?: boolean;
    onSubmit: (data: {
      klant_naam: string;
      klant_email: string;
      datum: string;
      tijd: string;
      dienst: string;
      opmerking: string;
    }) => Promise<{ errors?: Record<string, string>; error?: string } | void>;
  };

  let { initial = {}, submitLabel = 'Afspraak maken', lockEmail = false, onSubmit }: Props = $props();

  let klant_naam = $state(initial.klant_naam ?? '');
  let klant_email = $state(initial.klant_email ?? '');
  let datum = $state(initial.datum ?? '');
  let tijd = $state(initial.tijd ?? '');
  let dienst = $state(initial.dienst ?? '');
  let opmerking = $state(initial.opmerking ?? '');

  let errors: Record<string, string> = $state({});
  let submitting = $state(false);
  let serverError = $state('');

  const dienstOptions = DIENSTEN;

  function clientValidate() {
    const e: Record<string, string> = {};
    if (klant_naam.trim().length < 2) e.klant_naam = 'Naam moet minstens 2 tekens bevatten.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(klant_email)) e.klant_email = 'Vul een geldig e-mailadres in.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) e.datum = 'Kies een datum.';
    else if (datum < new Date().toISOString().slice(0, 10)) e.datum = 'Datum mag niet in het verleden liggen.';
    if (!/^\d{2}:\d{2}$/.test(tijd)) e.tijd = 'Kies een tijd.';
    if (!dienstOptions.includes(dienst as (typeof dienstOptions)[number])) e.dienst = 'Kies een dienst.';
    errors = e;
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    serverError = '';
    if (!clientValidate()) return;

    submitting = true;
    try {
      const result = await onSubmit({
        klant_naam: klant_naam.trim(),
        klant_email: klant_email.trim(),
        datum,
        tijd,
        dienst,
        opmerking: opmerking.trim()
      });
      if (result?.errors) errors = result.errors;
      if (result?.error) serverError = result.error;
    } finally {
      submitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="field-label" for="naam">Naam</label>
      <input id="naam" type="text" bind:value={klant_naam} class="field-input" />
      {#if errors.klant_naam}<p class="field-error">{errors.klant_naam}</p>{/if}
    </div>

    <div>
      <label class="field-label" for="email">E-mailadres</label>
      <input
        id="email"
        type="email"
        bind:value={klant_email}
        readonly={lockEmail}
        class="field-input"
        class:bg-slate-100={lockEmail}
      />
      {#if errors.klant_email}<p class="field-error">{errors.klant_email}</p>{/if}
    </div>

    <div>
      <label class="field-label" for="datum">Datum</label>
      <input id="datum" type="date" bind:value={datum} class="field-input" />
      {#if errors.datum}<p class="field-error">{errors.datum}</p>{/if}
    </div>

    <div>
      <label class="field-label" for="tijd">Tijd</label>
      <input id="tijd" type="time" bind:value={tijd} class="field-input" />
      {#if errors.tijd}<p class="field-error">{errors.tijd}</p>{/if}
    </div>

    <div class="md:col-span-2">
      <label class="field-label" for="dienst">Dienst</label>
      <select id="dienst" bind:value={dienst} class="field-input">
        <option value="">-- kies een dienst --</option>
        {#each dienstOptions as d}
          <option value={d}>{d}</option>
        {/each}
      </select>
      {#if errors.dienst}<p class="field-error">{errors.dienst}</p>{/if}
    </div>

    <div class="md:col-span-2">
      <label class="field-label" for="opmerking">Opmerking (optioneel)</label>
      <textarea
        id="opmerking"
        bind:value={opmerking}
        rows="3"
        class="field-input"
        placeholder="Bijvoorbeeld een allergie of voorkeur..."
      ></textarea>
    </div>
  </div>

  {#if serverError}
    <p class="text-red-600 font-medium">{serverError}</p>
  {/if}

  <button type="submit" disabled={submitting} class="btn-primary w-full md:w-auto">
    {submitting ? 'Bezig...' : submitLabel}
  </button>
</form>
