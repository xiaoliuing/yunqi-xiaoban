import { describe, expect, it } from 'vitest'
import { fallbackScene, requestMealImage, styleImagePrompt } from '@/ai/mealImage'

describe('meal image prompt', () => {
  it('keeps the cartoon look and drops words that get drawn by mistake', () => {
    const prompt = styleImagePrompt('never a pumpkin or a raw yolk on rice')
    expect(prompt.startsWith('Bold cartoon')).toBe(true)
    expect(prompt).toContain('pale cool white')
    expect(prompt).toContain('soft orange pieces')
    expect(prompt).toContain('solid yellow center')
    expect(prompt).toContain('grains')
    expect(prompt).not.toMatch(/\b(never|pumpkin|yolk|rice|raw|not|no)\b/i)
  })

  it('describes one, two, or three dishes when the model skips the picture note', () => {
    expect(fallbackScene('苹果')).toContain('one white bowl')
    expect(fallbackScene('白粥 · 蒸蛋')).toContain('Left half')
    expect(fallbackScene('番茄炖牛腩 · 杂粮饭 · 蒜蓉西兰花')).toContain('Center')
  })

  it('retries when the drawing service is busy', async () => {
    let calls = 0
    const fetchImpl = async () => {
      calls += 1
      if (calls === 1) return new Response(JSON.stringify({ message: '绘图排队中', statusCode: 1002 }), { status: 429 })
      return new Response(JSON.stringify({ dataUrl: 'data:image/jpeg;base64,aa' }), { status: 200 })
    }
    const url = await requestMealImage('one white bowl of porridge', fetchImpl, async () => {})
    expect(url).toBe('data:image/jpeg;base64,aa')
    expect(calls).toBe(2)
  })
})
