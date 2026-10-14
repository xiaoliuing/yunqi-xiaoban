<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AVOID_OPTIONS } from '@/content/nutrition'
import { validateProfile, type ProfileErrors, type ProfileFormInput, type ProfileValues } from '@/core/profileValidation'
import { useClock } from '@/composables/useClock'

const props = defineProps<{ initial?: Partial<ProfileFormInput>; submitLabel: string }>()
const emit = defineEmits<{ submit: [values: ProfileValues] }>()

const { today } = useClock()
const init = props.initial ?? {}
const form = reactive({
  dateMode: init.dateMode ?? ('due' as ProfileFormInput['dateMode']),
  date: init.date ?? '',
  avoidTags: [...(init.avoidTags ?? [])],
  customAvoid: init.customAvoid ?? '',
  hospital: init.hospital ?? '',
})
const height = ref(init.heightCm ? String(init.heightCm) : '')
const weight = ref(init.preWeightKg ? String(init.preWeightKg) : '')
const errors = ref<ProfileErrors>({})

function toggleTag(tag: string) {
  form.avoidTags = form.avoidTags.includes(tag) ? form.avoidTags.filter((t) => t !== tag) : [...form.avoidTags, tag]
}

function submit() {
  const r = validateProfile({ ...form, heightCm: Number(height.value), preWeightKg: Number(weight.value) }, today.value)
  if (!r.ok) {
    errors.value = r.errors
    return
  }
  errors.value = {}
  emit('submit', r.value)
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="chips mode">
      <button type="button" class="chip" :class="{ on: form.dateMode === 'due' }" @click="form.dateMode = 'due'">我知道预产期</button>
      <button type="button" class="chip" :class="{ on: form.dateMode === 'lmp' }" @click="form.dateMode = 'lmp'">填末次月经</button>
    </div>
    <label class="field">
      <span>{{ form.dateMode === 'due' ? '预产期' : '末次月经第一天' }}</span>
      <input v-model="form.date" type="date" name="date" />
      <div v-if="errors.date" class="error">{{ errors.date }}</div>
    </label>
    <div class="row">
      <label class="field">
        <span>身高（厘米）</span>
        <input v-model="height" type="number" inputmode="decimal" name="height" />
        <div v-if="errors.heightCm" class="error">{{ errors.heightCm }}</div>
      </label>
      <label class="field">
        <span>孕前体重（公斤）</span>
        <input v-model="weight" type="number" inputmode="decimal" step="0.1" name="weight" />
        <div v-if="errors.preWeightKg" class="error">{{ errors.preWeightKg }}</div>
      </label>
    </div>
    <div class="field">
      <span>忌口和过敏</span>
      <div class="chips">
        <button v-for="o in AVOID_OPTIONS" :key="o.tag" type="button" class="chip" :class="{ on: form.avoidTags.includes(o.tag) }" @click="toggleTag(o.tag)">
          {{ o.label }}
        </button>
      </div>
    </div>
    <label class="field">
      <span>其他不吃的食材（用逗号分开，可不填）</span>
      <input v-model="form.customAvoid" name="customAvoid" placeholder="例如：芹菜，茄子" />
    </label>
    <label class="field">
      <span>产检医院（可不填，会写进日历）</span>
      <input v-model="form.hospital" name="hospital" />
    </label>
    <button type="submit" class="btn dark block-btn submit">{{ submitLabel }}</button>
  </form>
</template>

<style scoped>
.mode { margin-top: 4px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.submit { margin-top: 28px; height: 48px; font-size: 15px; }
</style>
