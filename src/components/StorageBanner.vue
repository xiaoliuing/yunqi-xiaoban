<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'

const profile = useProfileStore()
</script>

<template>
  <div v-if="profile.loaded && !profile.persistent" class="banner">
    当前浏览器无法保存数据（可能是无痕模式），关闭页面后记录会丢失
  </div>
</template>

<style scoped>
.banner {
  position: sticky; top: 0; z-index: 20; max-width: 430px; margin: 0 auto;
  padding: calc(env(safe-area-inset-top) + 8px) 16px 8px;
  background: var(--alert-soft); color: var(--alert); font-size: 12.5px; text-align: center;
}
</style>
