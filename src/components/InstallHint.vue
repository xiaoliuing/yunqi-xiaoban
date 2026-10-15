<script setup lang="ts">
import { ref } from 'vue'

const KEY = 'install-hint-dismissed'
const ua = navigator.userAgent
const isIos = /iPhone|iPad|iPod/.test(ua)
const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
const show = ref(isIos && !standalone && !localStorage.getItem(KEY))

function dismiss() {
  localStorage.setItem(KEY, '1')
  show.value = false
}
</script>

<template>
  <div v-if="show" class="hint">
    <span>点底部「分享」→「添加到主屏幕」，用起来像 App 一样</span>
    <button aria-label="关闭" @click="dismiss">×</button>
  </div>
</template>

<style scoped>
.hint {
  position: fixed; left: 16px; right: 16px;
  bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 12px);
  z-index: 15;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-radius: var(--radius-md);
  background: var(--ink); color: var(--paper); font-size: 13px;
}
.hint button { margin-left: auto; border: 0; background: none; color: inherit; font-size: 20px; line-height: 1; }
</style>
