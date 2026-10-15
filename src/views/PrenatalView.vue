<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { getStatus } from '@/core/pregnancy'
import { PRENATAL_MYTHS, PRENATAL_SOURCES, PRENATAL_STAGES, stageForWeek } from '@/content/prenatal'

const { today } = useClock()
const profile = useProfileStore()
const listEl = useTemplateRef<HTMLOListElement>('list')
const week = computed(() => getStatus(profile.profile!.dueDate, today.value).week)
const current = computed(() => stageForWeek(week.value))

onMounted(async () => {
  await nextTick()
  listEl.value?.querySelector('.now')?.scrollIntoView({ block: 'center' })
})
</script>

<template>
  <main class="page">
    <PageHeader title="胎教" />
    <p class="lead">胎教不是让宝宝变聪明的课。能站得住的证据是：孕晚期宝宝会熟悉妈妈的声音，以及反复听过的韵律。更早的时候，对大脑更要紧的是营养、睡眠，还有避开烟酒。</p>

    <section class="card now-card">
      <div class="kicker">孕 {{ week }} 周 · 现在可以做的</div>
      <h2>{{ current.title }}</h2>
      <p>{{ current.summary }}</p>
    </section>

    <ol ref="list" class="stages">
      <li v-for="s in PRENATAL_STAGES" :key="s.id" class="stage" :class="{ now: s.id === current.id }">
        <div class="rail" aria-hidden="true"><span class="dot" /></div>
        <article class="card body">
          <div class="range">孕 {{ s.fromWeek }}–{{ s.toWeek > 40 ? 40 : s.toWeek }} 周</div>
          <h3>{{ s.title }}</h3>
          <p class="senses">{{ s.senses }}</p>
          <ul>
            <li v-for="p in s.practices" :key="p.title"><b>{{ p.title }}</b>{{ p.detail }}</li>
          </ul>
          <p class="basis">{{ s.basis }}</p>
        </article>
      </li>
    </ol>

    <section class="block">
      <h2 class="h">这些说法没有依据</h2>
      <article v-for="m in PRENATAL_MYTHS" :key="m.claim" class="card myth">
        <b>{{ m.claim }}</b>
        <p>{{ m.fact }}</p>
      </article>
    </section>

    <section class="block">
      <h2 class="h">依据从哪来</h2>
      <ul class="sources">
        <li v-for="s in PRENATAL_SOURCES" :key="s.title"><b>{{ s.title }}</b>{{ s.detail }}</li>
      </ul>
    </section>
    <Disclaimer />
  </main>
</template>

<style scoped>
.lead { margin: 0 0 16px; font-size: 14px; line-height: 1.7; color: var(--ink-soft); }
.now-card { padding: 16px 18px; background: var(--butter); border-color: transparent; }
.kicker { font-size: 12px; letter-spacing: .06em; color: var(--butter-ink); }
.now-card h2 { margin: 6px 0 8px; font-family: var(--font-title); font-size: 22px; font-weight: 600; }
.now-card p { margin: 0; font-size: 14.5px; line-height: 1.7; }
.stages { list-style: none; margin: 22px 0 0; padding: 0; }
.stage { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 12px; }
.stage + .stage { margin-top: 14px; }
.rail { position: relative; }
.rail::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 18px;
  bottom: -14px;
  width: 2px;
  transform: translateX(-50%);
  background: var(--line);
}
.stage:last-child .rail::before { display: none; }
.dot {
  position: relative;
  z-index: 1;
  display: block;
  width: 12px;
  height: 12px;
  margin: 16px auto 0;
  border-radius: 50%;
  border: 2px solid var(--line);
  background: var(--card);
  box-sizing: border-box;
}
.stage.now .dot { background: var(--apricot); border-color: var(--apricot); box-shadow: 0 0 0 5px var(--apricot-soft); }
.body { padding: 14px 16px; }
.stage.now .body { border-color: var(--apricot); }
.range { font-size: 12px; color: var(--ink-faint); letter-spacing: .04em; }
.body h3 { margin: 4px 0 8px; font-family: var(--font-title); font-size: 17px; font-weight: 600; }
.senses, .basis, .myth p, .sources li { margin: 0; font-size: 13.5px; line-height: 1.65; color: var(--ink-soft); }
.body ul { margin: 10px 0 0; padding-left: 18px; }
.body li { margin: 6px 0; font-size: 14px; line-height: 1.65; }
.body li b { font-weight: 650; }
.body li b::after { content: "。"; }
.basis { margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--line); }
.block { margin-top: 28px; }
.h { margin: 0 0 10px; font-family: var(--font-title); font-size: 18px; font-weight: 600; }
.myth { padding: 14px 16px; margin-bottom: 10px; }
.myth b { display: block; margin-bottom: 4px; font-size: 14.5px; }
.sources { margin: 0; padding-left: 18px; }
.sources li { margin: 8px 0; }
.sources b { display: block; color: var(--ink); font-weight: 650; }
</style>
