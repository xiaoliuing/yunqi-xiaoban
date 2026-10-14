import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDb, initDb, plain, type AiSettings, type Profile } from '@/db'
import type { ProfileValues } from '@/core/profileValidation'
import type { SupplementId } from '@/content/types'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const loaded = ref(false)
  const persistent = ref(true)

  async function load() {
    if (loaded.value) return
    persistent.value = (await initDb()).persistent
    profile.value = (await getDb().profile.get('me')) ?? null
    loaded.value = true
  }

  async function reload() {
    profile.value = (await getDb().profile.get('me')) ?? null
  }

  async function write(next: Profile) {
    await getDb().profile.put(plain(next))
    profile.value = next
  }

  async function saveBasics(values: ProfileValues) {
    const base = profile.value ?? ({ id: 'me', createdAt: Date.now() } as Profile)
    const next: Profile = { ...base, ...values, id: 'me' }
    if (!values.hospital) delete next.hospital
    await write(next)
  }

  async function saveSupplements(ids: SupplementId[] | undefined) {
    if (!profile.value) return
    const next = { ...profile.value }
    if (ids) next.supplementIds = ids
    else delete next.supplementIds
    await write(next)
  }

  async function saveAi(ai: AiSettings | undefined) {
    if (!profile.value) return
    const next = { ...profile.value }
    if (ai) next.ai = ai
    else delete next.ai
    await write(next)
  }

  const aiReady = computed(() => !!profile.value?.ai?.apiKey && !!profile.value.ai.baseUrl)

  return { profile, loaded, persistent, aiReady, load, reload, saveBasics, saveSupplements, saveAi }
})
