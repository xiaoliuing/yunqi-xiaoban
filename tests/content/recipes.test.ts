import { describe, it, expect } from 'vitest'
import { RECIPES, getRecipe } from '@/content/recipes'
import { FOODS } from '@/content/foods'
import { AVOID_OPTIONS } from '@/content/nutrition'
import type { MealKind, Trimester } from '@/content/types'

const avoidNames = new Set(FOODS.filter((f) => f.level === 'avoid').flatMap((f) => [f.name, ...f.aliases]))
const validTags = new Set(AVOID_OPTIONS.map((o) => o.tag))

describe('RECIPES', () => {
  it('has about 100 meals with unique ids', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(90)
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length)
  })

  it('has at least 8 options per trimester and meal kind', () => {
    const kinds: MealKind[] = ['breakfast', 'lunch', 'dinner', 'snack']
    const trimesters: Trimester[] = [1, 2, 3]
    for (const t of trimesters) {
      for (const k of kinds) {
        const n = RECIPES.filter((r) => r.trimesters.includes(t) && r.kinds.includes(k)).length
        expect(n, `trimester ${t} ${k}`).toBeGreaterThanOrEqual(8)
      }
    }
  })

  it('never uses avoid-level foods', () => {
    for (const r of RECIPES) {
      for (const i of r.ingredients) expect(avoidNames.has(i.name), `${r.id} ${i.name}`).toBe(false)
    }
  })

  it('only uses known avoid tags and tags meat/seafood consistently', () => {
    for (const r of RECIPES) {
      for (const t of r.avoidTags) expect(validTags.has(t), `${r.id} ${t}`).toBe(true)
      const cats = r.ingredients.map((i) => i.category)
      if (cats.includes('肉禽') || cats.includes('水产')) expect(r.avoidTags, r.id).toContain('荤')
      if (cats.includes('水产')) expect(r.avoidTags, r.id).toContain('海鲜')
    }
  })

  it('has complete content', () => {
    for (const r of RECIPES) {
      expect(r.tip, r.id).not.toBe('')
      expect(r.ingredients.length, r.id).toBeGreaterThan(0)
      expect(r.steps.length, r.id).toBeGreaterThan(0)
      expect(r.tags.length, r.id).toBeGreaterThan(0)
    }
  })

  it('looks up by id', () => {
    expect(getRecipe(RECIPES[0].id)).toBe(RECIPES[0])
    expect(getRecipe('nope')).toBeUndefined()
  })
})
