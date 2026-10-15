<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import SectionHead from '@/components/SectionHead.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import FoodCard from '@/components/FoodCard.vue'
import { searchFoods } from '@/core/foodSearch'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { getStatus } from '@/core/pregnancy'
import { buildFoodSystemPrompt, parseFoodAnswer, type FoodJudgement } from '@/ai/foodAnswer'
import { askAi, AiError } from '@/ai/client'

const { today } = useClock()
const profile = useProfileStore()
const query = ref('')
const results = computed(() => searchFoods(query.value))
const asking = ref(false)
const aiError = ref('')
const aiFood = ref<(FoodJudgement & { name: string }) | null>(null)
const quick = ['螃蟹', '咖啡', '西瓜', '山楂', '生鱼片', '冰淇淋']
let requestId = 0

watch(query, () => {
  requestId += 1
  asking.value = false
  aiError.value = ''
  aiFood.value = null
})

async function ask() {
  const p = profile.profile
  const name = query.value.trim()
  if (!p?.ai || !name) return
  const id = ++requestId
  asking.value = true
  aiError.value = ''
  aiFood.value = { name, level: null, reason: '', effect: '', advice: '' }
  try {
    const status = getStatus(p.dueDate, today.value)
    const sys = buildFoodSystemPrompt({ week: status.week, day: status.day, trimester: status.trimester, exclusions: p.exclusions })
    await askAi(p.ai, sys, `请判断这个食物：${name}`, fetch, (transcript) => {
      if (id !== requestId) return
      const parsed = parseFoodAnswer(transcript.content)
      aiFood.value = { name, ...parsed }
    })
    if (id === requestId && !aiFood.value?.level) aiError.value = '没有判断出来，换个更具体的食物名再试一次'
  } catch (e) {
    if (id === requestId) aiError.value = e instanceof AiError ? e.message : '出了点问题，请稍后再试'
  } finally {
    if (id === requestId) asking.value = false
  }
}
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">这个能不能吃？</h1>
    <input v-model="query" class="search" type="search" placeholder="输入食物名称，比如：螃蟹" />
    <div v-if="!query.trim()" class="chips quick">
      <button v-for="q in quick" :key="q" class="chip" @click="query = q">{{ q }}</button>
    </div>
    <div v-else class="ask-block">
      <div v-if="results.length" class="results">
        <FoodCard v-for="f in results" :key="f.name" :name="f.name" :level="f.level" :reason="f.reason" :advice="f.advice" />
      </div>
      <p v-else class="muted">暂时没有收录「{{ query.trim() }}」</p>
      <button v-if="profile.aiReady" class="btn dark ask" :disabled="asking" @click="ask">
        {{ asking ? '正在问…' : `问 AI「${query.trim()}」能不能吃` }}
      </button>
      <RouterLink v-else to="/me/settings" class="btn dark ask">去设置里填写 API Key，才能问 AI</RouterLink>
      <p v-if="aiError" class="error">{{ aiError }}</p>
      <template v-if="aiFood && (aiFood.level || aiFood.reason || aiFood.effect || aiFood.advice)">
        <FoodCard :name="aiFood.name" :level="aiFood.level" :reason="aiFood.reason" :effect="aiFood.effect" :advice="aiFood.advice" />
        <p class="faint note">由 AI 判断，请以医生意见为准</p>
      </template>
    </div>

    <section class="block">
      <SectionHead title="吃饭这件事" />
      <RouterLink to="/eat/week" class="card entry"><b>一周食谱</b><span>未来 7 天的三餐，可以逐份替换</span></RouterLink>
      <RouterLink to="/eat/shopping" class="card entry"><b>购物清单</b><span>按一周食谱自动整理要买的食材</span></RouterLink>
      <RouterLink to="/eat/ai" class="card entry"><b>AI 问一问</b><span>{{ profile.aiReady ? '有具体问题随时问' : '需要先在设置里填 API Key' }}</span></RouterLink>
    </section>
    <Disclaimer />
  </main>
</template>

<style scoped>
.title { margin: 8px 0 14px; font-family: var(--font-title); font-size: 26px; font-weight: 600; }
.search { width: 100%; height: 50px; padding: 0 18px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); font-size: 15px; box-shadow: var(--shadow); }
.quick { margin-top: 14px; }
.results { display: grid; gap: 10px; }
.ask-block { margin-top: 16px; }
.ask-block .muted { margin: 0; font-size: 14px; }
.ask-block :deep(.food) { margin-top: 12px; }
.ask { margin-top: 12px; height: 44px; padding: 0 18px; text-decoration: none; }
.error { color: var(--alert); font-size: 13.5px; }
.note { margin: 8px 0 0; font-size: 12px; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
</style>
