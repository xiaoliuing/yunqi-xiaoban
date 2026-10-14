<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTabBar from '@/components/AppTabBar.vue'
import StorageBanner from '@/components/StorageBanner.vue'
import InstallHint from '@/components/InstallHint.vue'

const route = useRoute()
const showTabs = computed(() => !route.meta.hideTabs)
</script>

<template>
  <StorageBanner />
  <RouterView />
  <template v-if="showTabs">
    <InstallHint />
    <AppTabBar />
  </template>
</template>
