<script setup lang="ts">
defineProps<{ week: number }>()
</script>

<template>
  <div class="ticks" :aria-label="`孕程进度：第 ${week} 周，共 40 周`">
    <div class="row">
      <div
        v-for="w in 40"
        :key="w"
        class="tick"
        :class="{ past: w < week, now: w === week, boundary: w === 14 || w === 28 }"
      />
    </div>
    <div class="labels">
      <span :class="{ on: week < 14 }">孕早期</span>
      <span :class="{ on: week >= 14 && week < 28 }">孕中期</span>
      <span :class="{ on: week >= 28 }" class="end">孕晚期</span>
    </div>
  </div>
</template>

<style scoped>
.ticks { margin-top: 16px; }
.row { display: grid; grid-template-columns: repeat(40, 1fr); gap: 3px; align-items: end; height: 22px; }
.tick { height: 12px; border-radius: 2px; background: var(--line); }
.tick.past { background: var(--apricot); opacity: .85; }
.tick.boundary { height: 18px; }
.tick.now { height: 22px; background: var(--ink); animation: breathe 2.4s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
.labels { display: grid; grid-template-columns: 13fr 14fr 13fr; margin-top: 6px; font-size: 11px; color: var(--ink-faint); letter-spacing: .08em; }
.labels .on { color: var(--apricot); font-weight: 600; }
.labels .end { text-align: right; }
@media (prefers-reduced-motion: reduce) { .tick.now { animation: none; } }
</style>
