<script setup lang="ts">
defineProps<{ text: string; live: boolean }>()
</script>

<template>
  <details class="think">
    <summary class="label">思考过程</summary>
    <div class="body">{{ text }}<span v-if="live" class="caret" aria-hidden="true" /></div>
  </details>
</template>

<style scoped>
.think {
  padding: 12px 14px;
  border: 1px dashed var(--line);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--ink-soft);
}
.label {
  cursor: pointer;
  list-style: none;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
}
.label::-webkit-details-marker { display: none; }
.label::before {
  content: '';
  display: inline-block;
  width: 0.35em;
  height: 0.35em;
  margin-right: 7px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(-45deg) translateY(-1px);
  vertical-align: middle;
}
.think[open] > .label::before { transform: rotate(45deg) translateY(-2px); }
.body {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  background: var(--ink-faint);
  vertical-align: text-bottom;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .caret { animation: none; } }
</style>
