<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { buildSchedule } from '@/core/checkupSchedule'
import { getStatus } from '@/core/pregnancy'
import { formatCn, weekdayCn } from '@/core/date'
import { toIcs } from '@/core/ics'
import { downloadFile } from '@/utils/download'

const { today } = useClock()
const profile = useProfileStore()
const records = useRecordsStore()
const schedule = computed(() => buildSchedule(profile.profile!.dueDate, records.checkupOverrides))

onMounted(() => records.loadCheckups())

function exportAll() {
  downloadFile('产检日程.ics', toIcs(schedule.value, { location: profile.profile!.hospital, now: new Date() }), 'text/calendar;charset=utf-8')
}
</script>

<template>
  <main class="page">
    <PageHeader title="产检日程">
      <button class="btn dark sm" @click="exportAll">导入日历</button>
    </PageHeader>
    <p class="muted intro">日期默认按孕周推算。约好具体时间后点日期修改，再重新导入日历即可更新。</p>
    <article
      v-for="c in schedule"
      :key="c.id"
      class="card item"
      :class="{ done: c.done, past: !c.done && c.date < today }"
    >
      <header>
        <div>
          <b>{{ c.name }}</b>
          <div class="when">孕 {{ getStatus(profile.profile!.dueDate, c.date).week }} 周 · {{ formatCn(c.date) }} {{ weekdayCn(c.date) }}</div>
        </div>
        <label class="donebox">
          <input type="checkbox" :checked="c.done" @change="records.updateCheckup(c.id, { done: !c.done })" />
          已完成
        </label>
      </header>
      <p>{{ c.purpose }}</p>
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
  </main>
</template>

<style scoped>
.intro { font-size: 13px; margin: 0 0 14px; line-height: 1.6; }
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.item { padding: 14px 16px; margin-bottom: 10px; }
.item.done { opacity: .55; }
.item.past { border-color: var(--apricot); }
header { display: flex; justify-content: space-between; gap: 10px; }
header b { font-family: var(--font-title); font-size: 16px; }
.when { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.donebox { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--ink-soft); white-space: nowrap; }
p { margin: 8px 0 0; font-size: 13.5px; line-height: 1.6; }
.prep { color: var(--ink-soft); }
.warn { display: inline-block; margin-right: 6px; padding: 1px 8px; border-radius: 6px; background: var(--ink); color: var(--butter); font-size: 12px; }
.note { color: var(--butter-ink); background: var(--butter); padding: 8px 10px; border-radius: var(--radius-sm); }
.date { margin-top: 10px; }
</style>
