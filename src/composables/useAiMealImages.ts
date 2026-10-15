import { ref } from 'vue'
import { useMealsStore } from '@/stores/meals'
import { useProfileStore } from '@/stores/profile'
import { PLAN_SLOTS } from '@/core/mealPlanner'
import type { DateStr } from '@/core/date'
import type { PlanSlot } from '@/content/types'
import { AiError } from '@/ai/client'
import { fallbackScene, requestMealImage } from '@/ai/mealImage'

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 按餐次依次画图。换一套菜单或恢复系统推荐时，上一轮会停掉。 */
export function useAiMealImages() {
  const meals = useMealsStore()
  const profile = useProfileStore()
  const paintingSlot = ref<PlanSlot | null>(null)
  const imageErrors = ref<Partial<Record<PlanSlot, string>>>({})
  let token = 0

  function stop() {
    token += 1
    paintingSlot.value = null
  }

  function clearError(slot: PlanSlot) {
    if (!imageErrors.value[slot]) return
    const next = { ...imageErrors.value }
    delete next[slot]
    imageErrors.value = next
  }

  async function paint(date: DateStr, only?: PlanSlot) {
    const mine = ++token
    const slots = only ? [only] : PLAN_SLOTS.map((slot) => slot.key)
    if (only) clearError(only)
    else imageErrors.value = {}
    for (const [index, slot] of slots.entries()) {
      if (mine !== token) return
      const dish = meals.logs[date]?.dishes?.[slot]
      if (!dish || (dish.image && !only)) continue
      paintingSlot.value = slot
      try {
        const ai = profile.profile?.ai
        if (!ai) throw new AiError('请先在设置里填写接口地址和 API Key')
        const dataUrl = await requestMealImage(dish.imagePrompt || fallbackScene(dish.name), ai)
        if (mine !== token) return
        await meals.setDishImage(date, slot, dataUrl)
        clearError(slot)
      } catch (error) {
        if (mine !== token) return
        imageErrors.value = {
          ...imageErrors.value,
          [slot]: error instanceof AiError ? error.message : '这张图没有画出来',
        }
      }
      if (mine === token && index < slots.length - 1) await pause(1200)
    }
    if (mine === token) paintingSlot.value = null
  }

  return { paintingSlot, imageErrors, paint, stop }
}
