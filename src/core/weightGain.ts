export interface GainRange {
  min: number
  max: number
}

export type GainAssessment = 'low' | 'normal' | 'high'

const TOTAL_GAIN: (GainRange & { belowBmi: number })[] = [
  { belowBmi: 18.5, min: 11, max: 16 },
  { belowBmi: 24, min: 8, max: 14 },
  { belowBmi: 28, min: 7, max: 11 },
  { belowBmi: Infinity, min: 5, max: 9 },
]

const FIRST_TRIMESTER_MAX = 2

const round1 = (n: number) => Math.round(n * 10) / 10

export function bmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100
  return round1(weightKg / (m * m))
}

export function totalGainRange(preBmi: number): GainRange {
  const r = TOTAL_GAIN.find((x) => preBmi < x.belowBmi)!
  return { min: r.min, max: r.max }
}

export function recommendedGain(preBmi: number, week: number): GainRange {
  const w = Math.min(Math.max(week, 0), 40)
  if (w <= 13) return { min: 0, max: round1((FIRST_TRIMESTER_MAX * w) / 13) }
  const total = totalGainRange(preBmi)
  const t = (w - 13) / 27
  return {
    min: round1(total.min * t),
    max: round1(FIRST_TRIMESTER_MAX + (total.max - FIRST_TRIMESTER_MAX) * t),
  }
}

export function assessGain(
  person: { heightCm: number; preWeightKg: number },
  week: number,
  currentKg: number,
): GainAssessment {
  const range = recommendedGain(bmi(person.heightCm, person.preWeightKg), week)
  const gain = round1(currentKg - person.preWeightKg)
  if (gain < range.min) return 'low'
  if (gain > range.max) return 'high'
  return 'normal'
}
