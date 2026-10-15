<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ProfileForm from '@/components/ProfileForm.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useMealsStore } from '@/stores/meals'
import { useRecordsStore } from '@/stores/records'
import { SUPPLEMENTS } from '@/content/nutrition'
import { exportBackup, importBackup, parseBackup, BackupError } from '@/db/backup'
import { downloadFile } from '@/utils/download'
import type { ProfileValues } from '@/core/profileValidation'
import type { SupplementId } from '@/content/types'
import { contextTokensOf, DEFAULT_CONTEXT_TOKENS } from '@/db'

const { today } = useClock()
const profileStore = useProfileStore()
const meals = useMealsStore()
const records = useRecordsStore()
const p = computed(() => profileStore.profile!)
const message = ref('')

const initial = computed(() => ({
  dateMode: 'due' as const,
  date: p.value.dueDate,
  heightCm: p.value.heightCm,
  preWeightKg: p.value.preWeightKg,
  avoidTags: [...p.value.exclusions.tags],
  customAvoid: p.value.exclusions.ingredients.join('，'),
  hospital: p.value.hospital ?? '',
}))

async function saveBasics(values: ProfileValues) {
  const exclusionsChanged = JSON.stringify(values.exclusions) !== JSON.stringify(p.value.exclusions)
  const dueChanged = values.dueDate !== p.value.dueDate
  await profileStore.saveBasics(values)
  if (exclusionsChanged || dueChanged) await meals.resetFrom(today.value)
  message.value = '已保存'
}

const customSupps = ref(!!p.value.supplementIds)
const suppIds = ref<SupplementId[]>(p.value.supplementIds ?? SUPPLEMENTS.map((s) => s.id))
async function saveSupps() {
  await profileStore.saveSupplements(customSupps.value ? suppIds.value : undefined)
  message.value = '补剂设置已保存'
}

const ai = reactive({
  baseUrl: p.value.ai?.baseUrl ?? '',
  apiKey: p.value.ai?.apiKey ?? '',
  model: p.value.ai?.model ?? '',
  contextTokens: contextTokensOf(p.value.ai),
})
async function saveAi() {
  const filled = ai.baseUrl.trim() && ai.apiKey.trim() && ai.model.trim()
  await profileStore.saveAi(
    filled
      ? { baseUrl: ai.baseUrl.trim(), apiKey: ai.apiKey.trim(), model: ai.model.trim(), contextTokens: contextTokensOf(ai) }
      : undefined,
  )
  message.value = filled ? 'AI 设置已保存' : '已关闭 AI 问一问'
}

async function doExport() {
  const file = await exportBackup()
  downloadFile(`孕期小伴备份-${today.value}.json`, JSON.stringify(file), 'application/json')
}

async function doImport(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  input.value = ''
  if (!f) return
  try {
    const file = parseBackup(await f.text())
    if (!confirm('导入会覆盖这台手机上的全部记录，确定吗？')) return
    await importBackup(file)
    await profileStore.reload()
    meals.logs = {}
    await Promise.all([records.loadWeights(), records.loadCheckups(), records.loadBag()])
    message.value = '备份已恢复'
  } catch (err) {
    message.value = err instanceof BackupError ? err.message : '导入失败'
  }
}
</script>

<template>
  <main class="page">
    <PageHeader title="设置" />
    <p v-if="message" class="msg" @click="message = ''">{{ message }}</p>

    <section class="card sec">
      <h2>个人资料</h2>
      <ProfileForm :key="p.dueDate + p.exclusions.tags.join()" :initial="initial" submit-label="保存资料" @submit="saveBasics" />
    </section>

    <section class="card sec">
      <h2>补剂</h2>
      <label class="row"><input v-model="customSupps" type="checkbox" /> 只显示我在吃的补剂（默认按孕期显示）</label>
      <div v-if="customSupps" class="chips">
        <label v-for="s in SUPPLEMENTS" :key="s.id" class="chip" :class="{ on: suppIds.includes(s.id) }">
          <input v-model="suppIds" type="checkbox" :value="s.id" hidden />{{ s.name }}
        </label>
      </div>
      <button class="btn light block-btn" @click="saveSupps">保存补剂设置</button>
    </section>

    <section class="card sec">
      <h2>AI 问一问（可选）</h2>
      <p class="muted small">填写兼容 OpenAI 格式的接口。Key 只保存在这台手机上，导出备份时不会包含。</p>
      <label class="field"><span>接口地址</span><input v-model="ai.baseUrl" placeholder="https://api.deepseek.com/v1" /></label>
      <label class="field"><span>API Key</span><input v-model="ai.apiKey" type="password" autocomplete="off" /></label>
      <label class="field"><span>模型名</span><input v-model="ai.model" placeholder="deepseek-chat" /></label>
      <label class="field">
        <span>上下文长度</span>
        <input v-model.number="ai.contextTokens" type="number" min="1024" :max="DEFAULT_CONTEXT_TOKENS" step="1024" inputmode="numeric" :placeholder="String(DEFAULT_CONTEXT_TOKENS)" />
      </label>
      <p class="muted small">默认 {{ DEFAULT_CONTEXT_TOKENS }}。思考和回答都从这里扣。</p>
      <button class="btn light block-btn" @click="saveAi">保存 AI 设置</button>
    </section>

    <section class="card sec">
      <h2>备份</h2>
      <p class="muted small">换手机或清理浏览器前，先导出备份文件。</p>
      <div class="two">
        <button class="btn dark" @click="doExport">导出备份</button>
        <label class="btn light">导入备份<input type="file" accept="application/json,.json" hidden @change="doImport" /></label>
      </div>
    </section>

    <Disclaimer />
  </main>
</template>

<style scoped>
.msg { position: sticky; top: 8px; z-index: 5; padding: 10px 14px; border-radius: var(--radius-sm); background: var(--ink); color: var(--paper); font-size: 13.5px; text-align: center; }
.sec { padding: 16px; margin-bottom: 14px; }
h2 { margin: 0 0 6px; font-family: var(--font-title); font-size: 17px; }
.small { font-size: 12.5px; line-height: 1.6; margin: 0; }
.row { display: flex; gap: 8px; align-items: center; font-size: 14px; margin: 10px 0; }
.chips { margin-bottom: 12px; }
.sec .btn.block-btn { margin-top: 16px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
</style>
