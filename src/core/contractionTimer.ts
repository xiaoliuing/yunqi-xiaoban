export interface Contraction {
  start: number
  end: number
}

export interface ContractionWithStats extends Contraction {
  durationSec: number
  intervalMin: number | null
}

const MIN = 60_000

export function withStats(list: Contraction[]): ContractionWithStats[] {
  const sorted = [...list].sort((a, b) => a.start - b.start)
  return sorted.map((c, i) => ({
    ...c,
    durationSec: Math.round((c.end - c.start) / 1000),
    intervalMin: i === 0 ? null : Math.round(((c.start - sorted[i - 1].start) / MIN) * 10) / 10,
  }))
}

export function is511(list: Contraction[]): boolean {
  const s = [...list].sort((a, b) => a.start - b.start)
  if (s.length < 2) return false
  const longEnough = (c: Contraction) => c.end - c.start >= MIN
  let i = s.length - 1
  if (!longEnough(s[i])) return false
  while (i > 0 && s[i].start - s[i - 1].start <= 5 * MIN && longEnough(s[i - 1])) i--
  return s[s.length - 1].start - s[i].start >= 60 * MIN
}
