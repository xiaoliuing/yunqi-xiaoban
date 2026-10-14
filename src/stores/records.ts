import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDb, plain, type WeightEntry } from '@/db'
import type { DateStr } from '@/core/date'
import type { CheckupOverride } from '@/core/checkupSchedule'
import type { SupplementId } from '@/content/types'

export const useRecordsStore = defineStore('records', () => {
  const supplementsTaken = ref<Record<DateStr, SupplementId[]>>({})
  const weights = ref<WeightEntry[]>([])
  const checkupOverrides = ref<CheckupOverride[]>([])
  const bag = ref<Record<string, boolean>>({})

  async function loadSupplements(date: DateStr) {
    const rows = await getDb().supplementLogs.where('date').equals(date).toArray()
    supplementsTaken.value[date] = rows.map((r) => r.supplementId)
  }

  async function toggleSupplement(date: DateStr, id: SupplementId) {
    const key = `${date}|${id}`
    const taken = supplementsTaken.value[date] ?? []
    if (taken.includes(id)) {
      await getDb().supplementLogs.delete(key)
      supplementsTaken.value[date] = taken.filter((x) => x !== id)
    } else {
      await getDb().supplementLogs.put({ key, date, supplementId: id })
      supplementsTaken.value[date] = [...taken, id]
    }
  }

  async function loadWeights() {
    weights.value = await getDb().weights.orderBy('date').toArray()
  }

  async function saveWeight(date: DateStr, kg: number) {
    await getDb().weights.put({ date, kg })
    await loadWeights()
  }

  async function deleteWeight(date: DateStr) {
    await getDb().weights.delete(date)
    await loadWeights()
  }

  async function loadCheckups() {
    checkupOverrides.value = await getDb().checkupOverrides.toArray()
  }

  async function updateCheckup(id: string, patch: Omit<CheckupOverride, 'id'>) {
    const current = checkupOverrides.value.find((o) => o.id === id) ?? { id }
    const next = { ...current, ...patch }
    await getDb().checkupOverrides.put(plain(next))
    await loadCheckups()
  }

  async function loadBag() {
    const rows = await getDb().bagChecklist.toArray()
    bag.value = Object.fromEntries(rows.map((r) => [r.id, r.checked]))
  }

  async function toggleBag(id: string) {
    const checked = !bag.value[id]
    await getDb().bagChecklist.put({ id, checked })
    bag.value = { ...bag.value, [id]: checked }
  }

  return {
    supplementsTaken, weights, checkupOverrides, bag,
    loadSupplements, toggleSupplement, loadWeights, saveWeight, deleteWeight,
    loadCheckups, updateCheckup, loadBag, toggleBag,
  }
})
