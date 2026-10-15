<script setup lang="ts">
import type { FoodLevel } from '@/content/types'

defineProps<{ name: string; level: FoodLevel | null; reason: string; advice: string }>()

const LEVEL: Record<FoodLevel, { label: string; cls: string }> = {
  ok: { label: '可以吃', cls: 'ok' },
  caution: { label: '适量吃', cls: 'caution' },
  avoid: { label: '避免', cls: 'avoid' },
}
</script>

<template>
  <article class="card food">
    <header>
      <b>{{ name }}</b>
      <span v-if="level" class="level" :class="LEVEL[level].cls">{{ LEVEL[level].label }}</span>
    </header>
    <p v-if="reason">{{ reason }}</p>
    <p v-if="advice" class="advice">{{ advice }}</p>
  </article>
</template>

<style scoped>
.food { padding: 14px 16px; }
.food header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.food b { font-size: 16px; }
.food p { margin: 8px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.advice { color: var(--ink); }
.level { flex: none; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.level.ok { background: var(--sage-soft); color: var(--sage-ink); }
.level.caution { background: var(--butter); color: var(--butter-ink); }
.level.avoid { background: var(--alert-soft); color: var(--alert); }
</style>
