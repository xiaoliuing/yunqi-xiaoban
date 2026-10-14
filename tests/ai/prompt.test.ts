import { describe, it, expect } from 'vitest'
import { buildSystemPrompt, findAvoidMentions } from '@/ai/prompt'
import type { FoodEntry } from '@/content/types'

const foods: FoodEntry[] = [
  { name: '生鱼片', aliases: ['刺身'], level: 'avoid', reason: '', advice: '' },
  { name: '酒', aliases: ['啤酒'], level: 'avoid', reason: '', advice: '' },
  { name: '螃蟹', aliases: [], level: 'caution', reason: '', advice: '' },
]

describe('ai prompt', () => {
  it('includes week, trimester, exclusions and safety rules', () => {
    const p = buildSystemPrompt({ week: 24, day: 3, trimester: 2, exclusions: { tags: ['辣'], ingredients: ['香菜'] } }, foods)
    expect(p).toContain('孕 24 周 3 天')
    expect(p).toContain('孕中期')
    expect(p).toContain('辣、香菜')
    expect(p).toContain('生鱼片')
    expect(p).toContain('就医')
  })

  it('flags avoid-level foods mentioned in answers, ignoring single characters', () => {
    expect(findAvoidMentions('可以吃点刺身和螃蟹', foods)).toEqual(['生鱼片'])
    expect(findAvoidMentions('喝点酒酿圆子', foods)).toEqual([])
    expect(findAvoidMentions('不要喝啤酒', foods)).toEqual(['酒'])
  })
})
