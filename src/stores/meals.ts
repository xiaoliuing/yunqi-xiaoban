import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDb, plain, type MealLog } from '@/db'
import { addDays, type DateStr } from '@/core/date'
import { getStatus } from '@/core/pregnancy'
import { planDay, swapDish, type PlanContext } from '@/core/mealPlanner'
import { useProfileStore } from './profile'
import type { AiDish, PlanSlot } from '@/content/types'

export const useMealsStore = defineStore('meals', () => {
  const logs = ref<Record<DateStr, MealLog>>({})

  async function readLog(date: DateStr): Promise<MealLog | undefined> {
    return logs.value[date] ?? (await getDb().mealLogs.get(date))
  }

  async function recentIdsBefore(date: DateStr): Promise<string[]> {
    const ids: string[] = []
    for (let i = 1; i <= 7; i++) {
      const log = await readLog(addDays(date, -i))
      if (log) ids.push(...Object.values(log.plan).filter((id): id is string => id !== null))
    }
    return ids
  }

  async function contextFor(date: DateStr): Promise<PlanContext> {
    const profile = useProfileStore().profile!
    return {
      trimester: getStatus(profile.dueDate, date).trimester,
      exclusions: profile.exclusions,
      recentIds: await recentIdsBefore(date),
      seed: date,
    }
  }

  async function persist(log: MealLog) {
    await getDb().mealLogs.put(plain(log))
    logs.value[log.date] = log
  }

  /** 过了当天的 AI 配图删掉，菜单文字留下。打开应用或跨过零点时会走到这里。 */
  async function dropPastImages(today: DateStr) {
    const old = await getDb().mealLogs.where('date').below(today).toArray()
    for (const log of old) {
      if (!log.dishes) continue
      let changed = false
      const dishes = { ...log.dishes }
      for (const slot of Object.keys(dishes) as PlanSlot[]) {
        const dish = dishes[slot]
        if (!dish?.image) continue
        changed = true
        const next = { ...dish }
        delete next.image
        dishes[slot] = next
      }
      if (changed) await persist({ ...log, dishes })
    }
  }

  async function ensurePlans(dates: DateStr[]) {
    const earliest = [...dates].sort()[0]
    if (earliest) await dropPastImages(earliest)
    for (const date of [...dates].sort()) {
      if (logs.value[date]) continue
      const stored = await getDb().mealLogs.get(date)
      if (stored) {
        logs.value[date] = stored
        continue
      }
      await persist({ date, plan: planDay(await contextFor(date)), eaten: [], swaps: 0 })
    }
  }

  async function toggleEaten(date: DateStr, slot: PlanSlot) {
    const log = logs.value[date]
    if (!log) return
    const eaten = log.eaten.includes(slot) ? log.eaten.filter((s) => s !== slot) : [...log.eaten, slot]
    await persist({ ...log, eaten })
  }

  async function swap(date: DateStr, slot: PlanSlot) {
    const log = logs.value[date]
    if (!log) return
    const swaps = log.swaps + 1
    const plan = swapDish(log.plan, slot, await contextFor(date), swaps)
    const dishes = { ...(log.dishes ?? {}) }
    if (plan[slot] !== log.plan[slot]) delete dishes[slot]
    const next: MealLog = { date, plan, swaps, eaten: log.eaten.filter((s) => s !== slot) }
    if (Object.keys(dishes).length) {
      next.source = 'ai'
      next.dishes = dishes
    }
    await persist(next)
  }

  async function applyAi(date: DateStr, dishes: Record<PlanSlot, AiDish>) {
    const log = logs.value[date]
    await persist({
      date,
      plan: { breakfast: null, snackAm: null, lunch: null, snackPm: null, dinner: null },
      eaten: [],
      swaps: log?.swaps ?? 0,
      source: 'ai',
      dishes,
    })
  }

  async function setDishImage(date: DateStr, slot: PlanSlot, image: string) {
    const log = logs.value[date]
    const dish = log?.dishes?.[slot]
    if (!log || log.source !== 'ai' || !dish) return
    await persist({ ...log, dishes: { ...log.dishes, [slot]: { ...dish, image } } })
  }

  async function restoreSystem(date: DateStr) {
    if (!logs.value[date]) return
    await persist({ date, plan: planDay(await contextFor(date)), eaten: [], swaps: 0 })
  }

  async function resetFrom(date: DateStr) {
    await getDb().mealLogs.where('date').aboveOrEqual(date).delete()
    for (const key of Object.keys(logs.value)) if (key >= date) delete logs.value[key]
  }

  return { logs, ensurePlans, toggleEaten, swap, applyAi, setDishImage, restoreSystem, resetFrom }
})
