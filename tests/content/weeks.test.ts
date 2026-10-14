import { describe, it, expect } from 'vitest'
import { WEEKS, getWeekInfo } from '@/content/weeks'
import { RED_FLAGS } from '@/content/redflags'
import { BIRTH_BAG } from '@/content/birthBag'

describe('WEEKS', () => {
  it('covers weeks 4 to 40 in order', () => {
    expect(WEEKS.map((w) => w.week)).toEqual(Array.from({ length: 37 }, (_, i) => i + 4))
  })
  it('has complete content for every week', () => {
    for (const w of WEEKS) {
      expect(w.fruit, `w${w.week}`).not.toBe('')
      expect(w.baby.length, `w${w.week}`).toBeGreaterThan(10)
      expect(w.mom.length, `w${w.week}`).toBeGreaterThan(10)
      expect(w.tips.length, `w${w.week}`).toBeGreaterThanOrEqual(2)
      expect(w.tips.length, `w${w.week}`).toBeLessThanOrEqual(3)
    }
  })
  it('grows monotonically from week 8', () => {
    const from8 = WEEKS.filter((w) => w.week >= 8)
    for (let i = 1; i < from8.length; i++) {
      expect(from8[i].lengthCm).toBeGreaterThanOrEqual(from8[i - 1].lengthCm)
      expect(from8[i].weightG).toBeGreaterThanOrEqual(from8[i - 1].weightG)
    }
  })
  it('clamps lookups to the covered range', () => {
    expect(getWeekInfo(2).week).toBe(4)
    expect(getWeekInfo(24).week).toBe(24)
    expect(getWeekInfo(41).week).toBe(40)
  })
})

describe('RED_FLAGS', () => {
  it('lists emergency items first', () => {
    const levels = RED_FLAGS.map((r) => r.level)
    expect(levels.indexOf('soon')).toBeGreaterThan(levels.lastIndexOf('emergency'))
  })
})

describe('BIRTH_BAG', () => {
  it('has unique ids', () => {
    expect(new Set(BIRTH_BAG.map((b) => b.id)).size).toBe(BIRTH_BAG.length)
  })
})
