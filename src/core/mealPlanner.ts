import { hashString, mulberry32 } from './random'
import { RECIPES } from '@/content/recipes'
import { FOCUS_TAGS } from '@/content/nutrition'
import type { Exclusions, MealKind, PlanSlot, Recipe, Trimester } from '@/content/types'

export const PLAN_SLOTS: { key: PlanSlot; kind: MealKind; label: string; time: string }[] = [
  { key: 'breakfast', kind: 'breakfast', label: '早餐', time: '7:30' },
  { key: 'snackAm', kind: 'snack', label: '加餐', time: '10:00' },
  { key: 'lunch', kind: 'lunch', label: '午餐', time: '12:00' },
  { key: 'snackPm', kind: 'snack', label: '加餐', time: '15:30' },
  { key: 'dinner', kind: 'dinner', label: '晚餐', time: '18:30' },
]

export type DayPlan = Record<PlanSlot, string | null>

export interface PlanContext {
  trimester: Trimester
  exclusions: Exclusions
  recentIds: string[]
  seed: string
  recipes?: Recipe[]
}

export function isExcluded(recipe: Recipe, ex: Exclusions): boolean {
  if (recipe.avoidTags.some((t) => ex.tags.includes(t))) return true
  const words = ex.ingredients.map((w) => w.trim()).filter(Boolean)
  return words.some((w) => recipe.name.includes(w) || recipe.ingredients.some((i) => i.name.includes(w)))
}

function candidates(kind: MealKind, ctx: PlanContext, banned: Set<string>): Recipe[] {
  const base = (ctx.recipes ?? RECIPES).filter(
    (r) => r.kinds.includes(kind) && !banned.has(r.id) && !isExcluded(r, ctx.exclusions),
  )
  const recent = new Set(ctx.recentIds)
  const inTrimester = base.filter((r) => r.trimesters.includes(ctx.trimester))
  const tiers = [inTrimester.filter((r) => !recent.has(r.id)), inTrimester, base]
  return tiers.find((t) => t.length > 0) ?? []
}

function pick(list: Recipe[], rand: () => number, trimester: Trimester): Recipe | null {
  if (list.length === 0) return null
  const focus = FOCUS_TAGS[trimester]
  const weights = list.map((r) => 1 + 2 * r.tags.filter((t) => focus.includes(t)).length)
  let x = rand() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < list.length; i++) {
    x -= weights[i]
    if (x < 0) return list[i]
  }
  return list[list.length - 1]
}

export function planDay(ctx: PlanContext): DayPlan {
  const rand = mulberry32(hashString(ctx.seed))
  const used = new Set<string>()
  const plan = {} as DayPlan
  for (const slot of PLAN_SLOTS) {
    const chosen = pick(candidates(slot.kind, ctx, used), rand, ctx.trimester)
    plan[slot.key] = chosen?.id ?? null
    if (chosen) used.add(chosen.id)
  }
  return plan
}

export function swapDish(plan: DayPlan, slotKey: PlanSlot, ctx: PlanContext, attempt: number): DayPlan {
  const slot = PLAN_SLOTS.find((s) => s.key === slotKey)!
  const banned = new Set(Object.values(plan).filter((id): id is string => id !== null))
  const list = candidates(slot.kind, ctx, banned)
  if (list.length === 0) return plan
  const rand = mulberry32(hashString(`${ctx.seed}:${slotKey}:${attempt}`))
  return { ...plan, [slotKey]: pick(list, rand, ctx.trimester)!.id }
}
