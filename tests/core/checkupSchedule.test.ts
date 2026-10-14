import { describe, it, expect } from 'vitest'
import { buildSchedule, nextCheckup } from '@/core/checkupSchedule'

const DUE = '2027-01-31'

describe('checkupSchedule', () => {
  it('suggests the start of each week range', () => {
    const s = buildSchedule(DUE, [])
    const ogtt = s.find((c) => c.id === 'c24')!
    expect(ogtt.suggestedDate).toBe('2026-10-11')
    expect(ogtt.date).toBe('2026-10-11')
    expect(ogtt.done).toBe(false)
  })

  it('applies overrides and re-sorts by date', () => {
    const s = buildSchedule(DUE, [{ id: 'c24', date: '2026-10-19' }, { id: 'c20', done: true }])
    expect(s.find((c) => c.id === 'c24')!.date).toBe('2026-10-19')
    expect(s.find((c) => c.id === 'c20')!.done).toBe(true)
    const dates = s.map((c) => c.date)
    expect([...dates].sort()).toEqual(dates)
  })

  it('finds the next undone checkup on or after today', () => {
    const s = buildSchedule(DUE, [{ id: 'c24', date: '2026-10-19' }])
    expect(nextCheckup(s, '2026-10-14')?.id).toBe('c24')
    expect(nextCheckup(s, '2026-10-19')?.id).toBe('c24')
    const done = buildSchedule(DUE, [{ id: 'c24', date: '2026-10-19', done: true }])
    expect(nextCheckup(done, '2026-10-14')?.id).toBe('c28')
  })

  it('returns null when everything is past', () => {
    expect(nextCheckup(buildSchedule(DUE, []), '2027-03-01')).toBeNull()
  })
})
