<script setup lang="ts">
import { computed, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MealList from '@/components/MealList.vue'
import { useClock } from '@/composables/useClock'
import { useMealsStore } from '@/stores/meals'
import { addDays, formatCn, weekdayCn } from '@/core/date'

const { today } = useClock()
const meals = useMealsStore()
const dates = computed(() => Array.from({ length: 7 }, (_, i) => addDays(today.value, i)))

watch(dates, (d) => meals.ensurePlans(d), { immediate: true })
</script>

<template>
  <main class="page">
    <PageHeader title="一周食谱" />
    <section v-for="d in dates" :key="d" class="day">
      <h2>{{ d === today ? '今天' : formatCn(d) }} <small>{{ weekdayCn(d) }}</small></h2>
      <MealList
        v-if="meals.logs[d]"
        :plan="meals.logs[d].plan"
        :eaten="meals.logs[d].eaten"
        @toggle="(s) => meals.toggleEaten(d, s)"
        @swap="(s) => meals.swap(d, s)"
      />
    </section>
  </main>
</template>

<style scoped>
.day { margin-bottom: 24px; }
h2 { margin: 0 0 10px; font-family: var(--font-title); font-size: 17px; }
h2 small { font-family: var(--font-body); font-weight: 400; font-size: 12.5px; color: var(--ink-faint); margin-left: 4px; }
</style>
