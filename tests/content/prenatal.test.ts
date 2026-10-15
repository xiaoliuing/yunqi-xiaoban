import { describe, it, expect } from 'vitest'
import { PRENATAL_MYTHS, PRENATAL_STAGES, stageForWeek } from '@/content/prenatal'

describe('prenatal stages', () => {
  it('covers pregnancy without gaps', () => {
    expect(PRENATAL_STAGES[0].fromWeek).toBeLessThanOrEqual(4)
    expect(PRENATAL_STAGES[PRENATAL_STAGES.length - 1].toWeek).toBeGreaterThanOrEqual(40)
    for (let i = 1; i < PRENATAL_STAGES.length; i++) {
      expect(PRENATAL_STAGES[i].fromWeek).toBe(PRENATAL_STAGES[i - 1].toWeek + 1)
    }
  })

  it('does not prescribe sound lessons before hearing starts', () => {
    const early = stageForWeek(12)
    expect(early.summary).toContain('不用放音乐')
    expect(early.practices.some((p) => p.detail.includes('贴腹'))).toBe(false)
  })

  it('uses repetition and normal volume once hearing is established', () => {
    const late = stageForWeek(28)
    const text = late.practices.map((p) => `${p.title}${p.detail}`).join('')
    expect(text).toContain('10 分钟')
    expect(late.basis).toContain('DeCasper')
  })

  it('rejects iq claims and belly speakers', () => {
    const facts = PRENATAL_MYTHS.map((m) => m.fact).join('')
    expect(facts).toContain('不能推论到胎儿')
    expect(facts).toContain('贴着腹壁')
  })
})