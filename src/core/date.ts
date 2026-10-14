export type DateStr = string

const DAY_MS = 86_400_000

export function parseDate(s: DateStr): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) throw new Error(`无效日期：${s}`)
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function formatDate(ms: number): DateStr {
  return new Date(ms).toISOString().slice(0, 10)
}

export function addDays(s: DateStr, n: number): DateStr {
  return formatDate(parseDate(s) + n * DAY_MS)
}

export function diffDays(a: DateStr, b: DateStr): number {
  return Math.round((parseDate(a) - parseDate(b)) / DAY_MS)
}

export function todayStr(now: Date = new Date()): DateStr {
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

export function formatCn(s: DateStr): string {
  const [, m, d] = s.split('-')
  return `${Number(m)}月${Number(d)}日`
}

export function weekdayCn(s: DateStr): string {
  return '周' + '日一二三四五六'[new Date(parseDate(s)).getUTCDay()]
}

export function greeting(hour: number): string {
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}
