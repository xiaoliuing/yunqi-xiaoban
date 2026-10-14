<script setup lang="ts">
import type { WeekTip } from '@/content/types'

defineProps<{ tips: WeekTip[] }>()
const NUMERALS = ['i', 'ii', 'iii']
</script>

<template>
  <div class="card list">
    <div v-for="(t, i) in tips" :key="t.title" class="item">
      <div class="n">{{ NUMERALS[i] }}</div>
      <p>{{ t.title }}<span>{{ t.detail }}</span></p>
    </div>
  </div>
  <RouterLink to="/pregnancy/redflags" class="redflag">
    <span class="dot" />
    身体不舒服？看看哪些情况要立即就医
    <em>查看 ›</em>
  </RouterLink>
</template>

<style scoped>
.list { padding: 4px 16px; }
.item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--line); }
.item:last-child { border-bottom: 0; }
.n { font-family: var(--font-display); font-style: italic; font-size: 20px; color: var(--apricot); line-height: 1.1; width: 18px; flex: none; }
p { margin: 0; font-size: 14px; line-height: 1.65; }
p span { color: var(--ink-soft); font-size: 12.5px; display: block; margin-top: 2px; }
.redflag { margin-top: 12px; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: var(--radius-md); background: var(--alert-soft); color: var(--alert); font-size: 13.5px; font-weight: 500; text-decoration: none; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--alert); flex: none; box-shadow: 0 0 0 4px rgba(200, 72, 58, .15); }
em { margin-left: auto; font-style: normal; font-size: 12.5px; opacity: .8; }
</style>
