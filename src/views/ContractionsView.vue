<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getDb, type ContractionRow } from '@/db'
import { is511, withStats } from '@/core/contractionTimer'

const rows = ref<ContractionRow[]>([])
const runningStart = ref<number | null>(null)
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

async function load() {
  const since = Date.now() - 6 * 3600_000
  rows.value = await getDb().contractions.where('start').above(since).toArray()
}

onMounted(async () => {
  await load()
  timer = setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => clearInterval(timer))

const stats = computed(() => withStats(rows.value).reverse())
const alert511 = computed(() => is511(rows.value))

async function toggle() {
  if (runningStart.value === null) {
    runningStart.value = Date.now()
    return
  }
  await getDb().contractions.add({ start: runningStart.value, end: Date.now() })
  runningStart.value = null
  await load()
}

async function clearAll() {
  if (!confirm('清空全部宫缩记录？')) return
  await getDb().contractions.clear()
  await load()
}

const fmt = (t: number) => new Date(t).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <main class="page">
    <PageHeader title="宫缩计时">
      <button v-if="rows.length" class="btn light sm" @click="clearAll">清空</button>
    </PageHeader>
    <p v-if="alert511" class="alert">已经连续 1 小时每 5 分钟一次、每次 1 分钟以上，请准备去医院</p>
    <p class="muted intro">肚子发紧时点「开始」，放松时点「结束」。未满 37 周出现规律宫缩，请直接去医院。</p>
    <button class="big" :class="{ running: runningStart !== null }" @click="toggle">
      <template v-if="runningStart === null">开始</template>
      <template v-else>结束<small>{{ Math.floor((now - runningStart) / 1000) }} 秒</small></template>
    </button>
    <table v-if="stats.length" class="table">
      <thead><tr><th>开始</th><th>持续</th><th>间隔</th></tr></thead>
      <tbody>
        <tr v-for="c in stats" :key="c.start">
          <td>{{ fmt(c.start) }}</td>
          <td :class="{ strong: c.durationSec >= 60 }">{{ c.durationSec }} 秒</td>
          <td :class="{ strong: c.intervalMin !== null && c.intervalMin <= 5 }">{{ c.intervalMin === null ? '—' : `${c.intervalMin} 分钟` }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.alert { padding: 12px; border-radius: var(--radius-sm); background: var(--alert-soft); color: var(--alert); font-weight: 600; font-size: 14px; line-height: 1.6; }
.intro { font-size: 13px; line-height: 1.6; }
.big { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 24px auto; width: 180px; height: 180px; border-radius: 50%; border: 0; background: var(--sage); color: #fff; font-size: 24px; font-weight: 700; }
.big.running { background: var(--apricot); }
.big small { font-family: var(--font-display); font-size: 18px; font-weight: 400; margin-top: 4px; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; font-weight: 500; color: var(--ink-faint); font-size: 12.5px; padding: 6px 4px; }
td { padding: 10px 4px; border-top: 1px solid var(--line); }
td.strong { color: var(--apricot); font-weight: 600; }
</style>
