import { describe, it, expect } from 'vitest'
import { is511, withStats, type Contraction } from '@/core/contractionTimer'

const MIN = 60_000

function series(n: number, everyMin: number, durationSec: number, startAt = 0): Contraction[] {
  return Array.from({ length: n }, (_, i) => {
    const start = startAt + i * everyMin * MIN
    return { start, end: start + durationSec * 1000 }
  })
}

describe('contractionTimer', () => {
  it('computes duration and interval from previous start', () => {
    const s = withStats(series(3, 6, 50))
    expect(s.map((c) => c.durationSec)).toEqual([50, 50, 50])
    expect(s.map((c) => c.intervalMin)).toEqual([null, 6, 6])
  })

  it('detects 5-1-1 after an hour of regular contractions', () => {
    expect(is511(series(13, 5, 70))).toBe(true)
  })

  it('needs a full hour', () => {
    expect(is511(series(12, 5, 70))).toBe(false)
  })

  it('needs each contraction to last at least a minute', () => {
    expect(is511(series(13, 5, 50))).toBe(false)
  })

  it('only counts the latest unbroken streak', () => {
    const early = series(6, 5, 70)
    const late = series(8, 5, 70, 25 * MIN + 10 * MIN)
    expect(is511([...early, ...late])).toBe(false)
  })

  it('ignores order of input', () => {
    expect(is511(series(13, 5, 70).reverse())).toBe(true)
  })
})
