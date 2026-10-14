import { describe, it, expect } from 'vitest'
import { dueFromLmp, lmpFromDue, getStatus, trimesterOf } from '@/core/pregnancy'
import { addDays } from '@/core/date'

const DUE = '2027-01-31'

describe('pregnancy', () => {
  it('converts between LMP and due date', () => {
    expect(dueFromLmp('2026-04-26')).toBe(DUE)
    expect(lmpFromDue(DUE)).toBe('2026-04-26')
  })

  it('computes week, day and countdown', () => {
    const s = getStatus(DUE, '2026-10-14')
    expect(s).toMatchObject({ week: 24, day: 3, trimester: 2, daysToDue: 109, inRange: true })
    expect(s.progress).toBeCloseTo(171 / 280)
  })

  it('splits trimesters at 14+0 and 28+0', () => {
    expect(getStatus(DUE, addDays(DUE, -(280 - 97))).trimester).toBe(1)
    expect(getStatus(DUE, addDays(DUE, -(280 - 98))).trimester).toBe(2)
    expect(getStatus(DUE, addDays(DUE, -(280 - 195))).trimester).toBe(2)
    expect(getStatus(DUE, addDays(DUE, -(280 - 196))).trimester).toBe(3)
  })

  it('flags out-of-range weeks', () => {
    expect(getStatus(DUE, addDays(DUE, -(280 - 20))).inRange).toBe(false)
    expect(getStatus(DUE, addDays(DUE, 14)).inRange).toBe(true)
    expect(getStatus(DUE, addDays(DUE, 21)).inRange).toBe(false)
  })

  it('clamps progress to 0..1', () => {
    expect(getStatus(DUE, addDays(DUE, 30)).progress).toBe(1)
    expect(getStatus(DUE, addDays(DUE, -300)).progress).toBe(0)
  })

  it('maps weeks to trimester', () => {
    expect(trimesterOf(0)).toBe(1)
    expect(trimesterOf(40)).toBe(3)
  })
})
