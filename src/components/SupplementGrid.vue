<script setup lang="ts">
import type { SupplementId, SupplementInfo } from '@/content/types'

defineProps<{ items: SupplementInfo[]; taken: SupplementId[] }>()
const emit = defineEmits<{ toggle: [id: SupplementId] }>()
</script>

<template>
  <div class="supps">
    <button
      v-for="s in items"
      :key="s.id"
      class="supp"
      :class="{ done: taken.includes(s.id) }"
      :style="{ '--c': s.color }"
      :data-id="s.id"
      @click="emit('toggle', s.id)"
    >
      <div class="cap" />
      <b>{{ s.name }}</b>
      <small>{{ s.dose === '遵医嘱' ? s.timing.split('，')[0] : s.dose }}</small>
    </button>
  </div>
</template>

<style scoped>
.supps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.supp { border: 1px solid var(--line); background: var(--card); border-radius: var(--radius-md); padding: 12px 6px 10px; text-align: center; transition: all .2s; position: relative; }
.cap { width: 34px; height: 16px; border-radius: 8px; margin: 0 auto 8px; background: linear-gradient(90deg, var(--c) 50%, #fff 50%); border: 1.5px solid var(--c); transform: rotate(-24deg); transition: transform .3s; }
b { display: block; font-size: 14px; font-weight: 600; }
small { display: block; font-size: 11px; color: var(--ink-faint); margin-top: 2px; }
.supp.done { background: var(--sage-soft); border-color: transparent; }
.supp.done .cap { transform: rotate(0); }
.supp.done::after {
  content: ""; position: absolute; top: 7px; right: 7px; width: 16px; height: 16px; border-radius: 50%; background: var(--sage);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.5 8.2l2.3 2.3 4.7-4.8' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>");
}
</style>
