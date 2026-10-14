import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDb, plain, type MealLog } from '@/db'
import { addDays, type DateStr } from '@/core/date'
import { getStatus } from '@/core/pregnancy'
import { planDay, swapDish, type PlanContext } from '@/core/mealPlanner'
import { useProfileStore } from './profile'
import type { PlanSlot } from '@/content/types'

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

  async function ensurePlans(dates: DateStr[]) {
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
    await persist({ ...log, plan, swaps, eaten: log.eaten.filter((s) => s !== slot) })
  }

  async function resetFrom(date: DateStr) {
    await getDb().mealLogs.where('date').aboveOrEqual(date).delete()
    for (const key of Object.keys(logs.value)) if (key >= date) delete logs.value[key]
  }

  return { logs, ensurePlans, toggleEaten, swap, resetFrom }
})
