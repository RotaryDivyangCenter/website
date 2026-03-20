export type Stats = {
  lives_supported: string;
  prosthetic_limbs: string;
  camps: string;
  hours_per_week: string;
  years: string;
  csr_partners: string;
};

export const FALLBACK_STATS: Stats = {
  lives_supported: '4000+',
  prosthetic_limbs: '4000+',
  camps: '80+',
  hours_per_week: '40+',
  years: '10+',
  csr_partners: '4+',
};

const SHEET_ID = '1sQMC3DnHGHZhwudcqCyz0hHNXG8XJnyvYU8I6crTVCM';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

type GvizResponse = {
  table?: {
    cols?: Array<{ id?: string; label?: string }>;
    rows?: Array<{ c?: Array<{ v?: string | number | null }> }>;
  };
};

function toStringValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function extractJson(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || start >= end) {
    return text;
  }

  return text.slice(start, end + 1);
}

function mapFirstRow(parsed: GvizResponse): Stats | null {
  const cols = parsed.table?.cols ?? [];
  const rows = parsed.table?.rows ?? [];

  if (!cols.length || !rows.length) {
    return null;
  }

  const row = rows[0]?.c ?? [];
  const mapped = cols.reduce<Record<string, string>>((acc, col, index) => {
    const key = toStringValue(col.label || col.id).toLowerCase().replace(/\s+/g, '_');
    if (!key) return acc;

    acc[key] = toStringValue(row[index]?.v);
    return acc;
  }, {});

  const data = [mapped];
  const first = data[0];

  if (!first) return null;

  const result: Stats = {
    lives_supported: first.lives_supported || '',
    prosthetic_limbs: first.prosthetic_limbs || '',
    camps: first.camps || '',
    hours_per_week: first.hours_per_week || '',
    years: first.years || '',
    csr_partners: first.csr_partners || '',
  };

  return result;
}

function withFallback(stats: Stats): Stats {
  return {
    lives_supported: stats.lives_supported || FALLBACK_STATS.lives_supported,
    prosthetic_limbs: stats.prosthetic_limbs || FALLBACK_STATS.prosthetic_limbs,
    camps: stats.camps || FALLBACK_STATS.camps,
    hours_per_week: stats.hours_per_week || FALLBACK_STATS.hours_per_week,
    years: stats.years || FALLBACK_STATS.years,
    csr_partners: stats.csr_partners || FALLBACK_STATS.csr_partners,
  };
}

export async function getStats(): Promise<Stats> {
  try {
    const response = await fetch(SHEET_URL, { next: { revalidate: 60 } });

    if (!response.ok) {
      return FALLBACK_STATS;
    }

    const rawText = await response.text();
    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText) as GvizResponse;
    const mapped = mapFirstRow(parsed);

    if (!mapped) {
      return FALLBACK_STATS;
    }

    return withFallback(mapped);
  } catch {
    return FALLBACK_STATS;
  }
}
