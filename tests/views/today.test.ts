import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import TodayView from '@/views/TodayView.vue'
import { getDb } from '@/db'
import { useProfileStore } from '@/stores/profile'
import { useClock } from '@/composables/useClock'

beforeEach(async () => {
  setActivePinia(createPinia())
  const profile = useProfileStore()
  await profile.load()
  await getDb().mealLogs.clear()
  await getDb().checkupOverrides.clear()
  await profile.saveBasics({ dueDate: '2027-01-31', heightCm: 160, preWeightKg: 55, exclusions: { tags: [], ingredients: [] } })
  useClock().today.value = '2026-10-14'
})

async function mountToday() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:p(.*)*', component: TodayView }] })
  await router.push('/')
  const w = mount(TodayView, { global: { plugins: [router] } })
  await vi.waitFor(() => expect(w.findAll('.meal')).toHaveLength(5))
  return w
}

describe('TodayView', () => {
  it('shows week, countdown, meals and next checkup', async () => {
    const w = await mountToday()
    expect(w.find('.week-num').text()).toContain('24')
    expect(w.text()).toContain('109')
    await vi.waitFor(() => expect(w.text()).toContain('孕 28 周产检'))
  })

  it('swaps a meal', async () => {
    const w = await mountToday()
    const before = w.find('[data-slot=lunch] .name').text()
    await w.find('[data-slot=lunch] .swap').trigger('click')
    await vi.waitFor(() => expect(w.find('[data-slot=lunch] .name').text()).not.toBe(before), { timeout: 2000 })
  })
})
