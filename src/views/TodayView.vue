<script setup lang="ts">
import { computed, watch } from 'vue'
import FruitIcon from '@/components/FruitIcon.vue'
import WeekTicks from '@/components/WeekTicks.vue'
import SectionHead from '@/components/SectionHead.vue'
import NutrientTag from '@/components/NutrientTag.vue'
import MealList from '@/components/MealList.vue'
import SupplementGrid from '@/components/SupplementGrid.vue'
import CheckupTicket from '@/components/CheckupTicket.vue'
import WeekNotes from '@/components/WeekNotes.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useMealsStore } from '@/stores/meals'
import { useRecordsStore } from '@/stores/records'
import { formatCn, greeting, weekdayCn } from '@/core/date'
import { getStatus } from '@/core/pregnancy'
import { buildSchedule, nextCheckup } from '@/core/checkupSchedule'
import { toIcs } from '@/core/ics'
import { downloadFile } from '@/utils/download'
import { getWeekInfo } from '@/content/weeks'
import { FOCUS_TAGS, SUPPLEMENTS, SUPPLEMENT_HINT, TRIMESTER_LABEL } from '@/content/nutrition'

const { today, hour } = useClock()
const profileStore = useProfileStore()
const meals = useMealsStore()
const records = useRecordsStore()

const profile = computed(() => profileStore.profile!)
const status = computed(() => getStatus(profile.value.dueDate, today.value))
const info = computed(() => getWeekInfo(status.value.week))
const log = computed(() => meals.logs[today.value])
const schedule = computed(() => buildSchedule(profile.value.dueDate, records.checkupOverrides))
const next = computed(() => nextCheckup(schedule.value, today.value))
const supplements = computed(() =>
  SUPPLEMENTS.filter((s) =>
    profile.value.supplementIds ? profile.value.supplementIds.includes(s.id) : s.trimesters.includes(status.value.trimester),
  ),
)
const taken = computed(() => records.supplementsTaken[today.value] ?? [])

watch(
  today,
  async (d) => {
    await Promise.all([meals.ensurePlans([d]), records.loadSupplements(d), records.loadCheckups()])
  },
  { immediate: true },
)

function exportCalendar() {
  const ics = toIcs(schedule.value, { location: profile.value.hospital, now: new Date() })
  downloadFile('产检日程.ics', ics, 'text/calendar;charset=utf-8')
}
</script>

<template>
  <main class="page">
    <div class="page-glow" />

    <header class="greet rise d1">
      <div>
        <div class="date">{{ formatCn(today) }} · {{ weekdayCn(today) }}</div>
        <h1>{{ greeting(hour) }}，今天也好好吃饭</h1>
      </div>
      <RouterLink to="/me/settings" class="icon-btn" aria-label="设置">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
      </RouterLink>
    </header>

    <section v-if="!status.inRange" class="card out-of-range rise d2">
      {{ status.week < 4 ? '孕周还不到 4 周，请确认预产期设置是否正确' : '已经过了预产期，请遵医嘱，密切留意身体变化' }}
      <RouterLink to="/me/settings">去设置 ›</RouterLink>
    </section>

    <section v-else class="hero rise d2">
      <div class="hero-row">
        <div>
          <div class="week-num">{{ status.week }}<sup>周 +{{ status.day }} 天</sup></div>
          <div class="week-meta">
            <span class="pill apricot">{{ TRIMESTER_LABEL[status.trimester] }}</span>
            <span class="pill ghost">预产期 {{ formatCn(profile.dueDate) }}</span>
          </div>
        </div>
        <FruitIcon :shape="info.fruitShape" :color="info.fruitColor" :label="`宝宝大小像${info.fruit}`" />
      </div>
      <p class="baby-line">宝宝现在约 <b>{{ info.lengthCm }} 厘米、{{ info.weightG }} 克</b>，像{{ info.fruit }}。<br />{{ info.baby }}</p>
      <WeekTicks :week="status.week" />
      <div class="countdown">
        <span v-if="status.daysToDue > 0">距离见面还有<strong>{{ status.daysToDue }}</strong>天</span>
        <span v-else>宝宝随时可能到来</span>
        <span>已走过 {{ Math.round(status.progress * 100) }}%</span>
      </div>
    </section>

    <section class="block rise d3">
      <SectionHead idx="01" title="今日三餐">已吃 {{ log?.eaten.length ?? 0 }} / 5</SectionHead>
      <div class="focus">
        <span>本阶段重点</span>
        <NutrientTag v-for="t in FOCUS_TAGS[status.trimester]" :key="t" :tag="t" />
      </div>
      <MealList
        v-if="log"
        :plan="log.plan"
        :eaten="log.eaten"
        @toggle="(s) => meals.toggleEaten(today, s)"
        @swap="(s) => meals.swap(today, s)"
      />
    </section>

    <section v-if="supplements.length" class="block rise d4">
      <SectionHead idx="02" title="今日补剂">{{ taken.length }} / {{ supplements.length }}</SectionHead>
      <SupplementGrid :items="supplements" :taken="taken" @toggle="(id) => records.toggleSupplement(today, id)" />
      <div class="hint">{{ SUPPLEMENT_HINT }}</div>
    </section>

    <section v-if="next" class="block rise d5">
      <SectionHead idx="03" title="下次产检"><RouterLink to="/pregnancy/checkups">全部日程</RouterLink></SectionHead>
      <CheckupTicket
        :checkup="next"
        :today="today"
        :week-at-date="getStatus(profile.dueDate, next.date).week"
        @calendar="exportCalendar"
      />
    </section>

    <section class="block rise d6">
      <SectionHead idx="04" title="这周要留意" />
      <WeekNotes :tips="info.tips" />
      <Disclaimer />
    </section>
  </main>
</template>

<style scoped>
.greet { display: flex; justify-content: space-between; align-items: flex-start; }
.greet .date { font-size: 13px; color: var(--ink-soft); letter-spacing: .04em; }
.greet h1 { margin: 4px 0 0; font-family: var(--font-title); font-size: 22px; font-weight: 600; letter-spacing: .02em; }
.icon-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); display: grid; place-items: center; color: var(--ink-soft); }
.out-of-range { margin-top: 18px; padding: 16px; font-size: 14px; line-height: 1.6; }
.out-of-range a { display: block; margin-top: 8px; color: var(--apricot); text-decoration: none; }
.hero { margin-top: 18px; }
.hero-row { display: flex; align-items: flex-end; justify-content: space-between; }
.week-num { font-family: var(--font-display); font-variation-settings: "opsz" 144; font-weight: 400; font-size: 112px; line-height: .82; letter-spacing: -.04em; }
.week-num sup { font-family: var(--font-title); font-size: 18px; letter-spacing: 0; font-weight: 600; vertical-align: top; position: relative; top: 14px; margin-left: 6px; }
.week-meta { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
.baby-line { margin: 14px 0 0; font-size: 14px; color: var(--ink-soft); line-height: 1.6; }
.baby-line b { color: var(--ink); font-weight: 600; }
.countdown { margin-top: 14px; display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; border-top: 1px dashed var(--line); font-size: 13px; color: var(--ink-soft); }
.countdown strong { font-family: var(--font-display); font-weight: 500; font-size: 26px; color: var(--ink); margin: 0 3px; }
.focus { display: flex; gap: 6px; margin-bottom: 12px; font-size: 12.5px; color: var(--ink-soft); align-items: center; }
.hint { margin-top: 10px; font-size: 12.5px; color: var(--ink-soft); }
</style>
