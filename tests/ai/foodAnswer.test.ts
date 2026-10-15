import { describe, it, expect } from 'vitest'
import { buildFoodSystemPrompt, parseFoodAnswer } from '@/ai/foodAnswer'

describe('food answer', () => {
  it('tells the model the week, exclusions and the card shape', () => {
    const prompt = buildFoodSystemPrompt({ week: 24, day: 3, trimester: 2, exclusions: { tags: ['辣'], ingredients: ['香菜'] } })
    expect(prompt).toContain('孕 24 周 3 天')
    expect(prompt).toContain('孕中期')
    expect(prompt).toContain('辣')
    expect(prompt).toContain('香菜')
    expect(prompt).toContain('"level":"avoid"')
    expect(prompt).toContain('不要 Markdown')
    expect(prompt).toContain('发物')
  })

  it('parses a finished answer and a partial stream', () => {
    expect(parseFoodAnswer('{"level":"ok","reason":"补钙的主要来源","advice":"每天一杯"}')).toEqual({
      level: 'ok',
      reason: '补钙的主要来源',
      advice: '每天一杯',
    })
    expect(parseFoodAnswer('{"level":"caution","reason":"要蒸熟才安')).toEqual({
      level: 'caution',
      reason: '要蒸熟才安',
      advice: '',
    })
  })
})