import { describe, it, expect } from 'vitest'
import { bmi, totalGainRange, recommendedGain, assessGain } from '@/core/weightGain'

describe('weightGain', () => {
  it('computes BMI to one decimal', () => {
    expect(bmi(160, 55)).toBe(21.5)
  })

  it('picks the WS/T 801-2022 range by pre-pregnancy BMI', () => {
    expect(totalGainRange(18.4)).toMatchObject({ min: 11, max: 16 })
    expect(totalGainRange(18.5)).toMatchObject({ min: 8, max: 14 })
    expect(totalGainRange(23.9)).toMatchObject({ min: 8, max: 14 })
    expect(totalGainRange(24.0)).toMatchObject({ min: 7, max: 11 })
    expect(totalGainRange(28.0)).toMatchObject({ min: 5, max: 9 })
  })

  it('allows 0-2 kg in the first trimester then interpolates to term', () => {
    expect(recommendedGain(21.5, 0)).toEqual({ min: 0, max: 0 })
    expect(recommendedGain(21.5, 13)).toEqual({ min: 0, max: 2 })
    expect(recommendedGain(21.5, 26)).toEqual({ min: 3.9, max: 7.8 })
    expect(recommendedGain(21.5, 40)).toEqual({ min: 8, max: 14 })
    expect(recommendedGain(21.5, 42)).toEqual({ min: 8, max: 14 })
  })

  it('assesses current gain', () => {
    const p = { heightCm: 160, preWeightKg: 55 }
    expect(assessGain(p, 26, 60)).toBe('normal')
    expect(assessGain(p, 26, 66)).toBe('high')
    expect(assessGain(p, 26, 56)).toBe('low')
  })
})
