<script setup lang="ts">
import { useRouter } from 'vue-router'
import ProfileForm from '@/components/ProfileForm.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useProfileStore } from '@/stores/profile'
import type { ProfileValues } from '@/core/profileValidation'

const router = useRouter()
const profile = useProfileStore()

async function onSubmit(values: ProfileValues) {
  await profile.saveBasics(values)
  await router.replace('/')
}
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <p class="faint kicker rise d1">孕期小伴</p>
    <h1 class="title rise d1">先认识一下你</h1>
    <p class="muted lead rise d2">只需要 1 分钟。所有信息只保存在这台手机上。</p>
    <div class="rise d3">
      <ProfileForm submit-label="开始使用" @submit="onSubmit" />
    </div>
    <Disclaimer />
  </main>
</template>

<style scoped>
.kicker { margin: 12px 0 0; font-size: 13px; letter-spacing: .1em; }
.title { margin: 6px 0 0; font-family: var(--font-title); font-size: 28px; font-weight: 600; }
.lead { margin: 8px 0 12px; font-size: 14px; }
</style>
