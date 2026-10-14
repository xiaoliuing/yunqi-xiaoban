import { addDays, type DateStr } from './date'
import { lmpFromDue } from './pregnancy'
import { CHECKUPS } from '@/content/checkups'
import type { CheckupItem } from '@/content/types'

export interface CheckupOverride {
  id: string
  date?: DateStr
  done?: boolean
}

export interface ScheduledCheckup extends CheckupItem {
  suggestedDate: DateStr
  date: DateStr
  done: boolean
}

export function buildSchedule(
  due: DateStr,
  overrides: CheckupOverride[],
  items: CheckupItem[] = CHECKUPS,
): ScheduledCheckup[] {
  const lmp = lmpFromDue(due)
  const byId = new Map(overrides.map((o) => [o.id, o]))
  return items
    .map((item) => {
      const o = byId.get(item.id)
      const suggestedDate = addDays(lmp, item.startWeek * 7)
      return { ...item, suggestedDate, date: o?.date ?? suggestedDate, done: o?.done ?? false }
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function nextCheckup(schedule: ScheduledCheckup[], today: DateStr): ScheduledCheckup | null {
  return schedule.find((c) => !c.done && c.date >= today) ?? null
}
