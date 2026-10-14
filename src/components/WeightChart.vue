<script setup lang="ts">
import { computed } from 'vue'
import { recommendedGain } from '@/core/weightGain'

const props = defineProps<{ preBmi: number; points: { week: number; gain: number }[] }>()

const W = 340
const H = 200
const PAD = { l: 28, r: 8, t: 10, b: 22 }
const maxGain = computed(() => Math.max(recommendedGain(props.preBmi, 40).max + 2, ...props.points.map((p) => p.gain + 1)))
const minGain = computed(() => Math.min(-2, ...props.points.map((p) => p.gain - 1)))
const x = (week: number) => PAD.l + (week / 40) * (W - PAD.l - PAD.r)
const y = (gain: number) => PAD.t + ((maxGain.value - gain) / (maxGain.value - minGain.value)) * (H - PAD.t - PAD.b)

const band = computed(() => {
  const weeks = Array.from({ length: 41 }, (_, i) => i)
  const upper = weeks.map((w) => `${x(w)},${y(recommendedGain(props.preBmi, w).max)}`)
  const lower = weeks.reverse().map((w) => `${x(w)},${y(recommendedGain(props.preBmi, w).min)}`)
  return [...upper, ...lower].join(' ')
})
const line = computed(() => [...props.points].sort((a, b) => a.week - b.week).map((p) => `${x(p.week)},${y(p.gain)}`).join(' '))
const ticks = [0, 10, 20, 30, 40]
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="chart" role="img" aria-label="体重增长曲线">
    <polygon :points="band" fill="var(--sage-soft)" />
    <line :x1="PAD.l" :x2="W - PAD.r" :y1="y(0)" :y2="y(0)" stroke="var(--line)" />
    <g v-for="t in ticks" :key="t">
      <text :x="x(t)" :y="H - 6" text-anchor="middle" class="lbl">{{ t }}周</text>
    </g>
    <text :x="4" :y="y(0) + 4" class="lbl">0</text>
    <text :x="4" :y="y(Math.floor(maxGain)) + 4" class="lbl">+{{ Math.floor(maxGain) }}</text>
    <polyline v-if="points.length > 1" :points="line" fill="none" stroke="var(--apricot)" stroke-width="2" />
    <circle v-for="p in points" :key="p.week + '-' + p.gain" :cx="x(p.week)" :cy="y(p.gain)" r="3.5" fill="var(--apricot)" />
  </svg>
</template>

<style scoped>
.chart { width: 100%; height: auto; display: block; }
.lbl { font-size: 10px; fill: var(--ink-faint); font-family: var(--font-display); }
</style>
