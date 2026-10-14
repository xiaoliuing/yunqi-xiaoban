import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import OnboardingView from '@/views/OnboardingView.vue'
import { getDb } from '@/db'
import { useProfileStore } from '@/stores/profile'
import { useClock } from '@/composables/useClock'

beforeEach(async () => {
  setActivePinia(createPinia())
  await useProfileStore().load()
  await getDb().profile.clear()
  useClock().today.value = '2026-10-14'
})

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/onboarding', component: OnboardingView },
      { path: '/', component: { template: '<div>home</div>' } },
    ],
  })
}

describe('OnboardingView', () => {
  it('shows errors for empty form', async () => {
    const router = makeRouter()
    await router.push('/onboarding')
    const w = mount(OnboardingView, { global: { plugins: [router] } })
    await w.find('form').trigger('submit')
    expect(w.text()).toContain('请选择日期')
    expect(w.text()).toContain('身高请填')
  })

  it('saves the profile and goes home', async () => {
    const router = makeRouter()
    await router.push('/onboarding')
    const w = mount(OnboardingView, { global: { plugins: [router] } })
    await w.find('input[name=date]').setValue('2027-01-31')
    await w.find('input[name=height]').setValue('160')
    await w.find('input[name=weight]').setValue('55')
    await w.findAll('button.chip').find((b) => b.text() === '不吃辣')!.trigger('click')
    await w.find('form').trigger('submit')
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/'))
    const saved = await getDb().profile.get('me')
    expect(saved?.dueDate).toBe('2027-01-31')
    expect(saved?.exclusions.tags).toEqual(['辣'])
  })
})
