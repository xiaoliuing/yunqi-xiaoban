import { formatCn, type DateStr } from '@/core/date'
import { buildSchedule, type CheckupOverride, type ScheduledCheckup } from '@/core/checkupSchedule'
import { getStatus } from '@/core/pregnancy'
import { assessGain, recommendedGain, bmi } from '@/core/weightGain'
import { FOODS } from '@/content/foods'
import { FOCUS_TAGS, SUPPLEMENTS, TRIMESTER_LABEL } from '@/content/nutrition'
import { getWeekInfo } from '@/content/weeks'
import type { Exclusions, FoodEntry, SupplementId, Trimester, WeekInfo } from '@/content/types'

export interface PromptCheckup {
  date: DateStr
  name: string
  startWeek: number
  endWeek: number
  purpose: string
  fasting: boolean
  fullBladder: boolean
  bring: string[]
  note?: string
  overdue: boolean
}

export interface PromptContext {
  week: number
  day: number
  trimester: Trimester
  exclusions: Exclusions
  dueDate?: DateStr
  daysToDue?: number
  hospital?: string
  heightCm?: number
  preWeightKg?: number
  weekInfo?: Pick<WeekInfo, 'fruit' | 'lengthCm' | 'weightG' | 'baby' | 'mom' | 'tips'>
  focus?: string[]
  supplements?: { name: string; dose: string; timing: string; taken: boolean }[]
  currentCheckups?: PromptCheckup[]
  upcomingCheckups?: PromptCheckup[]
  weight?: { date: DateStr; kg: number; gainKg: number; min: number; max: number; assessment: 'low' | 'normal' | 'high' }
}

const TAG_TEXT: Record<string, string> = { 荤: '肉禽和海鲜（素食）', 蛋: '鸡蛋', 奶: '奶制品' }

const GAIN_TEXT = { low: '低于参考范围', normal: '在参考范围内', high: '高于参考范围' } as const

function checkupLine(c: PromptCheckup): string {
  const when = c.startWeek === c.endWeek ? `孕 ${c.startWeek} 周` : `孕 ${c.startWeek}–${c.endWeek} 周`
  const flags = [c.fasting ? '需空腹' : '', c.fullBladder ? '需憋尿' : '', c.bring.length ? `带${c.bring.join('、')}` : ''].filter(Boolean)
  const timing = c.overdue ? `${formatCn(c.date)}（已过建议日期，若还没做请尽快安排）` : formatCn(c.date)
  return [`${c.name}，建议 ${timing}，${when}`, c.purpose, flags.join('，'), c.note].filter(Boolean).join('。')
}

export function assemblePromptContext(input: {
  dueDate: DateStr
  today: DateStr
  heightCm: number
  preWeightKg: number
  exclusions: Exclusions
  hospital?: string
  supplementIds?: SupplementId[]
  checkupOverrides: CheckupOverride[]
  weights: { date: DateStr; kg: number }[]
  supplementsTaken: SupplementId[]
}): PromptContext {
  const status = getStatus(input.dueDate, input.today)
  const schedule = buildSchedule(input.dueDate, input.checkupOverrides)
  const toPrompt = (c: ScheduledCheckup): PromptCheckup => ({
    date: c.date,
    name: c.name,
    startWeek: c.startWeek,
    endWeek: c.endWeek,
    purpose: c.purpose,
    fasting: c.fasting,
    fullBladder: c.fullBladder,
    bring: c.bring,
    note: c.note,
    overdue: c.date < input.today,
  })
  const inWindow = schedule.filter((c) => !c.done && c.startWeek <= status.week && status.week <= c.endWeek)
  const currentIds = new Set(inWindow.map((c) => c.id))
  const current = inWindow.map(toPrompt)
  const upcoming = schedule.filter((c) => !c.done && c.date >= input.today && !currentIds.has(c.id)).slice(0, 2).map(toPrompt)
  const supplementList = SUPPLEMENTS.filter((s) =>
    input.supplementIds ? input.supplementIds.includes(s.id) : s.trimesters.includes(status.trimester),
  )
  const latest = [...input.weights].filter((w) => w.date <= input.today).sort((a, b) => (a.date < b.date ? -1 : 1)).at(-1)
  const weekInfo = status.week >= 4 && status.week <= 40 ? getWeekInfo(status.week) : undefined
  let weight: PromptContext['weight']
  if (latest) {
    const range = recommendedGain(bmi(input.heightCm, input.preWeightKg), status.week)
    const assessment = assessGain({ heightCm: input.heightCm, preWeightKg: input.preWeightKg }, status.week, latest.kg)
    weight = {
      date: latest.date,
      kg: latest.kg,
      gainKg: Math.round((latest.kg - input.preWeightKg) * 10) / 10,
      min: range.min,
      max: range.max,
      assessment,
    }
  }
  return {
    week: status.week,
    day: status.day,
    trimester: status.trimester,
    exclusions: input.exclusions,
    dueDate: input.dueDate,
    daysToDue: status.daysToDue,
    hospital: input.hospital,
    heightCm: input.heightCm,
    preWeightKg: input.preWeightKg,
    weekInfo,
    focus: FOCUS_TAGS[status.trimester],
    supplements: supplementList.map((s) => ({
      name: s.name,
      dose: s.dose,
      timing: s.timing,
      taken: input.supplementsTaken.includes(s.id),
    })),
    currentCheckups: current,
    upcomingCheckups: upcoming,
    weight,
  }
}

export function buildSystemPrompt(ctx: PromptContext, foods: FoodEntry[] = FOODS): string {
  const avoid = [...ctx.exclusions.tags.map((t) => TAG_TEXT[t] ?? t), ...ctx.exclusions.ingredients]
  const banned = foods.filter((f) => f.level === 'avoid').map((f) => f.name)
  const due = ctx.dueDate
    ? ctx.daysToDue != null && ctx.daysToDue > 0
      ? `预产期 ${formatCn(ctx.dueDate)}，距离预产期还有 ${ctx.daysToDue} 天`
      : `预产期 ${formatCn(ctx.dueDate)}，已经到了预产期`
    : ''
  const body = [ctx.heightCm ? `身高 ${ctx.heightCm} 厘米` : '', ctx.preWeightKg ? `孕前 ${ctx.preWeightKg} 千克` : ''].filter(Boolean).join('，')
  const info = ctx.weekInfo
  const weight = ctx.weight
  return [
    '你是一位温和、专业的孕期营养顾问，用简体中文回答，语言简洁具体。',
    '思考过程也必须使用简体中文，不要用英文或其他语言思考。',
    `用户目前孕 ${ctx.week} 周 ${ctx.day} 天，处于${TRIMESTER_LABEL[ctx.trimester]}${due ? `，${due}` : ''}。`,
    ctx.hospital ? `产检医院：${ctx.hospital}。` : '',
    body ? `${body}。` : '',
    info ? `宝宝现在约 ${info.lengthCm} 厘米、${info.weightG} 克，大小像${info.fruit}。${info.baby}` : '',
    info ? `妈妈这边：${info.mom}` : '',
    info?.tips.length ? `本周留意：${info.tips.map((t) => `${t.title}（${t.detail}）`).join('；')}。` : '',
    ctx.focus?.length ? `本阶段营养重点：${ctx.focus.join('、')}。` : '',
    avoid.length ? `用户忌口：${avoid.join('、')}，推荐时必须避开。` : '',
    ctx.supplements?.length
      ? `正在补充：${ctx.supplements.map((s) => `${s.name} ${s.dose}，${s.timing}（今天${s.taken ? '已吃' : '还没吃'}）`).join('；')}。`
      : '',
    weight
      ? `最近体重 ${weight.kg} 千克（${formatCn(weight.date)}），比孕前 ${weight.gainKg >= 0 ? '增加' : '减少'} ${Math.abs(weight.gainKg)} 千克，本周参考范围 ${weight.min}–${weight.max} 千克，${GAIN_TEXT[weight.assessment]}。`
      : '',
    ctx.currentCheckups?.length ? `当前孕周窗口内还没完成的产检：\n${ctx.currentCheckups.map((c) => `- ${checkupLine(c)}`).join('\n')}` : '',
    ctx.upcomingCheckups?.length ? `接下来的产检：\n${ctx.upcomingCheckups.map((c) => `- ${checkupLine(c)}`).join('\n')}` : '',
    `绝对不要推荐以下孕期应避免的食物：${banned.join('、')}。`,
    '营养建议参考《中国居民膳食指南（2022）》孕期部分，不推荐保健品和药物的具体剂量。',
    '如果用户描述了身体不适或异常症状，先提醒及时就医或联系产检医生，不要给出诊断。',
    '如果用户问胎教：25 周前说明听觉尚未稳定，不要把放音乐说成胎教。孕晚期建议每天 10 到 15 分钟、用正常音量重复说话或哼同一首歌。不要建议耳机或音箱贴在肚子上，不要声称胎教能提高智商。',
    '回答要结合上面的个人资料。产检日期是按预产期推算的建议，实际以医院和医生安排为准。不要编造资料里没有的检查结果或症状。',
    '用 Markdown 排版：小标题、列表，需要强调的词加粗。不要输出 HTML，也不要用代码块包住整段回答。',
  ].filter(Boolean).join('\n')
}

export function findAvoidMentions(text: string, foods: FoodEntry[] = FOODS): string[] {
  return foods
    .filter((f) => f.level === 'avoid')
    .filter((f) => [f.name, ...f.aliases].some((n) => n.length >= 2 && text.includes(n)))
    .map((f) => f.name)
}
