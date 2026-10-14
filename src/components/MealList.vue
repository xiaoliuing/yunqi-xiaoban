<script setup lang="ts">
import { ref } from 'vue'
import NutrientTag from './NutrientTag.vue'
import { PLAN_SLOTS, type DayPlan } from '@/core/mealPlanner'
import { getRecipe } from '@/content/recipes'
import type { PlanSlot } from '@/content/types'

defineProps<{ plan: DayPlan; eaten: PlanSlot[] }>()
const emit = defineEmits<{ toggle: [slot: PlanSlot]; swap: [slot: PlanSlot] }>()

const open = ref<PlanSlot | null>(null)
const spinning = ref<PlanSlot | null>(null)

function onSwap(slot: PlanSlot) {
  spinning.value = slot
  setTimeout(() => {
    emit('swap', slot)
    spinning.value = null
  }, 250)
}
</script>

<template>
  <div class="card meals">
    <div v-for="s in PLAN_SLOTS" :key="s.key" class="meal" :class="{ eaten: eaten.includes(s.key) }" :data-slot="s.key">
      <div class="when"><b>{{ s.label }}</b><small>{{ s.time }}</small></div>
      <div class="what" :class="{ swapping: spinning === s.key }">
        <template v-if="plan[s.key] && getRecipe(plan[s.key]!)">
          <button class="name" @click="open = open === s.key ? null : s.key">{{ getRecipe(plan[s.key]!)!.name }}</button>
          <div class="sub">{{ getRecipe(plan[s.key]!)!.tip }}</div>
          <div class="tags"><NutrientTag v-for="t in getRecipe(plan[s.key]!)!.tags" :key="t" :tag="t" /></div>
          <div v-if="open === s.key" class="detail">
            <p><b>食材：</b>{{ getRecipe(plan[s.key]!)!.ingredients.map((i) => `${i.name} ${i.amount}`).join('、') }}</p>
            <ol><li v-for="(step, i) in getRecipe(plan[s.key]!)!.steps" :key="i">{{ step }}</li></ol>
          </div>
        </template>
        <div v-else class="sub">暂无合适推荐</div>
      </div>
      <div class="acts">
        <button class="check" aria-label="标记已吃" :disabled="!plan[s.key]" @click="emit('toggle', s.key)">
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M3.5 8.3l3 3 6-6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button class="swap" :class="{ spin: spinning === s.key }" :disabled="!plan[s.key]" @click="onSwap(s.key)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13l-3-3M20 15H7l3 3" /></svg>
          换一份
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meals { padding: 6px 16px; }
.meal { display: grid; grid-template-columns: 44px 1fr auto; gap: 10px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.meal:last-child { border-bottom: 0; }
.when { padding-top: 2px; }
.when b { display: block; font-family: var(--font-title); font-size: 15px; font-weight: 600; }
.when small { font-family: var(--font-display); font-size: 12px; color: var(--ink-faint); }
.what { min-width: 0; transition: opacity .25s, transform .25s; }
.what.swapping { opacity: 0; transform: translateY(6px); }
.name { all: unset; display: block; font-size: 15.5px; font-weight: 600; line-height: 1.45; cursor: pointer; }
.eaten .name { color: var(--ink-faint); text-decoration: line-through; }
.sub { margin-top: 3px; font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }
.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.detail { margin-top: 10px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--paper-deep); font-size: 13px; line-height: 1.6; }
.detail p { margin: 0; }
.detail ol { margin: 6px 0 0; padding-left: 18px; }
.acts { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.check { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid var(--line); background: transparent; display: grid; place-items: center; color: transparent; transition: all .2s; }
.eaten .check { background: var(--sage); border-color: var(--sage); color: #fff; }
.swap { border: 0; background: none; padding: 0; font-size: 11.5px; color: var(--ink-faint); display: flex; flex-direction: column; align-items: center; gap: 2px; }
.swap svg { transition: transform .4s; }
.swap.spin svg { transform: rotate(180deg); }
</style>
