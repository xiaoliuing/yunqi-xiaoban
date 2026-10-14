import { describe, it, expect } from 'vitest'
import { planDay, swapDish, isExcluded, PLAN_SLOTS, type PlanContext } from '@/core/mealPlanner'
import { hashString, mulberry32 } from '@/core/random'
import { RECIPES } from '@/content/recipes'
import { AVOID_OPTIONS } from '@/content/nutrition'
import type { Recipe, MealKind, Trimester } from '@/content/types'

function r(id: string, kinds: MealKind[], opts: Partial<Recipe> = {}): Recipe {
  return {
    id, name: id, tip: 't', kinds, trimesters: [1, 2, 3] as Trimester[], tags: ['蛋白质'],
    avoidTags: [], ingredients: [{ name: '大米', amount: '1', category: '主食' }], steps: ['s'], ...opts,
  }
}

const library: Recipe[] = [
  r('b1', ['breakfast']), r('b2', ['breakfast']), r('b3', ['breakfast'], { avoidTags: ['蛋'] }),
  r('s1', ['snack']), r('s2', ['snack']), r('s3', ['snack']),
  r('m1', ['lunch', 'dinner'], { avoidTags: ['辣'] }), r('m2', ['lunch', 'dinner']), r('m3', ['lunch', 'dinner']),
  r('m4', ['lunch', 'dinner'], { trimesters: [1], tags: ['补铁'] }),
  r('m5', ['lunch', 'dinner'], { ingredients: [{ name: '香菜', amount: '1', category: '蔬菜' }] }),
]

const ctx = (over: Partial<PlanContext> = {}): PlanContext => ({
  trimester: 2, exclusions: { tags: [], ingredients: [] }, recentIds: [], seed: '2026-10-14', recipes: library, ...over,
})

describe('random', () => {
  it('is deterministic per seed', () => {
    const a = mulberry32(hashString('x'))
    const b = mulberry32(hashString('x'))
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
    expect(mulberry32(hashString('y'))()).not.toBe(mulberry32(hashString('x'))())
  })
})

describe('mealPlanner', () => {
  it('fills all five slots with matching kinds and no duplicates', () => {
    const plan = planDay(ctx())
    expect(Object.keys(plan).sort()).toEqual(PLAN_SLOTS.map((s) => s.key).sort())
    expect(plan.breakfast).toMatch(/^b/)
    expect(plan.snackAm).toMatch(/^s/)
    expect(plan.snackPm).toMatch(/^s/)
    expect(plan.lunch).toMatch(/^m/)
    expect(plan.dinner).toMatch(/^m/)
    const ids = Object.values(plan)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('is deterministic for the same seed', () => {
    expect(planDay(ctx())).toEqual(planDay(ctx()))
  })

  it('never picks excluded recipes, even when options run out', () => {
    for (let i = 0; i < 30; i++) {
      const plan = planDay(ctx({ seed: `d${i}`, exclusions: { tags: ['辣', '蛋'], ingredients: ['香菜'] } }))
      expect(Object.values(plan)).not.toContain('m1')
      expect(Object.values(plan)).not.toContain('b3')
      expect(Object.values(plan)).not.toContain('m5')
    }
  })

  it('prefers recipes for the current trimester', () => {
    for (let i = 0; i < 30; i++) {
      const plan = planDay(ctx({ seed: `d${i}` }))
      expect([plan.lunch, plan.dinner]).not.toContain('m4')
    }
  })

  it('avoids recently used recipes when possible', () => {
    for (let i = 0; i < 30; i++) {
      const plan = planDay(ctx({ seed: `d${i}`, recentIds: ['b1'] }))
      expect(plan.breakfast).not.toBe('b1')
    }
  })

  it('falls back to recent recipes rather than leaving a slot empty', () => {
    const plan = planDay(ctx({ recentIds: ['b1', 'b2', 'b3'] }))
    expect(plan.breakfast).not.toBeNull()
  })

  it('returns null when nothing is allowed', () => {
    const plan = planDay(ctx({ recipes: library.filter((x) => !x.kinds.includes('breakfast')) }))
    expect(plan.breakfast).toBeNull()
  })

  it('swaps one slot to a different recipe and keeps the rest', () => {
    const plan = planDay(ctx())
    for (let attempt = 1; attempt <= 10; attempt++) {
      const next = swapDish(plan, 'lunch', ctx(), attempt)
      expect(next.lunch).not.toBe(plan.lunch)
      expect(next.lunch).not.toBe(plan.dinner)
      expect({ ...next, lunch: plan.lunch }).toEqual(plan)
    }
  })

  it('keeps the plan when no alternative exists', () => {
    const only = [r('b1', ['breakfast']), r('s1', ['snack']), r('s2', ['snack']), r('m1', ['lunch', 'dinner']), r('m2', ['lunch', 'dinner'])]
    const c = ctx({ recipes: only })
    const plan = planDay(c)
    expect(swapDish(plan, 'breakfast', c, 1)).toEqual(plan)
  })

  it('detects exclusions by tag or ingredient', () => {
    expect(isExcluded(library[6], { tags: ['辣'], ingredients: [] })).toBe(true)
    expect(isExcluded(library[10], { tags: [], ingredients: ['香菜'] })).toBe(true)
    expect(isExcluded(library[0], { tags: [], ingredients: [''] })).toBe(false)
  })
})

describe('mealPlanner with real library', () => {
  it('fills every slot for each trimester even with all avoid tags except 荤', () => {
    const tags = AVOID_OPTIONS.map((o) => o.tag).filter((t) => t !== '荤' && t !== '蛋' && t !== '奶')
    for (const trimester of [1, 2, 3] as const) {
      const plan = planDay({ trimester, exclusions: { tags, ingredients: [] }, recentIds: [], seed: 'x', recipes: RECIPES })
      expect(Object.values(plan).every((id) => id !== null), `trimester ${trimester}`).toBe(true)
    }
  })

  it('fills every slot for vegetarians', () => {
    for (const trimester of [1, 2, 3] as const) {
      const plan = planDay({ trimester, exclusions: { tags: ['荤'], ingredients: [] }, recentIds: [], seed: 'v', recipes: RECIPES })
      expect(Object.values(plan).every((id) => id !== null), `trimester ${trimester}`).toBe(true)
    }
  })
})
