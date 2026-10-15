import type { AiSettings } from '@/db'

export class AiError extends Error {}

export interface AiTranscript {
  reasoning: string
  content: string
}

interface StreamNode {
  content?: string | null
  reasoning_content?: string | null
  reasoning?: string | { content?: string; text?: string; summary?: string } | null
  thinking?: string | null
  reasoning_details?: { text?: string; content?: string }[] | null
}

interface StreamChunk {
  error?: { message?: string }
  choices?: { delta?: StreamNode; message?: StreamNode }[]
}

function textOf(value: unknown): string {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  const record = value as { content?: unknown; text?: unknown; summary?: unknown }
  if (typeof record.text === 'string') return record.text
  if (typeof record.content === 'string') return record.content
  if (typeof record.summary === 'string') return record.summary
  return ''
}

function reasoningOf(node: StreamNode | undefined): string {
  if (!node) return ''
  const direct = textOf(node.reasoning_content) || textOf(node.reasoning) || textOf(node.thinking)
  if (direct) return direct
  if (!Array.isArray(node.reasoning_details)) return ''
  return node.reasoning_details.map((item) => textOf(item)).join('')
}

function contentOf(node: StreamNode | undefined): string {
  return node && typeof node.content === 'string' ? node.content : ''
}

/** 把思考字段和正文里的 `<think>` 分开。思考全文每次传入，正文保留末尾空白，避免流式拼接时丢掉换行。 */
export function splitThinking(content: string, aside = ''): AiTranscript {
  const bits: string[] = []
  const add = (text: string) => {
    const trimmed = text.trim()
    if (trimmed && !bits.includes(trimmed)) bits.push(trimmed)
  }
  add(aside)
  let rest = content
  const pull = (pattern: RegExp) => {
    rest = rest.replace(pattern, (_all, inner: string) => {
      add(inner)
      return ''
    })
  }
  pull(/<think>([\s\S]*?)<\/think>/gi)
  pull(/<thinking>([\s\S]*?)<\/thinking>/gi)
  const open = rest.match(/<(?:think|thinking)>([\s\S]*)$/i)
  if (open?.index !== undefined) {
    add(open[1])
    rest = rest.slice(0, open.index)
  }
  return { reasoning: bits.join('\n\n'), content: rest.replace(/^\s+/, '') }
}

/** 解析一行 SSE。不是 data 行返回 null；`[DONE]` 或空增量返回空片段。 */
export function partsFromSseLine(line: string): AiTranscript | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith('data:')) return null
  const data = trimmed.slice(5).trim()
  if (!data || data === '[DONE]') return { reasoning: '', content: '' }
  let json: StreamChunk
  try {
    json = JSON.parse(data) as StreamChunk
  } catch {
    return { reasoning: '', content: '' }
  }
  if (json.error) throw new AiError(json.error.message || '接口返回错误')
  const choice = json.choices?.[0]
  return {
    reasoning: reasoningOf(choice?.delta) || reasoningOf(choice?.message),
    content: contentOf(choice?.delta) || contentOf(choice?.message),
  }
}

/** 解析一行 SSE 的正式回答。思考片段不在这里返回。 */
export function deltaFromSseLine(line: string): string | null {
  const parts = partsFromSseLine(line)
  return parts ? parts.content : null
}

function isTimeout(error: unknown): boolean {
  return error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')
}

function transcriptFromJson(raw: string): AiTranscript {
  const data = JSON.parse(raw) as StreamChunk
  const message = data.choices?.[0]?.message
  return splitThinking(contentOf(message), reasoningOf(message))
}

async function readAnswer(res: Response, onChunk?: (transcript: AiTranscript) => void): Promise<string> {
  if (!res.body) throw new AiError('没有收到回答，请稍后再试')
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let pending = ''
  let raw = ''
  let rawReasoning = ''
  let rawContent = ''
  let sawSse = false

  const emit = () => onChunk?.(splitThinking(rawContent, rawReasoning))

  const takeLine = (line: string) => {
    const parts = partsFromSseLine(line)
    if (parts === null) return
    sawSse = true
    if (!parts.reasoning && !parts.content) return
    rawReasoning += parts.reasoning
    rawContent += parts.content
    emit()
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const piece = decoder.decode(value, { stream: true })
      raw += piece
      pending += piece
      const lines = pending.split(/\r?\n/)
      pending = lines.pop() ?? ''
      for (const line of lines) takeLine(line)
    }
  } catch (error) {
    if (error instanceof AiError) throw error
    const partial = splitThinking(rawContent, rawReasoning).content.trim()
    if (partial) return partial
    if (isTimeout(error)) throw new AiError('回答超时，请稍后再试')
    throw new AiError('网络中断了，请稍后再试')
  }
  const rest = decoder.decode()
  raw += rest
  pending += rest
  if (pending) takeLine(pending)

  let transcript = splitThinking(rawContent, rawReasoning)
  if (!sawSse) {
    try {
      transcript = transcriptFromJson(raw)
    } catch {
      transcript = { reasoning: '', content: '' }
    }
    if (transcript.reasoning || transcript.content) onChunk?.(transcript)
  }
  const content = transcript.content.trim()
  if (!content) {
    throw new AiError(transcript.reasoning.trim() ? '模型想完还没写出回答，请再试一次' : '没有收到回答，请稍后再试')
  }
  return content
}

export async function askAi(
  settings: AiSettings,
  systemPrompt: string,
  question: string,
  fetchImpl: typeof fetch = fetch,
  onChunk?: (transcript: AiTranscript) => void,
  options?: { timeoutMs?: number; maxTokens?: number },
): Promise<string> {
  const url = settings.baseUrl.replace(/\/+$/, '') + '/chat/completions'
  let res: Response
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
      body: JSON.stringify({
        model: settings.model,
        stream: true,
        ...(options?.maxTokens ? { max_tokens: options.maxTokens } : {}),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
      signal: AbortSignal.timeout(options?.timeoutMs ?? 90_000),
    })
  } catch (e) {
    if (e instanceof DOMException && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
      throw new AiError('回答超时，请稍后再试')
    }
    throw new AiError('网络连接失败，请检查网络或接口地址')
  }
  if (res.status === 401 || res.status === 403) throw new AiError('API Key 无效，请在设置里检查')
  if (!res.ok) throw new AiError(`接口返回错误（${res.status}）`)
  return readAnswer(res, onChunk)
}
