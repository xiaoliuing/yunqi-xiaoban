import { describe, it, expect } from 'vitest'
import { countKicks, assessKickSession, KICK_WINDOW_MS } from '@/core/kickCounter'

const MIN = 60_000

describe('kickCounter', () => {
  it('merges taps within 5 minutes into one movement', () => {
    expect(countKicks([0, 1 * MIN, 4 * MIN])).toBe(1)
    expect(countKicks([0, 5 * MIN, 6 * MIN, 11 * MIN])).toBe(3)
    expect(countKicks([])).toBe(0)
  })

  it('is done after 10 movements', () => {
    const taps = Array.from({ length: 10 }, (_, i) => i * 6 * MIN)
    expect(assessKickSession(0, taps, 61 * MIN).state).toBe('done')
  })

  it('is low when fewer than 10 movements after 2 hours', () => {
    const taps = Array.from({ length: 9 }, (_, i) => i * 6 * MIN)
    const r = assessKickSession(0, taps, KICK_WINDOW_MS)
    expect(r).toMatchObject({ count: 9, state: 'low', remainingMs: 0 })
  })

  it('is counting within the window', () => {
    expect(assessKickSession(0, [0], 30 * MIN)).toMatchObject({ count: 1, state: 'counting', remainingMs: 90 * MIN })
  })
})
