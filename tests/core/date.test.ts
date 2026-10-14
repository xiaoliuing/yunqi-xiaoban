import { describe, it, expect } from 'vitest'
import { addDays, diffDays, parseDate, formatDate, todayStr, formatCn, weekdayCn, greeting } from '@/core/date'

describe('date', () => {
  it('parses and formats round trip', () => {
    expect(formatDate(parseDate('2026-10-14'))).toBe('2026-10-14')
  })
  it('rejects invalid strings', () => {
    expect(() => parseDate('2026/10/14')).toThrow()
  })
  it('adds days across months and leap years', () => {
    expect(addDays('2026-10-14', 109)).toBe('2027-01-31')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2027-01-31', -280)).toBe('2026-04-26')
  })
  it('diffs days', () => {
    expect(diffDays('2027-01-31', '2026-10-14')).toBe(109)
    expect(diffDays('2026-10-14', '2027-01-31')).toBe(-109)
  })
  it('uses local date for today', () => {
    expect(todayStr(new Date(2026, 9, 14, 23, 59))).toBe('2026-10-14')
  })
  it('formats Chinese dates', () => {
    expect(formatCn('2026-10-04')).toBe('10月4日')
    expect(weekdayCn('2026-10-14')).toBe('周三')
  })
  it('greets by hour', () => {
    expect(greeting(7)).toBe('早上好')
    expect(greeting(12)).toBe('中午好')
    expect(greeting(15)).toBe('下午好')
    expect(greeting(21)).toBe('晚上好')
  })
})
