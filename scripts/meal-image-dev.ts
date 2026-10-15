import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const endpoint = 'https://api.minimax.cn/v1/image_generation'

function explain(status: number | undefined, fallback: string): string {
  if (status === 1002 || status === 429) return '绘图排队中，稍后再试'
  if (status === 1004 || status === 2049) return '绘图密钥无效'
  if (status === 1008) return '绘图余额不足'
  if (status === 1026) return '这张图的描述没通过审核'
  if (status === 2013) return '绘图参数不对'
  return fallback
}

async function apiKey(root: string): Promise<string> {
  const fromEnv = process.env.MINIMAX_API_KEY?.trim()
  if (fromEnv) return fromEnv
  const text = await readFile(resolve(root, 'scripts/minimax.local'), 'utf8')
  const line = text.split('\n').map((row) => row.trim()).find((row) => row && !row.startsWith('#'))
  if (!line) throw new Error('empty')
  return line
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 8000) {
        reject(new Error('too big'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolveBody(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function dataUrl(encoded: string): string {
  const raw = encoded.replace(/^data:image\/\w+;base64,/, '')
  const bytes = Buffer.from(raw, 'base64')
  const mime = bytes[0] === 0x89 && bytes[1] === 0x50 ? 'image/png' : bytes[0] === 0x52 && bytes[1] === 0x49 ? 'image/webp' : 'image/jpeg'
  return `data:${mime};base64,${raw}`
}

/** 开发时把 /api/meal-image 转到 MiniMax。密钥留在本机，不进页面。 */
export function mealImageDevPlugin(root: string): Plugin {
  return {
    name: 'meal-image-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/meal-image', (req, res) => {
        void handle(root, req, res)
      })
    },
  }
}

async function handle(root: string, req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    send(res, 405, { message: '只接受 POST' })
    return
  }
  let prompt = ''
  try {
    const json = JSON.parse(await readBody(req)) as { prompt?: unknown }
    prompt = typeof json.prompt === 'string' ? json.prompt.trim() : ''
  } catch {
    send(res, 400, { message: '绘图描述读不出来' })
    return
  }
  if (!prompt || prompt.length > 1500) {
    send(res, 400, { message: '绘图描述为空或太长' })
    return
  }
  let key = ''
  try {
    key = await apiKey(root)
  } catch {
    send(res, 500, { message: '还没有绘图密钥' })
    return
  }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'image-01',
        prompt,
        aspect_ratio: '16:9',
        response_format: 'base64',
        n: 1,
        prompt_optimizer: false,
        aigc_watermark: false,
      }),
      signal: AbortSignal.timeout(120_000),
    })
    const body = (await response.json().catch(() => null)) as {
      data?: { image_base64?: string[] }
      base_resp?: { status_code?: number; status_msg?: string }
    } | null
    const status = body?.base_resp?.status_code
    const encoded = body?.data?.image_base64?.[0]
    if (!response.ok || (status != null && status !== 0) || !encoded) {
      const code = status ?? response.status
      send(res, code === 1002 ? 429 : 502, { message: explain(code, '这张图没有画出来'), statusCode: code })
      return
    }
    send(res, 200, { dataUrl: dataUrl(encoded) })
  } catch {
    send(res, 502, { message: '绘图接口没有连上' })
  }
}
