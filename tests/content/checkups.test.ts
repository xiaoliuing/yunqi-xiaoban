import { describe, it, expect } from 'vitest'
import { CHECKUPS } from '@/content/checkups'

describe('CHECKUPS', () => {
  it('has unique ids', () => {
    expect(new Set(CHECKUPS.map((c) => c.id)).size).toBe(CHECKUPS.length)
  })
  it('is sorted by start week with valid ranges', () => {
    for (let i = 0; i < CHECKUPS.length; i++) {
      const c = CHECKUPS[i]
      expect(c.endWeek).toBeGreaterThanOrEqual(c.startWeek)
      if (i > 0) expect(c.startWeek).toBeGreaterThan(CHECKUPS[i - 1].startWeek)
    }
  })
  it('includes OGTT as fasting', () => {
    expect(CHECKUPS.find((c) => c.id === 'c24')?.fasting).toBe(true)
  })
})
