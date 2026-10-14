import { addDays, diffDays, type DateStr } from './date'
import type { Trimester } from '@/content/types'

export const TERM_DAYS = 280

export interface PregnancyStatus {
  gestationDays: number
  week: number
  day: number
  trimester: Trimester
  daysToDue: number
  progress: number
  inRange: boolean
}

export function dueFromLmp(lmp: DateStr): DateStr {
  return addDays(lmp, TERM_DAYS)
}

export function lmpFromDue(due: DateStr): DateStr {
  return addDays(due, -TERM_DAYS)
}

export function trimesterOf(week: number): Trimester {
  if (week < 14) return 1
  if (week < 28) return 2
  return 3
}

export function getStatus(due: DateStr, today: DateStr): PregnancyStatus {
  const daysToDue = diffDays(due, today)
  const gestationDays = TERM_DAYS - daysToDue
  const week = Math.floor(gestationDays / 7)
  const day = gestationDays - week * 7
  return {
    gestationDays,
    week,
    day,
    trimester: trimesterOf(Math.max(week, 0)),
    daysToDue,
    progress: Math.min(Math.max(gestationDays / TERM_DAYS, 0), 1),
    inRange: week >= 4 && week <= 42,
  }
}
