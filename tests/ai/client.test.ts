import { describe, it, expect, vi } from 'vitest'
import { askAi, AiError } from '@/ai/client'

const settings = { baseUrl: 'https://api.example.com/v1/', apiKey: 'sk-1', model: 'm' }

describe('askAi', () => {
  it('posts a chat completion and returns the answer', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    const answer = await askAi(settings, 'sys', '问题', fetchImpl)
    expect(answer).toBe('答案')
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/chat/completions')
    expect(init.headers.Authorization).toBe('Bearer sk-1')
    expect(JSON.parse(init.body).messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: '问题' },
    ])
  })

  it('maps 401 to a friendly error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toThrow('API Key 无效')
  })

  it('maps network failures to a friendly error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toBeInstanceOf(AiError)
  })
})
