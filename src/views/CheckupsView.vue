<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { buildSchedule, nextCheckup } from '@/core/checkupSchedule'
import { getStatus } from '@/core/pregnancy'
import { diffDays, formatCn, weekdayCn } from '@/core/date'
import { toIcs } from '@/core/ics'
import { downloadFile } from '@/utils/download'

const { today } = useClock()
const profile = useProfileStore()
const records = useRecordsStore()
const listEl = useTemplateRef<HTMLOListElement>('list')
const schedule = computed(() => buildSchedule(profile.profile!.dueDate, records.checkupOverrides))

const rows = computed(() => {
  const next = nextCheckup(schedule.value, today.value)
  return schedule.value.map((c) => {
    const state = c.done ? 'done' : c.date < today.value ? 'overdue' : next?.id === c.id ? 'next' : 'later'
    return { ...c, state, week: getStatus(profile.profile!.dueDate, c.date).week, days: diffDays(c.date, today.value) }
  })
})

onMounted(async () => {
  await records.loadCheckups()
  await nextTick()
  const root = listEl.value
  const next = root?.querySelector('.step.next')
  const overdue = root ? [...root.querySelectorAll('.step.overdue')].at(-1) : undefined
  ;(next ?? overdue)?.scrollIntoView({ block: 'center' })
})

function exportAll() {
  downloadFile('产检日程.ics', toIcs(schedule.value, { location: profile.profile!.hospital, now: new Date() }), 'text/calendar;charset=utf-8')
}

function flag(row: { state: string; days: number }) {
  if (row.state === 'overdue') return '已过期'
  if (row.state === 'next') return row.days === 0 ? '就是今天' : `下次 · 还有 ${row.days} 天`
  return ''
}
</script>

<template>
  <main class="page">
    <PageHeader title="产检日程">
      <button class="btn dark sm" @click="exportAll">导入日历</button>
    </PageHeader>
    <p class="muted intro">日期默认按孕周推算。约好具体时间后点日期修改，再重新导入日历即可更新。</p>
    <ol ref="list" class="timeline">
      <li
        v-for="c in rows"
        :key="c.id"
        class="step"
        :class="c.state"
        :aria-current="c.state === 'next' ? 'step' : undefined"
      >
        <div class="rail" aria-hidden="true"><span class="dot" /></div>
        <article class="card item">
          <header class="top">
            <div>
              <span v-if="flag(c)" class="flag" :class="{ late: c.state === 'overdue' }">{{ flag(c) }}</span>
              <b>{{ c.name }}</b>
              <div class="when">孕 {{ c.week }} 周 · {{ formatCn(c.date) }} {{ weekdayCn(c.date) }}</div>
            </div>
            <label class="donebox">
              <input type="checkbox" :checked="c.done" @change="records.updateCheckup(c.id, { done: !c.done })" />
              已完成
            </label>
          </header>
          <p class="purpose">{{ c.purpose }}</p>
          <p class="prep">
            <span v-if="c.fasting" class="warn">需空腹</span>
            <span v-if="c.fullBladder" class="warn">需憋尿</span>
            携带：{{ c.bring.join('、') }}
          </p>
          <p v-if="c.note" class="note">{{ c.note }}</p>
          <label class="field date">
            <span>预约日期</span>
            <input type="date" :value="c.date" @change="records.updateCheckup(c.id, { date: ($event.target as HTMLInputElement).value || undefined })" />
          </label>
        </article>
      </li>
    </ol>
  </main>
</template>

<style scoped>
.intro { font-size: 13px; margin: 0 0 18px; line-height: 1.6; }
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.timeline { list-style: none; margin: 0; padding: 0; }
.step { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 12px; }
.step + .step { margin-top: 14px; }
.rail { position: relative; }
.rail::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 22px;
  bottom: -14px;
  width: 2px;
  transform: translateX(-50%);
  background: var(--line);
}
.step:last-child .rail::before { display: none; }
.step.done .rail::before,
.step.overdue .rail::before { background: var(--apricot); }
.dot {
  position: relative;
  z-index: 1;
  display: block;
  width: 12px;
  height: 12px;
  margin: 18px auto 0;
  border-radius: 50%;
  background: var(--card);
  border: 2px solid var(--line);
  box-sizing: border-box;
}
.step.done .dot { background: var(--sage); border-color: var(--sage); }
.step.overdue .dot { width: 14px; height: 14px; margin-top: 17px; background: var(--alert); border-color: var(--alert); box-shadow: 0 0 0 4px var(--alert-soft); }
.step.next .dot { width: 16px; height: 16px; margin-top: 16px; background: var(--apricot); border-color: var(--apricot); box-shadow: 0 0 0 5px var(--apricot-soft); }
.item { padding: 14px 16px; }
.step.done .item { opacity: .55; }
.step.overdue .item { border-color: var(--alert); box-shadow: 0 0 0 3px var(--alert-soft); }
.step.next .item { background: var(--butter); border-color: transparent; box-shadow: 0 12px 28px -16px rgba(224, 122, 79, .75); }
.top { display: flex; justify-content: space-between; gap: 10px; align-items: flex-start; }
.top b { display: block; font-family: var(--font-title); font-size: 16px; font-weight: 600; }
.flag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  margin-bottom: 6px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--butter);
  font-size: 12px;
  font-weight: 600;
}
.flag.late { background: var(--alert); color: #fff; }
.when { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.step.next .when { color: var(--butter-ink); }
.donebox { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--ink-soft); white-space: nowrap; }
.purpose { margin: 8px 0 0; font-size: 13.5px; line-height: 1.6; }
.prep { margin: 8px 0 0; font-size: 13px; line-height: 1.6; color: var(--ink-soft); }
.warn { display: inline-block; margin-right: 6px; padding: 1px 8px; border-radius: 6px; background: var(--ink); color: var(--butter); font-size: 12px; }
.note { margin: 8px 0 0; color: var(--butter-ink); background: var(--butter); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 13px; line-height: 1.6; }
.step.next .note { background: rgba(255, 253, 249, .72); }
.date { margin-top: 10px; }
</style>
