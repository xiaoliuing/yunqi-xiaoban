import { ref } from 'vue'
import { todayStr } from '@/core/date'

const today = ref(todayStr())
const hour = ref(new Date().getHours())
let started = false

function tick() {
  const now = new Date()
  today.value = todayStr(now)
  hour.value = now.getHours()
}

export function useClock() {
  if (!started && typeof window !== 'undefined') {
    started = true
    tick()
    setInterval(tick, 60_000)
    document.addEventListener('visibilitychange', tick)
  }
  return { today, hour, tick }
}
