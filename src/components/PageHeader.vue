<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="ph">
    <button class="back" aria-label="返回" @click="$router.back()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <h1>{{ title }}</h1>
    <div class="slot"><slot /></div>
  </header>
</template>

<style scoped>
.ph { display: grid; grid-template-columns: 40px 1fr auto; align-items: center; gap: 8px; margin-bottom: 18px; }
.back { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); display: grid; place-items: center; }
h1 { margin: 0; font-family: var(--font-title); font-size: 20px; font-weight: 600; }
</style>
