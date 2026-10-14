<script setup lang="ts">
defineProps<{ idx?: string; title: string }>()
</script>

<template>
  <div class="head">
    <h2><span v-if="idx" class="idx">{{ idx }}</span>{{ title }}</h2>
    <span class="aside"><slot /></span>
  </div>
</template>

<style scoped>
.head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
h2 { margin: 0; font-family: var(--font-title); font-size: 19px; font-weight: 600; display: flex; align-items: baseline; gap: 8px; }
.idx { font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: 15px; color: var(--apricot); }
.aside { font-size: 12.5px; color: var(--ink-faint); }
.aside :deep(a) { color: inherit; text-decoration: none; }
</style>
