import { describe, it, expect, vi } from 'vitest'
import { askAi, AiError, deltaFromSseLine } from '@/ai/client'
import { contextTokensOf, DEFAULT_CONTEXT_TOKENS } from '@/db'

const settings = { baseUrl: 'https://api.example.com/v1/', apiKey: 'sk-1', model: 'm' }

describe('askAi', () => {
  it('posts a chat completion and returns the answer', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    const answer = await askAi(settings, 'sys', '问题', fetchImpl)
    expect(answer).toBe('答案')
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/chat/completions')
    expect(init.headers.Authorization).toBe('Bearer sk-1')
    const body = JSON.parse(init.body)
    expect(body.stream).toBe(true)
    expect(body.max_tokens).toBe(DEFAULT_CONTEXT_TOKENS)
    expect(body.messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: '问题' },
    ])
  })

  it('renders text as server-sent chunks arrive', async () => {
    const encoder = new TextEncoder()
    const parts = [
      'data: {"choices":[{"delta":{"content":"今天"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"**吃粥**"}}]}\n\n',
      'data: [DONE]\n\n',
    ]
    let i = 0
    const stream = new ReadableStream({
      pull(controller) {
        if (i >= parts.length) controller.close()
        else controller.enqueue(encoder.encode(parts[i++]))
      },
    })
    const seen: string[] = []
    const fetchImpl = vi.fn().mockResolvedValue(new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } }))
    const answer = await askAi(settings, 's', 'q', fetchImpl, (transcript) => seen.push(transcript.content))
    expect(seen).toEqual(['今天', '今天**吃粥**'])
    expect(answer).toBe('今天**吃粥**')
  })

  it('keeps reasoning separate from the answer while streaming', async () => {
    const encoder = new TextEncoder()
    const parts = [
      'data: {"choices":[{"delta":{"reasoning_content":"先看孕周"}}]}\n\n',
      'data: {"choices":[{"delta":{"reasoning_content":"，再给吃法"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"可以喝粥"}}]}\n\n',
      'data: [DONE]\n\n',
    ]
    let i = 0
    const stream = new ReadableStream({
      pull(controller) {
        if (i >= parts.length) controller.close()
        else controller.enqueue(encoder.encode(parts[i++]))
      },
    })
    const seen: { reasoning: string; content: string }[] = []
    const fetchImpl = vi.fn().mockResolvedValue(new Response(stream, { status: 200 }))
    const answer = await askAi(settings, 's', 'q', fetchImpl, (transcript) => seen.push({ ...transcript }))
    expect(seen.map((item) => item.reasoning)).toEqual(['先看孕周', '先看孕周，再给吃法', '先看孕周，再给吃法'])
    expect(seen.map((item) => item.content)).toEqual(['', '', '可以喝粥'])
    expect(answer).toBe('可以喝粥')
  })

  it('pulls think tags out of the answer text', async () => {
    const body = JSON.stringify({
      choices: [{ message: { content: '<think>核对忌口</think>\n\n今天吃面条。' } }],
    })
    const seen: { reasoning: string; content: string }[] = []
    const fetchImpl = vi.fn().mockResolvedValue(new Response(body, { status: 200 }))
    const answer = await askAi(settings, 's', 'q', fetchImpl, (transcript) => seen.push({ ...transcript }))
    expect(seen).toEqual([{ reasoning: '核对忌口', content: '今天吃面条。' }])
    expect(answer).toBe('今天吃面条。')
  })

  it('maps 401 to a friendly error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toThrow('API Key 无效')
  })

  it('ignores the done marker and blank deltas', () => {
    expect(deltaFromSseLine('data: [DONE]')).toBe('')
    expect(deltaFromSseLine('data: {"choices":[{"delta":{}}]}')).toBe('')
    expect(deltaFromSseLine(': ping')).toBeNull()
  })

  it('treats a dropped stream that never wrote an answer as a network break', async () => {
    const encoder = new TextEncoder()
    let sent = false
    const stream = new ReadableStream({
      pull(controller) {
        if (!sent) {
          sent = true
          controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"reasoning_content":"先想菜单"}}]}\n\n'))
          return
        }
        controller.error(new DOMException('The operation was aborted', 'AbortError'))
      },
    })
    const fetchImpl = vi.fn().mockResolvedValue(new Response(stream, { status: 200 }))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toThrow('网络中断了')
  })

  it('keeps a partial answer when the stream breaks after the text has started', async () => {
    const encoder = new TextEncoder()
    let sent = false
    const stream = new ReadableStream({
      pull(controller) {
        if (!sent) {
          sent = true
          controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"{\\"breakfast\\":"}}]}\n\n'))
          return
        }
        controller.error(new TypeError('network'))
      },
    })
    const fetchImpl = vi.fn().mockResolvedValue(new Response(stream, { status: 200 }))
    await expect(askAi(settings, 's', 'q', fetchImpl)).resolves.toBe('{"breakfast":')
  })

  it('gives the meal call enough room to finish after thinking', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    await askAi(settings, 'sys', '问题', fetchImpl, undefined, { maxTokens: 65_536, reasoningEffort: 'low' })
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body)
    expect(body.max_tokens).toBe(65536)
    expect(body.reasoning_effort).toBe('low')
    expect(fetchImpl.mock.calls[0][1].signal).toBeUndefined()
  })

  it('sends the configured context length as the output budget', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    await askAi({ ...settings, contextTokens: 1_048_576 }, 'sys', '问题', fetchImpl)
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body).max_tokens).toBe(DEFAULT_CONTEXT_TOKENS)
    expect(contextTokensOf(undefined)).toBe(DEFAULT_CONTEXT_TOKENS)
    expect(contextTokensOf({ contextTokens: 100 })).toBe(DEFAULT_CONTEXT_TOKENS)
    expect(contextTokensOf({ contextTokens: 1_048_576 })).toBe(DEFAULT_CONTEXT_TOKENS)
  })

  it('steps a rejected budget down without jumping to the smallest cap', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response('too big', { status: 400 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    const answer = await askAi({ ...settings, contextTokens: DEFAULT_CONTEXT_TOKENS }, 'sys', '问题', fetchImpl)
    expect(answer).toBe('答案')
    const bodies = fetchImpl.mock.calls.map((call) => JSON.parse(call[1].body))
    expect(bodies[0].max_tokens).toBe(DEFAULT_CONTEXT_TOKENS)
    expect(bodies[1].max_tokens).toBe(131_072)
  })

  it('retries without the extra fields when the endpoint rejects them', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response('{"error":{"message":"unknown"}}', { status: 400 }))
      .mockResolvedValueOnce(new Response('{"error":{"message":"too many tokens"}}', { status: 400 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    const answer = await askAi(settings, 'sys', '问题', fetchImpl, undefined, { maxTokens: 65_536, reasoningEffort: 'low' })
    expect(answer).toBe('答案')
    const bodies = fetchImpl.mock.calls.map((call) => JSON.parse(call[1].body))
    expect(bodies[0]).toMatchObject({ max_tokens: 65536, reasoning_effort: 'low' })
    expect(bodies[1].max_tokens).toBe(65536)
    expect(bodies[1].reasoning_effort).toBeUndefined()
    expect(bodies[2]).toMatchObject({ max_tokens: 8192 })
    expect(bodies[2].reasoning_effort).toBeUndefined()
  })

  it('says thinking used up the length when the stream ends there', async () => {
    const encoder = new TextEncoder()
    const parts = [
      'data: {"choices":[{"delta":{"reasoning_content":"先核对熟度"}}]}\n\n',
      'data: {"choices":[{"delta":{},"finish_reason":"length"}]}\n\n',
    ]
    let i = 0
    const stream = new ReadableStream({
      pull(controller) {
        if (i >= parts.length) controller.close()
        else controller.enqueue(encoder.encode(parts[i++]))
      },
    })
    const fetchImpl = vi.fn().mockResolvedValue(new Response(stream, { status: 200 }))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toThrow('把长度用在思考上')
  })

  it('maps network failures to a friendly error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toBeInstanceOf(AiError)
  })
})
