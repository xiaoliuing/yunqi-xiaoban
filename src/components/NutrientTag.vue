<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ tag: string }>()
const CLASS: Record<string, string> = { 补铁: 'iron', 补钙: 'calcium', DHA: 'dha', 叶酸: 'folate' }
const cls = computed(() => CLASS[props.tag] ?? 'other')
</script>

<template>
  <span class="tag" :class="cls">{{ tag }}</span>
</template>
