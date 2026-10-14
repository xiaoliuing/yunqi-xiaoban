<script setup lang="ts">
import { computed, ref } from 'vue'
import { diffDays, formatCn, weekdayCn, type DateStr } from '@/core/date'
import type { ScheduledCheckup } from '@/core/checkupSchedule'

const props = defineProps<{ checkup: ScheduledCheckup; today: DateStr; weekAtDate: number }>()
const emit = defineEmits<{ calendar: [] }>()

const daysLeft = computed(() => diffDays(props.checkup.date, props.today))
const showNotes = ref(false)
const chips = computed(() => {
  const c = props.checkup
  const list: { text: string; warn?: boolean }[] = []
  if (c.fasting) list.push({ text: '需空腹', warn: true })
  if (c.fullBladder) list.push({ text: '需憋尿', warn: true })
  for (const b of c.bring.slice(0, 2)) list.push({ text: `带${b}` })
  return list
})
</script>

<template>
  <div class="ticket">
    <div class="stub">
      <small>{{ daysLeft === 0 ? '就是' : '还有' }}</small>
      <strong>{{ daysLeft === 0 ? '今' : daysLeft }}</strong>
      <small>天</small>
    </div>
    <div class="body">
      <div class="d">{{ formatCn(checkup.date) }} {{ weekdayCn(checkup.date) }} · 孕 {{ weekAtDate }} 周</div>
      <h3>{{ checkup.name }}</h3>
      <div class="notes">
        <span v-for="c in chips" :key="c.text" :class="{ warn: c.warn }">{{ c.text }}</span>
      </div>
      <p v-if="showNotes" class="more">{{ checkup.purpose }}<template v-if="checkup.note"><br />{{ checkup.note }}</template></p>
      <div class="btns">
        <button class="btn dark sm" @click="emit('calendar')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
          加入日历
        </button>
        <button class="btn sm ghost" @click="showNotes = !showNotes">{{ showNotes ? '收起' : '检查须知' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket { position: relative; display: grid; grid-template-columns: 92px 1fr; background: var(--butter); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); }
.stub { padding: 18px 0; text-align: center; border-right: 2px dashed rgba(122, 93, 18, .28); position: relative; }
.stub::before, .stub::after { content: ""; position: absolute; right: -11px; width: 20px; height: 20px; border-radius: 50%; background: var(--paper); }
.stub::before { top: -10px; }
.stub::after { bottom: -10px; }
.stub small { display: block; font-size: 11.5px; color: var(--butter-ink); letter-spacing: .1em; }
.stub strong { display: block; font-family: var(--font-display); font-weight: 400; font-size: 54px; line-height: 1; margin: 4px 0 2px; }
.body { padding: 16px 16px 16px 18px; }
.d { font-size: 12.5px; color: var(--butter-ink); }
h3 { margin: 4px 0 8px; font-family: var(--font-title); font-size: 18px; font-weight: 600; }
.notes { display: flex; gap: 6px; flex-wrap: wrap; }
.notes span { font-size: 11.5px; height: 22px; padding: 0 8px; border-radius: 6px; background: rgba(255, 253, 249, .7); display: inline-flex; align-items: center; color: #5E4A14; }
.notes span.warn { background: var(--ink); color: var(--butter); }
.more { margin: 10px 0 0; font-size: 12.5px; line-height: 1.6; color: #5E4A14; }
.btns { display: flex; gap: 8px; margin-top: 12px; }
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.btn.ghost { background: rgba(255, 253, 249, .75); color: var(--ink); }
</style>
