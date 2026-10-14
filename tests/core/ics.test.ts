import { describe, it, expect } from 'vitest'
import { toIcs } from '@/core/ics'
import { buildSchedule } from '@/core/checkupSchedule'

const NOW = new Date('2026-10-14T02:30:00Z')

describe('toIcs', () => {
  const schedule = buildSchedule('2027-01-31', [{ id: 'c06', done: true }, { id: 'c24', date: '2026-10-19' }])
  const ics = toIcs(schedule, { location: '市妇幼保健院', now: NOW })
  const unfolded = ics.replace(/\r\n /g, '')

  it('wraps events in a calendar with CRLF line endings', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('skips done checkups', () => {
    expect(unfolded).not.toContain('UID:c06@yunqi-xiaoban')
    expect((unfolded.match(/BEGIN:VEVENT/g) ?? []).length).toBe(schedule.length - 1)
  })

  it('writes all-day events with a reminder the day before', () => {
    expect(unfolded).toContain('UID:c24@yunqi-xiaoban')
    expect(unfolded).toContain('DTSTART;VALUE=DATE:20261019')
    expect(unfolded).toContain('DTEND;VALUE=DATE:20261020')
    expect(unfolded).toContain('DTSTAMP:20261014T023000Z')
    expect(unfolded).toContain('TRIGGER:-PT15H')
    expect(unfolded).toContain('LOCATION:市妇幼保健院')
  })

  it('escapes text and lists preparation notes', () => {
    expect(unfolded).toContain('SUMMARY:产检：糖耐量试验（OGTT）')
    expect(unfolded).toMatch(/DESCRIPTION:筛查妊娠期糖尿病\\n需空腹/)
  })

  it('folds lines to at most 75 bytes', () => {
    const enc = new TextEncoder()
    for (const line of ics.split('\r\n')) {
      expect(enc.encode(line).length).toBeLessThanOrEqual(75)
    }
  })
})
