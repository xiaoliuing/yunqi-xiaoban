<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionHead from '@/components/SectionHead.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { searchFoods } from '@/core/foodSearch'
import { useProfileStore } from '@/stores/profile'
import type { FoodLevel } from '@/content/types'

const profile = useProfileStore()
const query = ref('')
const results = computed(() => searchFoods(query.value))
const LEVEL: Record<FoodLevel, { label: string; cls: string }> = {
  ok: { label: '可以吃', cls: 'ok' },
  caution: { label: '适量吃', cls: 'caution' },
  avoid: { label: '避免', cls: 'avoid' },
}
const quick = ['螃蟹', '咖啡', '西瓜', '山楂', '生鱼片', '冰淇淋']
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">这个能不能吃？</h1>
    <input v-model="query" class="search" type="search" placeholder="输入食物名称，比如：螃蟹" />
    <div v-if="!query" class="chips quick">
      <button v-for="q in quick" :key="q" class="chip" @click="query = q">{{ q }}</button>
    </div>
    <div v-else-if="results.length" class="results">
      <article v-for="f in results" :key="f.name" class="card food">
        <header><b>{{ f.name }}</b><span class="level" :class="LEVEL[f.level].cls">{{ LEVEL[f.level].label }}</span></header>
        <p>{{ f.reason }}</p>
        <p class="advice">{{ f.advice }}</p>
      </article>
    </div>
    <p v-else class="muted empty">暂时没有收录「{{ query }}」<template v-if="profile.aiReady">，可以去问问 AI</template></p>

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
.results { margin-top: 14px; display: grid; gap: 10px; }
.food { padding: 14px 16px; }
.food header { display: flex; justify-content: space-between; align-items: center; }
.food b { font-size: 16px; }
.food p { margin: 8px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.food .advice { color: var(--ink); }
.level { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.level.ok { background: var(--sage-soft); color: var(--sage-ink); }
.level.caution { background: var(--butter); color: var(--butter-ink); }
.level.avoid { background: var(--alert-soft); color: var(--alert); }
.empty { margin-top: 16px; font-size: 14px; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
</style>
