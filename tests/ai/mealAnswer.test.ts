import { describe, it, expect } from 'vitest'
import { buildMealSystemPrompt, isCompleteMenu, parseMealAnswer } from '@/ai/mealAnswer'

const dish = {
  name: '小米粥 · 水煮蛋',
  tip: '蛋黄要凝固',
  tags: ['蛋白质'],
  ingredients: [{ name: '小米', amount: '50g', category: '主食' }],
  steps: ['煮 25 分钟'],
}

describe('meal answer', () => {
  it('tells the model the week, the exclusions and the JSON shape', () => {
    const prompt = buildMealSystemPrompt({
      week: 24,
      day: 3,
      trimester: 2,
      exclusions: { tags: ['辣'], ingredients: ['香菜'] },
      focus: ['补铁', '补钙', 'DHA'],
      currentNames: ['番茄面'],
    })
    expect(prompt).toContain('孕 24 周 3 天')
    expect(prompt).toContain('孕中期')
    expect(prompt).toContain('辣、香菜')
    expect(prompt).toContain('补铁、补钙、DHA')
    expect(prompt).toContain('番茄面')
    expect(prompt).toContain('breakfast')
    expect(prompt).toContain('不要 Markdown')
    expect(prompt).toContain('简体中文')
    expect(prompt).toContain('立刻输出 JSON')
    expect(prompt).toContain('酒')
    expect(prompt).toContain('imagePrompt')
  })

  it('reads finished meals and ignores a slot that is still streaming', () => {
    const text = `{"breakfast":${JSON.stringify(dish)},"snackAm":{"name":"酸奶"`
    const parsed = parseMealAnswer(text)
    expect(parsed.breakfast?.name).toBe('小米粥 · 水煮蛋')
    expect(parsed.breakfast?.ingredients[0].category).toBe('主食')
    expect(parsed.snackAm).toBeUndefined()
    expect(isCompleteMenu(parsed)).toBe(false)
  })

  it('drops tags and categories outside the card format', () => {
    const odd = {
      ...dish,
      tags: ['补铁', '发物', '上火'],
      ingredients: [{ name: '鸡胸肉', amount: '80g', category: '肉' }],
    }
    const parsed = parseMealAnswer(JSON.stringify({ breakfast: odd }))
    expect(parsed.breakfast?.tags).toEqual(['补铁'])
    expect(parsed.breakfast?.ingredients[0].category).toBe('肉禽')
  })

  it('keeps the english picture note and ignores a made-up image field', () => {
    const parsed = parseMealAnswer(JSON.stringify({ breakfast: { ...dish, imagePrompt: 'one white bowl of porridge', image: 'data:image/jpeg;base64,aa' } }))
    expect(parsed.breakfast?.imagePrompt).toBe('one white bowl of porridge')
    expect(parsed.breakfast?.image).toBeUndefined()
  })
})