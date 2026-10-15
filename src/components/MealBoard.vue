<script setup lang="ts">
import { ref } from 'vue'
import NutrientTag from './NutrientTag.vue'
import { PLAN_SLOTS, type DayPlan } from '@/core/mealPlanner'
import { getRecipe } from '@/content/recipes'
import type { AiDish, PlanSlot } from '@/content/types'

const props = defineProps<{
  plan: DayPlan
  eaten: PlanSlot[]
  hour: number
  dishes?: Partial<Record<PlanSlot, AiDish>>
  locked?: boolean
  paintingSlot?: PlanSlot | null
  imageErrors?: Partial<Record<PlanSlot, string>>
}>()
const emit = defineEmits<{ toggle: [slot: PlanSlot]; swap: [slot: PlanSlot]; retryImage: [slot: PlanSlot] }>()

const TAB: Record<PlanSlot, string> = { breakfast: '早餐', snackAm: '上午', lunch: '午餐', snackPm: '下午', dinner: '晚餐' }
const TITLE: Record<PlanSlot, string> = { breakfast: '早餐', snackAm: '上午加餐', lunch: '午餐', snackPm: '下午加餐', dinner: '晚餐' }

function slotForHour(hour: number): PlanSlot {
  if (hour < 9) return 'breakfast'
  if (hour < 11) return 'snackAm'
  if (hour < 14) return 'lunch'
  if (hour < 17) return 'snackPm'
  return 'dinner'
}

const active = ref<PlanSlot>(slotForHour(props.hour))
const missing = ref<Record<string, true>>({})
const spinning = ref(false)

function card(key: PlanSlot): AiDish | undefined {
  return props.dishes?.[key] ?? (props.plan[key] ? getRecipe(props.plan[key]!) : undefined)
}

function photo(key: PlanSlot): string {
  const dish = props.dishes?.[key]
  if (dish?.image) return dish.image
  const id = props.plan[key]
  if (id && !dish) return `/meal-images/${id}.jpg`
  return ''
}

function select(key: PlanSlot) {
  active.value = key
  const src = photo(key)
  if (!src || !missing.value[src]) return
  const next = { ...missing.value }
  delete next[src]
  missing.value = next
}

function onSwap() {
  spinning.value = true
  setTimeout(() => {
    emit('swap', active.value)
    spinning.value = false
  }, 250)
}
</script>

<template>
  <div class="card board">
    <div class="tabs" role="tablist">
      <button
        v-for="s in PLAN_SLOTS"
        :key="s.key"
        type="button"
        class="tab"
        role="tab"
        :class="{ on: active === s.key, ate: eaten.includes(s.key) }"
        :aria-selected="active === s.key"
        @click="select(s.key)"
      >{{ TAB[s.key] }}</button>
    </div>

    <div class="panel" role="tabpanel">
      <div class="frame">
        <img
          v-if="photo(active) && !missing[photo(active)]"
          class="photo"
          :src="photo(active)"
          :alt="card(active)?.name || ''"
          @error="missing[photo(active)] = true"
        />
        <div v-else class="photo wait">
          <template v-if="paintingSlot === active">正在画这张图</template>
          <template v-else-if="imageErrors?.[active]">{{ imageErrors[active] }}</template>
          <template v-else-if="dishes?.[active] && paintingSlot">等一下就画</template>
          <template v-else-if="dishes?.[active]">还没有配图</template>
          <template v-else>配图还在准备</template>
        </div>
      </div>

      <div class="body" :class="{ swapping: spinning }">
        <div class="when">{{ TITLE[active] }} · {{ PLAN_SLOTS.find((s) => s.key === active)?.time }}</div>
        <template v-if="card(active) || plan[active]">
          <div class="name" :class="{ ate: eaten.includes(active) }">{{ (card(active) ?? {}).name }}</div>
          <p class="sub">{{ card(active)?.tip }}</p>
          <div v-if="card(active)?.tags.length" class="tags">
            <NutrientTag v-for="t in card(active)!.tags" :key="t" :tag="t" />
          </div>
          <div v-if="card(active)" class="detail">
            <p><b>食材：</b>{{ card(active)!.ingredients.map((i) => `${i.name} ${i.amount}`).join('、') }}</p>
            <ol><li v-for="(step, i) in card(active)!.steps" :key="i">{{ step }}</li></ol>
          </div>
        </template>
        <p v-else class="sub">暂无合适推荐</p>

        <div class="acts">
          <button type="button" class="check" :class="{ on: eaten.includes(active) }" :disabled="locked || !(card(active) || plan[active])" @click="emit('toggle', active)">
            {{ eaten.includes(active) ? '已吃' : '标记已吃' }}
          </button>
          <button type="button" class="swap" :disabled="locked || paintingSlot === active || !(card(active) || plan[active])" @click="onSwap">换一份</button>
          <button v-if="dishes?.[active] && paintingSlot !== active" type="button" class="swap" @click="emit('retryImage', active)">{{ dishes[active]?.image ? '重画' : '画一张' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board { padding: 8px 8px 4px; }
.tabs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; }
.tab {
  border: 0; background: transparent; height: 36px; padding: 0;
  font-size: 13px; color: var(--ink-faint); border-bottom: 2px solid transparent;
}
.tab.on { color: var(--ink); font-weight: 600; border-bottom-color: var(--apricot); }
.tab.ate:not(.on) { color: var(--sage-ink); }
.frame { margin: 10px 6px 0; }
.photo {
  display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover;
  border-radius: var(--radius-md); background: var(--paper-deep);
}
.photo.wait {
  display: grid; place-items: center; color: var(--ink-faint); font-size: 13px; text-align: center; padding: 0 16px;
}
.body { padding: 14px 10px 12px; transition: opacity .25s, transform .25s; }
.body.swapping { opacity: 0; transform: translateY(6px); }
.when { font-size: 12px; color: var(--ink-faint); letter-spacing: .04em; }
.name { margin-top: 4px; font-size: 18px; font-weight: 600; line-height: 1.45; }
.name.ate { color: var(--ink-faint); text-decoration: line-through; }
.sub { margin: 4px 0 0; font-size: 13px; color: var(--ink-soft); line-height: 1.5; }
.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
.detail { margin-top: 12px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--paper-deep); font-size: 13px; line-height: 1.6; }
.detail p { margin: 0; }
.detail ol { margin: 6px 0 0; padding-left: 18px; }
.acts { display: flex; gap: 8px; margin-top: 14px; }
.check, .swap {
  height: 34px; padding: 0 14px; border-radius: 999px; font-size: 13px;
  border: 1px solid var(--line); background: transparent; color: var(--ink-soft);
}
.check.on { background: var(--sage); border-color: var(--sage); color: #fff; }
.check:disabled, .swap:disabled { opacity: .4; }
</style>
