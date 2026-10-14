<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { RED_FLAGS } from '@/content/redflags'

const emergency = RED_FLAGS.filter((r) => r.level === 'emergency')
const soon = RED_FLAGS.filter((r) => r.level === 'soon')
</script>

<template>
  <main class="page">
    <PageHeader title="危险信号" />
    <a href="tel:120" class="call">紧急情况，拨打 120</a>
    <h2 class="em">出现以下情况，立即去医院</h2>
    <article v-for="r in emergency" :key="r.id" class="card flag em-card">
      <b>{{ r.symptom }}</b><p>{{ r.detail }}</p>
    </article>
    <h2>尽快就诊或联系产检医生</h2>
    <article v-for="r in soon" :key="r.id" class="card flag">
      <b>{{ r.symptom }}</b><p>{{ r.detail }}</p>
    </article>
    <p class="faint foot">不确定时，宁可多跑一趟医院。</p>
  </main>
</template>

<style scoped>
.call { display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 999px; background: var(--alert); color: #fff; font-size: 16px; font-weight: 700; text-decoration: none; }
h2 { margin: 26px 0 10px; font-family: var(--font-title); font-size: 16px; }
h2.em { color: var(--alert); }
.flag { padding: 14px 16px; margin-bottom: 8px; }
.em-card { border-left: 4px solid var(--alert); }
.flag b { font-size: 15px; }
.flag p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.foot { text-align: center; font-size: 12.5px; margin-top: 20px; }
</style>
