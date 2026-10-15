import { createRouter, createWebHistory } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/onboarding', component: () => import('@/views/OnboardingView.vue'), meta: { hideTabs: true } },
    { path: '/', component: () => import('@/views/TodayView.vue') },
    { path: '/eat', component: () => import('@/views/EatView.vue') },
    { path: '/eat/week', component: () => import('@/views/WeekPlanView.vue') },
    { path: '/eat/shopping', component: () => import('@/views/ShoppingView.vue') },
    { path: '/eat/ai', component: () => import('@/views/AskAiView.vue') },
    { path: '/pregnancy', component: () => import('@/views/PregnancyView.vue') },
    { path: '/pregnancy/checkups', component: () => import('@/views/CheckupsView.vue') },
    { path: '/pregnancy/prenatal', component: () => import('@/views/PrenatalView.vue') },
    { path: '/pregnancy/redflags', component: () => import('@/views/RedFlagsView.vue') },
    { path: '/me', component: () => import('@/views/MeView.vue') },
    { path: '/me/weight', component: () => import('@/views/WeightView.vue') },
    { path: '/me/kicks', component: () => import('@/views/KicksView.vue') },
    { path: '/me/contractions', component: () => import('@/views/ContractionsView.vue') },
    { path: '/me/bag', component: () => import('@/views/BagView.vue') },
    { path: '/me/settings', component: () => import('@/views/SettingsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const profile = useProfileStore()
  await profile.load()
  if (!profile.profile && to.path !== '/onboarding') return '/onboarding'
  if (profile.profile && to.path === '/onboarding') return '/'
})
