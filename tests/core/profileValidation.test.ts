import { describe, it, expect } from 'vitest'
import { validateProfile, type ProfileFormInput } from '@/core/profileValidation'

const ok: ProfileFormInput = {
  dateMode: 'due', date: '2027-01-31', heightCm: 160, preWeightKg: 55,
  avoidTags: ['辣'], customAvoid: '香菜， 芹菜 ,', hospital: ' 市妇幼 ',
}

describe('validateProfile', () => {
  it('accepts a valid due date and normalizes fields', () => {
    const r = validateProfile(ok, '2026-10-14')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.dueDate).toBe('2027-01-31')
      expect(r.value.exclusions).toEqual({ tags: ['辣'], ingredients: ['香菜', '芹菜'] })
      expect(r.value.hospital).toBe('市妇幼')
    }
  })

  it('converts LMP to due date', () => {
    const r = validateProfile({ ...ok, dateMode: 'lmp', date: '2026-04-26' }, '2026-10-14')
    expect(r.ok && r.value.dueDate).toBe('2027-01-31')
  })

  it('rejects missing or implausible dates', () => {
    const missing = validateProfile({ ...ok, date: '' }, '2026-10-14')
    expect(!missing.ok && missing.errors.date).toBe('请选择日期')
    const far = validateProfile({ ...ok, date: '2028-01-01' }, '2026-10-14')
    expect(!far.ok && far.errors.date).toBe('日期看起来不对，请检查')
  })

  it('rejects out-of-range height and weight', () => {
    const r = validateProfile({ ...ok, heightCm: 90, preWeightKg: 200 }, '2026-10-14')
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.heightCm).toBeDefined()
      expect(r.errors.preWeightKg).toBeDefined()
    }
  })
})
