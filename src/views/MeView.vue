<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SectionHead from '@/components/SectionHead.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { getStatus } from '@/core/pregnancy'
import { formatCn } from '@/core/date'

const { today } = useClock()
const profile = useProfileStore()
const records = useRecordsStore()
const week = computed(() => getStatus(profile.profile!.dueDate, today.value).week)
const latest = computed(() => records.weights[records.weights.length - 1])

onMounted(() => records.loadWeights())
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">我的</h1>

    <RouterLink to="/me/weight" class="card entry">
      <b>体重记录</b>
      <span v-if="latest">最近一次 {{ formatCn(latest.date) }}：{{ latest.kg }} 公斤</span>
      <span v-else>还没有记录，每周称一次就好</span>
    </RouterLink>

    <section class="block">
      <SectionHead title="孕晚期工具">
        <template v-if="week < 28">孕 28 周后开放</template>
      </SectionHead>
      <template v-if="week >= 28">
        <RouterLink to="/me/kicks" class="card entry"><b>数胎动</b><span>每天固定时间数一数</span></RouterLink>
        <RouterLink to="/me/contractions" class="card entry"><b>宫缩计时</b><span>判断是不是该去医院了</span></RouterLink>
        <RouterLink to="/me/bag" class="card entry"><b>待产包</b><span>一项项勾选准备</span></RouterLink>
      </template>
      <p v-else class="muted locked">胎动计数、宫缩计时和待产包清单会在孕 28 周后出现在这里。</p>
    </section>

    <section class="block">
      <RouterLink to="/me/settings" class="card entry"><b>设置</b><span>个人资料、忌口、补剂、AI、备份</span></RouterLink>
    </section>
  </main>
</template>

<style scoped>
.title { margin: 8px 0 14px; font-family: var(--font-title); font-size: 26px; font-weight: 600; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
.locked { font-size: 13.5px; line-height: 1.6; }
</style>
