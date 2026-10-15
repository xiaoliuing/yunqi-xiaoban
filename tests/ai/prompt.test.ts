import { describe, it, expect } from 'vitest'
import { assemblePromptContext, buildSystemPrompt, findAvoidMentions } from '@/ai/prompt'
import type { FoodEntry } from '@/content/types'

const foods: FoodEntry[] = [
  { name: '生鱼片', aliases: ['刺身'], level: 'avoid', reason: '', advice: '' },
  { name: '酒', aliases: ['啤酒'], level: 'avoid', reason: '', advice: '' },
  { name: '螃蟹', aliases: [], level: 'caution', reason: '', advice: '' },
]

describe('ai prompt', () => {
  it('includes week, trimester, exclusions and safety rules', () => {
    const p = buildSystemPrompt({ week: 24, day: 3, trimester: 2, exclusions: { tags: ['辣'], ingredients: ['香菜'] } }, foods)
    expect(p).toContain('思考过程也必须使用简体中文')
    expect(p).toContain('孕 24 周 3 天')
    expect(p).toContain('孕中期')
    expect(p).toContain('辣、香菜')
    expect(p).toContain('生鱼片')
    expect(p).toContain('就医')
  })

  it('includes this week, checkups, supplements and weight', () => {
    const ctx = assemblePromptContext({
      dueDate: '2027-01-31',
      today: '2026-10-14',
      heightCm: 160,
      preWeightKg: 55,
      exclusions: { tags: ['辣'], ingredients: [] },
      hospital: '市妇幼',
      supplementIds: ['folate', 'iron'],
      checkupOverrides: [],
      weights: [{ date: '2026-10-01', kg: 60 }],
      supplementsTaken: ['folate'],
    })
    const p = buildSystemPrompt(ctx, foods)
    expect(p).toContain('孕 24 周 3 天')
    expect(p).toContain('市妇幼')
    expect(p).toContain('身高 160 厘米')
    expect(p).toContain('玉米')
    expect(p).toContain('补铁、补钙、DHA')
    expect(p).toContain('叶酸 400μg')
    expect(p).toContain('今天已吃')
    expect(p).toContain('铁 遵医嘱')
    expect(p).toContain('今天还没吃')
    expect(p).toContain('60 千克')
    expect(p).toContain('糖耐量试验（OGTT）')
    expect(p).toContain('需空腹')
    expect(p).toContain('孕 28 周产检')
  })

  it('flags avoid-level foods mentioned in answers, ignoring single characters', () => {
    expect(findAvoidMentions('可以吃点刺身和螃蟹', foods)).toEqual(['生鱼片'])
    expect(findAvoidMentions('喝点酒酿圆子', foods)).toEqual([])
    expect(findAvoidMentions('不要喝啤酒', foods)).toEqual(['酒'])
  })
})
