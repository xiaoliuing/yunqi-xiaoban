import { FOODS } from '@/content/foods'
import { TRIMESTER_LABEL } from '@/content/nutrition'
import type { Exclusions, FoodEntry, Trimester } from '@/content/types'

export interface PromptContext {
  week: number
  day: number
  trimester: Trimester
  exclusions: Exclusions
}

const TAG_TEXT: Record<string, string> = { 荤: '肉禽和海鲜（素食）', 蛋: '鸡蛋', 奶: '奶制品' }

export function buildSystemPrompt(ctx: PromptContext, foods: FoodEntry[] = FOODS): string {
  const avoid = [...ctx.exclusions.tags.map((t) => TAG_TEXT[t] ?? t), ...ctx.exclusions.ingredients]
  const banned = foods.filter((f) => f.level === 'avoid').map((f) => f.name)
  return [
    '你是一位温和、专业的孕期营养顾问，用简体中文回答，语言简洁具体。',
    `用户目前孕 ${ctx.week} 周 ${ctx.day} 天，处于${TRIMESTER_LABEL[ctx.trimester]}。`,
    avoid.length ? `用户忌口：${avoid.join('、')}，推荐时必须避开。` : '',
    `绝对不要推荐以下孕期应避免的食物：${banned.join('、')}。`,
    '营养建议参考《中国居民膳食指南（2022）》孕期部分，不推荐保健品和药物的具体剂量。',
    '如果用户描述了身体不适或异常症状，先提醒及时就医或联系产检医生，不要给出诊断。',
  ].filter(Boolean).join('\n')
}

export function findAvoidMentions(text: string, foods: FoodEntry[] = FOODS): string[] {
  return foods
    .filter((f) => f.level === 'avoid')
    .filter((f) => [f.name, ...f.aliases].some((n) => n.length >= 2 && text.includes(n)))
    .map((f) => f.name)
}
