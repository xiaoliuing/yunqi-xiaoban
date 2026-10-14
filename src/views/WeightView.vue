<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import WeightChart from '@/components/WeightChart.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { getStatus } from '@/core/pregnancy'
import { assessGain, bmi, recommendedGain, totalGainRange } from '@/core/weightGain'
import { formatCn } from '@/core/date'

const { today } = useClock()
const profileStore = useProfileStore()
const records = useRecordsStore()
const p = computed(() => profileStore.profile!)
const preBmi = computed(() => bmi(p.value.heightCm, p.value.preWeightKg))
const date = ref(today.value)
const kg = ref<number | null>(null)

onMounted(() => records.loadWeights())

const points = computed(() =>
  records.weights.map((w) => ({ week: getStatus(p.value.dueDate, w.date).gestationDays / 7, gain: Math.round((w.kg - p.value.preWeightKg) * 10) / 10 })),
)
const latest = computed(() => records.weights[records.weights.length - 1])
const verdict = computed(() => {
  if (!latest.value) return null
  const week = getStatus(p.value.dueDate, latest.value.date).week
  const range = recommendedGain(preBmi.value, week)
  const result = assessGain(p.value, week, latest.value.kg)
  const text = { low: '增长偏少，注意吃够主食和蛋白质', normal: '在推荐范围内，继续保持', high: '增长偏多，少吃甜食和油炸食品，适当散步' }[result]
  return { result, text, range, week }
})

async function save() {
  if (!kg.value || kg.value < 30 || kg.value > 200) return
  await records.saveWeight(date.value, kg.value)
  kg.value = null
}
</script>

<template>
  <main class="page">
    <PageHeader title="体重记录" />
    <section class="card summary">
      <p class="muted">孕前 BMI {{ preBmi }}，整个孕期推荐增重 {{ totalGainRange(preBmi).min }}–{{ totalGainRange(preBmi).max }} 公斤</p>
      <WeightChart :pre-bmi="preBmi" :points="points" />
      <p v-if="verdict" class="verdict" :class="verdict.result">
        孕 {{ verdict.week }} 周已增重 {{ (latest!.kg - p.preWeightKg).toFixed(1) }} 公斤（推荐 {{ verdict.range.min }}–{{ verdict.range.max }}），{{ verdict.text }}
      </p>
    </section>
    <section class="card add">
      <label class="field"><span>日期</span><input v-model="date" type="date" /></label>
      <label class="field"><span>体重（公斤）</span><input v-model.number="kg" type="number" step="0.1" inputmode="decimal" /></label>
      <button class="btn dark block-btn" :disabled="!kg" @click="save">记录</button>
    </section>
    <ul class="list">
      <li v-for="w in [...records.weights].reverse()" :key="w.date">
        <span>{{ formatCn(w.date) }}</span><b>{{ w.kg }} 公斤</b>
        <button aria-label="删除" @click="records.deleteWeight(w.date)">×</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.summary, .add { padding: 16px; margin-bottom: 14px; }
.summary p { margin: 0 0 10px; font-size: 13px; }
.verdict { margin-top: 10px !important; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13.5px !important; line-height: 1.6; }
.verdict.normal { background: var(--sage-soft); color: var(--sage-ink); }
.verdict.low, .verdict.high { background: var(--butter); color: var(--butter-ink); }
.add .btn { margin-top: 16px; }
.list { list-style: none; padding: 0; margin: 0; }
.list li { display: grid; grid-template-columns: 1fr auto 32px; align-items: center; padding: 12px 4px; border-bottom: 1px solid var(--line); font-size: 14px; }
.list button { border: 0; background: none; color: var(--ink-faint); font-size: 18px; }
</style>
