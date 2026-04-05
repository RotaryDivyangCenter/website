

import { getServerFetchOptions } from '@/config/cache';

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

const SHEET_URL = process.env.GOOGLE_SHEET_URL
  ? `${process.env.GOOGLE_SHEET_URL}&sheet=Stats&headers=1`
  : undefined;

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

// Column order in the stats sheet: A=lives_supported, B=prosthetic_limbs,
// C=camps, D=hours_per_week, E=years, F=csr_partners.
// We map by position so the utility is immune to header label changes.
const STATS_COLUMN_ORDER: (keyof Stats)[] = [
  'lives_supported',
  'prosthetic_limbs',
  'camps',
  'hours_per_week',
  'years',
  'csr_partners',
];

function mapFirstRow(parsed: GvizResponse): Stats | null {
  const rows = parsed.table?.rows ?? [];

  if (!rows.length) return null;

  const row = rows[0]?.c ?? [];

  const result = {} as Stats;
  STATS_COLUMN_ORDER.forEach((key, index) => {
    result[key] = toStringValue(row[index]?.v);
  });

  // Return null only if every value is empty (completely blank row)
  if (STATS_COLUMN_ORDER.every((k) => !result[k])) return null;

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
    if (!SHEET_URL) {
      return FALLBACK_STATS;
    }

    const response = await fetch(SHEET_URL, getServerFetchOptions());

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
