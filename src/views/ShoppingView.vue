<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useMealsStore } from '@/stores/meals'
import { addDays } from '@/core/date'
import { buildShoppingList } from '@/core/shoppingList'
import { recipesFromLog } from '@/core/mealPlanner'

const { today } = useClock()
const meals = useMealsStore()
const dates = computed(() => Array.from({ length: 7 }, (_, i) => addDays(today.value, i)))
const storageKey = computed(() => `shopping-checked:${today.value}`)
const checked = ref<string[]>([])

watch(dates, (d) => meals.ensurePlans(d), { immediate: true })
watch(storageKey, (k) => { checked.value = JSON.parse(localStorage.getItem(k) ?? '[]') }, { immediate: true })

const groups = computed(() => {
  const recipes = dates.value.flatMap((d) => {
    const log = meals.logs[d]
    return log ? recipesFromLog(log) : []
  })
  return buildShoppingList(recipes)
})

function toggle(name: string) {
  checked.value = checked.value.includes(name) ? checked.value.filter((n) => n !== name) : [...checked.value, name]
  localStorage.setItem(storageKey.value, JSON.stringify(checked.value))
}
</script>

<template>
  <main class="page">
    <PageHeader title="购物清单" />
    <p class="muted intro">按未来 7 天的食谱整理，换过的菜会自动更新</p>
    <section v-for="g in groups" :key="g.category" class="card group">
      <h2>{{ g.category }}</h2>
      <label v-for="item in g.items" :key="item.name" class="item" :class="{ done: checked.includes(item.name) }">
        <input type="checkbox" :checked="checked.includes(item.name)" @change="toggle(item.name)" />
        <span class="name">{{ item.name }}</span>
        <span class="amount">{{ item.amounts.join(' + ') }}</span>
      </label>
    </section>
  </main>
</template>

<style scoped>
.intro { font-size: 13px; margin: 0 0 14px; }
.group { padding: 8px 16px; margin-bottom: 12px; }
h2 { margin: 8px 0; font-family: var(--font-title); font-size: 15px; color: var(--apricot); }
.item { display: grid; grid-template-columns: 24px 1fr auto; gap: 8px; align-items: center; padding: 10px 0; border-top: 1px solid var(--line); font-size: 14px; }
.item input { width: 18px; height: 18px; accent-color: var(--sage); }
.amount { font-size: 12.5px; color: var(--ink-faint); text-align: right; }
.done .name { color: var(--ink-faint); text-decoration: line-through; }
</style>
