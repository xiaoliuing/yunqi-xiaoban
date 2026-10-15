<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/ai/markdown'

const props = defineProps<{ source: string }>()
const html = computed(() => renderMarkdown(props.source))
</script>

<template>
  <div class="md" v-html="html" />
</template>

<style scoped>
.md { font-size: 14.5px; line-height: 1.75; overflow-wrap: anywhere; }
.md :deep(p) { margin: 0 0 10px; }
.md :deep(p:last-child) { margin-bottom: 0; }
.md :deep(h1),
.md :deep(h2),
.md :deep(h3) {
  font-family: var(--font-title);
  font-weight: 600;
  line-height: 1.35;
  margin: 16px 0 8px;
}
.md :deep(h1) { font-size: 18px; }
.md :deep(h2) { font-size: 16.5px; }
.md :deep(h3) { font-size: 15px; }
.md :deep(h1:first-child),
.md :deep(h2:first-child),
.md :deep(h3:first-child) { margin-top: 0; }
.md :deep(ul),
.md :deep(ol) { margin: 0 0 10px; padding-left: 1.25em; }
.md :deep(li) { margin: 4px 0; }
.md :deep(li > p) { margin: 0; }
.md :deep(strong) { font-weight: 650; }
.md :deep(a) { color: var(--apricot-ink); }
.md :deep(blockquote) {
  margin: 0 0 10px;
  padding: 2px 0 2px 12px;
  border-left: 3px solid var(--apricot);
  color: var(--ink-soft);
}
.md :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.92em;
  background: var(--paper-deep);
  padding: 1px 5px;
  border-radius: 5px;
}
.md :deep(pre) {
  margin: 0 0 10px;
  padding: 12px;
  background: var(--paper-deep);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}
.md :deep(pre code) { background: none; padding: 0; }
.md :deep(hr) { border: 0; border-top: 1px dashed var(--line); margin: 14px 0; }
.md :deep(table) { width: 100%; border-collapse: collapse; margin: 0 0 10px; font-size: 13.5px; }
.md :deep(th),
.md :deep(td) { border-bottom: 1px solid var(--line); text-align: left; padding: 6px 8px 6px 0; vertical-align: top; }
</style>
