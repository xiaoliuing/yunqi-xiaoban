import { describe, it, expect } from 'vitest'
import { FOODS } from '@/content/foods'

describe('FOODS', () => {
  it('has around 150 entries', () => {
    expect(FOODS.length).toBeGreaterThanOrEqual(140)
  })
  it('has no duplicate names or aliases', () => {
    const all = FOODS.flatMap((f) => [f.name, ...f.aliases.filter((a) => a !== f.name)])
    const dupes = all.filter((n, i) => all.indexOf(n) !== i)
    expect(dupes).toEqual([])
  })
  it('explains every entry', () => {
    for (const f of FOODS) {
      expect(f.reason.length, f.name).toBeGreaterThan(4)
      expect(f.advice.length, f.name).toBeGreaterThan(2)
    }
  })
  it('marks known hazards as avoid', () => {
    for (const name of ['酒', '生鱼片', '溏心蛋', '生牛奶', '鲜黄花菜']) {
      expect(FOODS.find((f) => f.name === name)?.level, name).toBe('avoid')
    }
  })
})
