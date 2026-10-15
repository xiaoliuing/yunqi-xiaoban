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

  it('stores an AI menu and can restore the system plan', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-14'])
    const system = { ...meals.logs['2026-10-14'].plan }
    const dish = {
      name: '番茄面',
      tip: '面条煮熟',
      tags: ['蛋白质' as const],
      ingredients: [{ name: '面条', amount: '80g', category: '主食' as const }],
      steps: ['煮熟'],
    }
    await meals.applyAi('2026-10-14', { breakfast: dish, snackAm: dish, lunch: dish, snackPm: dish, dinner: dish })
    expect(meals.logs['2026-10-14'].source).toBe('ai')
    expect(meals.logs['2026-10-14'].dishes?.lunch?.name).toBe('番茄面')

    await meals.restoreSystem('2026-10-14')
    expect(meals.logs['2026-10-14'].dishes).toBeUndefined()
    expect(meals.logs['2026-10-14'].plan).toEqual(system)
  })

  it('saves a picture only while the day is still an AI menu', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-14'])
    const dish = {
      name: '番茄面',
      tip: '面条煮熟',
      tags: ['蛋白质' as const],
      ingredients: [{ name: '面条', amount: '80g', category: '主食' as const }],
      steps: ['煮熟'],
      imagePrompt: 'one white bowl of noodles',
    }
    await meals.applyAi('2026-10-14', { breakfast: dish, snackAm: dish, lunch: dish, snackPm: dish, dinner: dish })
    await meals.setDishImage('2026-10-14', 'lunch', 'data:image/jpeg;base64,aa')
    expect(meals.logs['2026-10-14'].dishes?.lunch?.image).toBe('data:image/jpeg;base64,aa')
    await meals.restoreSystem('2026-10-14')
    await meals.setDishImage('2026-10-14', 'lunch', 'data:image/jpeg;base64,bb')
    expect(meals.logs['2026-10-14'].dishes).toBeUndefined()
  })

  it('drops AI pictures once the day is over and keeps the menu', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-13', '2026-10-14'])
    const dish = {
      name: '番茄面',
      tip: '面条煮熟',
      tags: ['蛋白质' as const],
      ingredients: [{ name: '面条', amount: '80g', category: '主食' as const }],
      steps: ['煮熟'],
    }
    const slots = { breakfast: dish, snackAm: dish, lunch: dish, snackPm: dish, dinner: dish }
    await meals.applyAi('2026-10-13', slots)
    await meals.applyAi('2026-10-14', slots)
    await meals.setDishImage('2026-10-13', 'lunch', 'data:image/jpeg;base64,yesterday')
    await meals.setDishImage('2026-10-14', 'lunch', 'data:image/jpeg;base64,today')

    await meals.ensurePlans(['2026-10-14'])

    expect(meals.logs['2026-10-13'].dishes?.lunch?.image).toBeUndefined()
    expect(meals.logs['2026-10-13'].dishes?.lunch?.name).toBe('番茄面')
    expect(meals.logs['2026-10-14'].dishes?.lunch?.image).toBe('data:image/jpeg;base64,today')
    expect((await getDb().mealLogs.get('2026-10-13'))?.dishes?.lunch?.image).toBeUndefined()
  })
})
