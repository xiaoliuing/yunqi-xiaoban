<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MarkdownBody from '@/components/MarkdownBody.vue'
import ThinkingNote from '@/components/ThinkingNote.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { assemblePromptContext, buildSystemPrompt, findAvoidMentions } from '@/ai/prompt'
import { askAi, AiError } from '@/ai/client'
import { useRecordsStore } from '@/stores/records'

const { today } = useClock()
const profileStore = useProfileStore()
const records = useRecordsStore()
const question = ref('')
const reasoning = ref('')
const answer = ref('')
const warnings = ref<string[]>([])
const error = ref('')
const loading = ref(false)
const resultEl = useTemplateRef<HTMLElement>('result')
const examples = ['今天孕吐吃不下，有什么推荐？', '晚上饿了吃什么不容易胖？', '贫血的话一周怎么安排补铁？']

const ready = computed(() => profileStore.aiReady)

async function send() {
  const p = profileStore.profile
  if (!p?.ai || !question.value.trim()) return
  loading.value = true
  error.value = ''
  reasoning.value = ''
  answer.value = ''
  try {
    await Promise.all([records.loadCheckups(), records.loadWeights(), records.loadSupplements(today.value)])
    const sys = buildSystemPrompt(assemblePromptContext({
      dueDate: p.dueDate,
      today: today.value,
      heightCm: p.heightCm,
      preWeightKg: p.preWeightKg,
      exclusions: p.exclusions,
      hospital: p.hospital,
      supplementIds: p.supplementIds,
      checkupOverrides: records.checkupOverrides,
      weights: records.weights,
      supplementsTaken: records.supplementsTaken[today.value] ?? [],
    }))
    await askAi(p.ai, sys, question.value.trim(), fetch, (transcript) => {
      const first = !reasoning.value && !answer.value
      reasoning.value = transcript.reasoning
      answer.value = transcript.content
      warnings.value = findAvoidMentions(transcript.content)
      if (first) nextTick(() => resultEl.value?.scrollIntoView({ block: 'nearest' }))
    })
  } catch (e) {
    error.value = e instanceof AiError ? e.message : '出了点问题，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <PageHeader title="AI 问一问" />
    <div v-if="!ready" class="card notice">
      还没有配置 AI。去 <RouterLink to="/me/settings">设置</RouterLink> 填写接口地址和 API Key 后就能使用。
    </div>
    <template v-else>
      <textarea v-model="question" class="q" placeholder="想问什么都可以，比如今天吃什么" />
      <div class="chips">
        <button v-for="e in examples" :key="e" class="chip" @click="question = e">{{ e }}</button>
      </div>
      <button class="btn dark block-btn send" :disabled="loading || !question.trim()" @click="send">
        {{ loading ? (answer ? '回答中…' : '思考中…') : '提问' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <div v-if="reasoning || answer" ref="result" class="result">
        <ThinkingNote v-if="reasoning" :text="reasoning" :live="loading && !answer" />
        <article v-if="answer" class="card answer">
          <p v-if="warnings.length" class="warn">回答里提到了孕期应避免的食物：{{ warnings.join('、') }}，请以「能不能吃」里的说明为准。</p>
          <MarkdownBody :source="answer" />
          <span v-if="loading" class="caret" aria-hidden="true" />
          <p class="faint foot">AI 回答仅供参考，请以医生意见为准</p>
        </article>
      </div>
    </template>
  </main>
</template>

<style scoped>
.notice { padding: 16px; font-size: 14px; line-height: 1.6; }
.notice a { color: var(--apricot); }
.q { width: 100%; height: 110px; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--line); background: var(--card); font-size: 15px; resize: vertical; margin-bottom: 12px; }
.send { margin-top: 16px; height: 46px; }
.error { color: var(--alert); font-size: 13.5px; }
.result { margin-top: 18px; display: grid; gap: 10px; }
.answer { padding: 16px; }
.warn { margin: 0 0 12px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--alert-soft); color: var(--alert); font-size: 13px; }
.caret {
  display: inline-block; width: 2px; height: 1em; margin-left: 2px;
  background: var(--apricot); vertical-align: text-bottom;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .caret { animation: none; } }
.foot { margin: 12px 0 0; font-size: 12px; }
</style>
