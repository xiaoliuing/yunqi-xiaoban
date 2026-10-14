<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const tabs = [
  { to: '/', label: '今天', icon: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' },
  { to: '/eat', label: '吃', icon: 'M4 13h16a8 8 0 0 1-16 0zM9 9c0-2 1.5-2.5 1.5-4.5M14 9c0-2 1.5-2.5 1.5-4.5' },
  { to: '/pregnancy', label: '孕期', icon: 'M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z' },
  { to: '/me', label: '我的', icon: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <nav class="tabbar">
    <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" class="tab" :class="{ active: isActive(t.to) }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path :d="t.icon" />
      </svg>
      {{ t.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed; left: 50%; transform: translateX(-50%); bottom: 0;
  width: 100%; max-width: 430px;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: rgba(251, 246, 238, .86);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  backdrop-filter: blur(16px) saturate(1.4);
  border-top: 1px solid var(--line);
  z-index: 10;
}
.tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  font-size: 11px; color: var(--ink-faint); position: relative; text-decoration: none;
}
.tab.active { color: var(--ink); font-weight: 600; }
.tab.active::after {
  content: ""; position: absolute; top: 6px; left: 50%; margin-left: 9px;
  width: 6px; height: 6px; border-radius: 50%; background: var(--apricot);
}
</style>
