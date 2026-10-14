<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useRecordsStore } from '@/stores/records'
import { BIRTH_BAG } from '@/content/birthBag'

const records = useRecordsStore()
onMounted(() => records.loadBag())

const groups = computed(() => {
  const order = ['证件', '妈妈', '宝宝', '其他'] as const
  return order.map((g) => ({ group: g, items: BIRTH_BAG.filter((b) => b.group === g) }))
})
const done = computed(() => BIRTH_BAG.filter((b) => records.bag[b.id]).length)
</script>

<template>
  <main class="page">
    <PageHeader title="待产包">
      <span class="faint count">{{ done }} / {{ BIRTH_BAG.length }}</span>
    </PageHeader>
    <p class="muted intro">建议孕 34–36 周准备好，放在门口随时能拿走。</p>
    <section v-for="g in groups" :key="g.group" class="card group">
      <h2>{{ g.group }}</h2>
      <label v-for="item in g.items" :key="item.id" class="item" :class="{ done: records.bag[item.id] }">
        <input type="checkbox" :checked="!!records.bag[item.id]" @change="records.toggleBag(item.id)" />
        {{ item.name }}
      </label>
    </section>
  </main>
</template>

<style scoped>
.count { font-family: var(--font-display); font-size: 15px; }
.intro { font-size: 13px; margin: 0 0 14px; }
.group { padding: 8px 16px; margin-bottom: 12px; }
h2 { margin: 8px 0; font-family: var(--font-title); font-size: 15px; color: var(--apricot); }
.item { display: flex; gap: 10px; align-items: center; padding: 11px 0; border-top: 1px solid var(--line); font-size: 14px; }
.item input { width: 18px; height: 18px; accent-color: var(--sage); }
.done { color: var(--ink-faint); text-decoration: line-through; }
</style>
