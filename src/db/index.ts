import Dexie, { type Table } from 'dexie'
import type { DateStr } from '@/core/date'
import type { DayPlan } from '@/core/mealPlanner'
import type { CheckupOverride } from '@/core/checkupSchedule'
import type { AiDish, Exclusions, PlanSlot, SupplementId } from '@/content/types'

export interface AiSettings {
  baseUrl: string
  apiKey: string
  model: string
  /** 模型上下文窗口，单位 token。思考和回答都从这次输出里扣。 */
  contextTokens?: number
}

/** 单次输出上限。超过 524288 时接口会直接拒绝。 */
export const DEFAULT_CONTEXT_TOKENS = 524_288

export function contextTokensOf(settings: Pick<AiSettings, 'contextTokens'> | undefined): number {
  const value = settings?.contextTokens
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_CONTEXT_TOKENS
  const tokens = Math.floor(value)
  if (tokens < 1024) return DEFAULT_CONTEXT_TOKENS
  return Math.min(tokens, DEFAULT_CONTEXT_TOKENS)
}

export interface Profile {
  id: 'me'
  dueDate: DateStr
  heightCm: number
  preWeightKg: number
  exclusions: Exclusions
  hospital?: string
  supplementIds?: SupplementId[]
  ai?: AiSettings
  createdAt: number
}

export interface MealLog {
  date: DateStr
  plan: DayPlan
  eaten: PlanSlot[]
  swaps: number
  source?: 'system' | 'ai'
  dishes?: Partial<Record<PlanSlot, AiDish>>
}

export interface SupplementLog {
  key: string
  date: DateStr
  supplementId: SupplementId
}

export interface WeightEntry {
  date: DateStr
  kg: number
}

export interface KickSession {
  id?: number
  startedAt: number
  taps: number[]
  endedAt?: number
}

export interface ContractionRow {
  id?: number
  start: number
  end: number
}

export interface BagCheck {
  id: string
  checked: boolean
}

export class AppDB extends Dexie {
  profile!: Table<Profile, string>
  mealLogs!: Table<MealLog, string>
  supplementLogs!: Table<SupplementLog, string>
  weights!: Table<WeightEntry, string>
  kickSessions!: Table<KickSession, number>
  contractions!: Table<ContractionRow, number>
  checkupOverrides!: Table<CheckupOverride, string>
  bagChecklist!: Table<BagCheck, string>

  constructor(name = 'yunqi-xiaoban', options?: ConstructorParameters<typeof Dexie>[1]) {
    super(name, options)
    this.version(1).stores({
      profile: 'id',
      mealLogs: 'date',
      supplementLogs: 'key, date',
      weights: 'date',
      kickSessions: '++id, startedAt',
      contractions: '++id, start',
      checkupOverrides: 'id',
      bagChecklist: 'id',
    })
  }
}

let current = new AppDB()
let persistent = true

export function getDb(): AppDB {
  return current
}

export function isPersistent(): boolean {
  return persistent
}

export async function initDb(): Promise<{ persistent: boolean }> {
  try {
    await current.open()
    persistent = true
  } catch {
    const { indexedDB, IDBKeyRange } = await import('fake-indexeddb')
    current = new AppDB('yunqi-xiaoban-memory', { indexedDB, IDBKeyRange })
    await current.open()
    persistent = false
  }
  return { persistent }
}

export function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
