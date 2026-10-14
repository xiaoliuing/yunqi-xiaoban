<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { getStatus } from '@/core/pregnancy'
import { buildSystemPrompt, findAvoidMentions } from '@/ai/prompt'
import { askAi, AiError } from '@/ai/client'

const { today } = useClock()
const profileStore = useProfileStore()
const question = ref('')
const answer = ref('')
const warnings = ref<string[]>([])
const error = ref('')
const loading = ref(false)
const examples = ['今天孕吐吃不下，有什么推荐？', '晚上饿了吃什么不容易胖？', '贫血的话一周怎么安排补铁？']

const ready = computed(() => profileStore.aiReady)

async function send() {
  const p = profileStore.profile
  if (!p?.ai || !question.value.trim()) return
  loading.value = true
  error.value = ''
  answer.value = ''
  try {
    const s = getStatus(p.dueDate, today.value)
    const sys = buildSystemPrompt({ week: s.week, day: s.day, trimester: s.trimester, exclusions: p.exclusions })
    answer.value = await askAi(p.ai, sys, question.value.trim())
    warnings.value = findAvoidMentions(answer.value)
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
        {{ loading ? '思考中…' : '提问' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <article v-if="answer" class="card answer">
        <p v-if="warnings.length" class="warn">回答里提到了孕期应避免的食物：{{ warnings.join('、') }}，请以「能不能吃」里的说明为准。</p>
        <div class="text">{{ answer }}</div>
        <p class="faint foot">AI 回答仅供参考，请以医生意见为准</p>
      </article>
    </template>
  </main>
</template>

<style scoped>
.notice { padding: 16px; font-size: 14px; line-height: 1.6; }
.notice a { color: var(--apricot); }
.q { width: 100%; height: 110px; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--line); background: var(--card); font-size: 15px; resize: vertical; margin-bottom: 12px; }
.send { margin-top: 16px; height: 46px; }
.error { color: var(--alert); font-size: 13.5px; }
.answer { margin-top: 18px; padding: 16px; }
.warn { margin: 0 0 12px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--alert-soft); color: var(--alert); font-size: 13px; }
.text { white-space: pre-wrap; font-size: 14.5px; line-height: 1.75; }
.foot { margin: 12px 0 0; font-size: 12px; }
</style>
