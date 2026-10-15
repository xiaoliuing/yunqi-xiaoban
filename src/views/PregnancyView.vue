<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import FruitIcon from '@/components/FruitIcon.vue'
import SectionHead from '@/components/SectionHead.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { getStatus } from '@/core/pregnancy'
import { WEEKS, getWeekInfo } from '@/content/weeks'

const { today } = useClock()
const profile = useProfileStore()
const current = computed(() => getStatus(profile.profile!.dueDate, today.value).week)
const selected = ref(getWeekInfo(current.value).week)
const info = computed(() => getWeekInfo(selected.value))
const strip = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  strip.value?.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest' })
})
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">孕期时间轴</h1>
    <div ref="strip" class="strip">
      <button
        v-for="w in WEEKS"
        :key="w.week"
        class="wk"
        :class="{ on: w.week === selected, now: w.week === current }"
        @click="selected = w.week"
      >{{ w.week }}</button>
    </div>

    <section class="card week">
      <div class="top">
        <div>
          <div class="num">{{ info.week }}<small>周</small></div>
          <p class="muted">约 {{ info.lengthCm }} 厘米 · {{ info.weightG }} 克 · 像{{ info.fruit }}</p>
        </div>
        <FruitIcon :shape="info.fruitShape" :color="info.fruitColor" :label="info.fruit" />
      </div>
      <h3>宝宝</h3><p>{{ info.baby }}</p>
      <h3>妈妈</h3><p>{{ info.mom }}</p>
      <h3>这周要留意</h3>
      <ul><li v-for="t in info.tips" :key="t.title"><b>{{ t.title }}</b> {{ t.detail }}</li></ul>
    </section>

    <section class="block">
      <SectionHead title="更多" />
      <RouterLink to="/pregnancy/prenatal" class="card entry"><b>胎教</b><span>按孕周说明能做什么，以及哪些说法没有依据</span></RouterLink>
      <RouterLink to="/pregnancy/checkups" class="card entry"><b>产检日程</b><span>全部产检安排，可改日期、导入日历</span></RouterLink>
      <RouterLink to="/pregnancy/redflags" class="card entry alert"><b>危险信号</b><span>哪些情况要立即就医</span></RouterLink>
    </section>
    <Disclaimer />
  </main>
</template>

<style scoped>
.title { margin: 8px 0 14px; font-family: var(--font-title); font-size: 26px; font-weight: 600; }
.strip { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; margin: 0 -20px; padding-left: 20px; padding-right: 20px; }
.wk { flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); font-family: var(--font-display); font-size: 16px; }
.wk.now { border-color: var(--apricot); color: var(--apricot); }
.wk.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.week { margin-top: 14px; padding: 18px; }
.top { display: flex; justify-content: space-between; align-items: flex-end; }
.num { font-family: var(--font-display); font-size: 64px; line-height: .9; }
.num small { font-family: var(--font-title); font-size: 16px; margin-left: 4px; }
.top p { margin: 8px 0 0; font-size: 13px; }
h3 { margin: 18px 0 4px; font-family: var(--font-title); font-size: 15px; color: var(--apricot); }
.week p, .week li { font-size: 14px; line-height: 1.7; margin: 0; }
ul { margin: 0; padding-left: 18px; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
.entry.alert b { color: var(--alert); }
</style>
