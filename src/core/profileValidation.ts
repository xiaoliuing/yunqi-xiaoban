import { dueFromLmp, getStatus } from './pregnancy'
import type { DateStr } from './date'
import type { Exclusions } from '@/content/types'

export interface ProfileFormInput {
  dateMode: 'due' | 'lmp'
  date: DateStr
  heightCm: number
  preWeightKg: number
  avoidTags: string[]
  customAvoid: string
  hospital: string
}

export interface ProfileValues {
  dueDate: DateStr
  heightCm: number
  preWeightKg: number
  exclusions: Exclusions
  hospital?: string
}

export type ProfileErrors = Partial<Record<'date' | 'heightCm' | 'preWeightKg', string>>

export type ValidationResult = { ok: true; value: ProfileValues } | { ok: false; errors: ProfileErrors }

export function validateProfile(input: ProfileFormInput, today: DateStr): ValidationResult {
  const errors: ProfileErrors = {}
  let dueDate = ''
  if (!input.date) {
    errors.date = '请选择日期'
  } else {
    dueDate = input.dateMode === 'lmp' ? dueFromLmp(input.date) : input.date
    const { week } = getStatus(dueDate, today)
    if (week < 0 || week > 42) errors.date = '日期看起来不对，请检查'
  }
  if (!(input.heightCm >= 120 && input.heightCm <= 200)) errors.heightCm = '身高请填 120–200 厘米'
  if (!(input.preWeightKg >= 30 && input.preWeightKg <= 150)) errors.preWeightKg = '体重请填 30–150 公斤'
  if (Object.keys(errors).length) return { ok: false, errors }

  const ingredients = input.customAvoid.split(/[,，、\s]+/).map((s) => s.trim()).filter(Boolean)
  const hospital = input.hospital.trim()
  return {
    ok: true,
    value: {
      dueDate,
      heightCm: input.heightCm,
      preWeightKg: input.preWeightKg,
      exclusions: { tags: [...input.avoidTags], ingredients },
      ...(hospital ? { hospital } : {}),
    },
  }
}
