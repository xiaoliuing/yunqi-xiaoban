import type { AiSettings } from '@/db'

export class AiError extends Error {}

export async function askAi(
  settings: AiSettings,
  systemPrompt: string,
  question: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const url = settings.baseUrl.replace(/\/+$/, '') + '/chat/completions'
  let res: Response
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    throw new AiError('网络连接失败，请检查网络或接口地址')
  }
  if (res.status === 401 || res.status === 403) throw new AiError('API Key 无效，请在设置里检查')
  if (!res.ok) throw new AiError(`接口返回错误（${res.status}）`)
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new AiError('没有收到回答，请稍后再试')
  return content
}
