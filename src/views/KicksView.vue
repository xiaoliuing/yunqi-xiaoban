<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getDb, plain, type KickSession } from '@/db'
import { assessKickSession, countKicks, KICK_TARGET } from '@/core/kickCounter'

const session = ref<KickSession | null>(null)
const history = ref<KickSession[]>([])
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

async function load() {
  const all = await getDb().kickSessions.orderBy('startedAt').reverse().limit(10).toArray()
  session.value = all.find((s) => !s.endedAt) ?? null
  history.value = all.filter((s) => s.endedAt)
}

onMounted(async () => {
  await load()
  timer = setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => clearInterval(timer))

const result = computed(() => session.value && assessKickSession(session.value.startedAt, session.value.taps, now.value))
const mmss = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`

async function start() {
  const s: KickSession = { startedAt: Date.now(), taps: [] }
  s.id = await getDb().kickSessions.add(s)
  session.value = s
}

async function tap() {
  if (!session.value) return
  session.value = { ...session.value, taps: [...session.value.taps, Date.now()] }
  await getDb().kickSessions.put(plain(session.value))
}

async function finish() {
  if (!session.value) return
  await getDb().kickSessions.put(plain({ ...session.value, endedAt: Date.now() }))
  await load()
}
</script>

<template>
  <main class="page">
    <PageHeader title="数胎动" />
    <p class="muted intro">选一个宝宝常动的时间，侧躺或坐着。5 分钟内连续的动算 1 次，2 小时内满 {{ KICK_TARGET }} 次就可以结束。</p>
    <template v-if="session && result">
      <div class="counter">
        <strong>{{ result.count }}</strong><span>/ {{ KICK_TARGET }} 次</span>
        <small>剩余 {{ mmss(result.remainingMs) }}</small>
      </div>
      <button class="tap" @click="tap">动了一下</button>
      <p v-if="result.state === 'done'" class="ok">已经满 {{ KICK_TARGET }} 次，宝宝很活跃</p>
      <p v-if="result.state === 'low'" class="alert">2 小时内不足 {{ KICK_TARGET }} 次，请尽快去医院做胎心监护</p>
      <button class="btn light block-btn" @click="finish">结束本次</button>
    </template>
    <button v-else class="btn dark block-btn startbtn" @click="start">开始计数</button>
    <h2 v-if="history.length">最近记录</h2>
    <ul class="list">
      <li v-for="h in history" :key="h.id">
        <span>{{ new Date(h.startedAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
        <b>{{ countKicks(h.taps) }} 次</b>
        <span class="faint">{{ Math.round((h.endedAt! - h.startedAt) / 60000) }} 分钟</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.intro { font-size: 13px; line-height: 1.6; margin: 0 0 20px; }
.counter { text-align: center; }
.counter strong { font-family: var(--font-display); font-size: 96px; line-height: 1; }
.counter span { font-size: 16px; color: var(--ink-soft); margin-left: 4px; }
.counter small { display: block; margin-top: 6px; color: var(--ink-faint); font-family: var(--font-display); font-size: 15px; }
.tap { display: block; margin: 22px auto; width: 180px; height: 180px; border-radius: 50%; border: 0; background: var(--apricot); color: #fff; font-size: 20px; font-weight: 700; box-shadow: 0 12px 30px -10px rgba(224, 122, 79, .6); }
.tap:active { transform: scale(.96); }
.ok, .alert { text-align: center; padding: 10px; border-radius: var(--radius-sm); font-size: 14px; }
.ok { background: var(--sage-soft); color: var(--sage-ink); }
.alert { background: var(--alert-soft); color: var(--alert); font-weight: 600; }
.startbtn { height: 52px; }
h2 { margin: 28px 0 8px; font-family: var(--font-title); font-size: 16px; }
.list { list-style: none; padding: 0; margin: 0; }
.list li { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 10px 2px; border-bottom: 1px solid var(--line); font-size: 13.5px; }
</style>
