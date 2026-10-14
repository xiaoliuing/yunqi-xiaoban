import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '@/stores/profile'
import { useMealsStore } from '@/stores/meals'
import { getDb } from '@/db'

beforeEach(async () => {
  setActivePinia(createPinia())
  const profile = useProfileStore()
  await profile.load()
  await getDb().mealLogs.clear()
  await profile.saveBasics({
    dueDate: '2027-01-31', heightCm: 160, preWeightKg: 55, exclusions: { tags: ['辣'], ingredients: [] },
  })
})

describe('meals store', () => {
  it('generates, persists and reuses a day plan', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-14'])
    const first = meals.logs['2026-10-14'].plan
    expect(Object.values(first).every((id) => id !== null)).toBe(true)
    expect((await getDb().mealLogs.get('2026-10-14'))?.plan).toEqual(first)

    setActivePinia(createPinia())
    await useProfileStore().load()
    const again = useMealsStore()
    await again.ensurePlans(['2026-10-14'])
    expect(again.logs['2026-10-14'].plan).toEqual(first)
  })

  it('swaps a slot and clears its eaten mark', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-14'])
    await meals.toggleEaten('2026-10-14', 'lunch')
    const before = meals.logs['2026-10-14'].plan.lunch
    await meals.swap('2026-10-14', 'lunch')
    expect(meals.logs['2026-10-14'].plan.lunch).not.toBe(before)
    expect(meals.logs['2026-10-14'].eaten).not.toContain('lunch')
  })
})
