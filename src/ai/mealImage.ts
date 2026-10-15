import type { AiSettings } from '@/db'
import { AiError } from './client'

const HEADER = 'Bold cartoon, thick dark outlines, bright flat colors, food drawn large and clear.'
const FOOTER = 'Background is a very pale cool white, much lighter than the food.'

const SWAP: Record<string, string> = {
  pumpkin: 'soft orange pieces',
  yolk: 'solid yellow center',
  rice: 'grains',
  raw: 'cooked',
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 浅白食物和白碗、白背景会糊成空碗，画之前改成盛满、颜色能分开。 */
function visibleFood(scene: string): string {
  const filled = scene
    .replace(/\bsmall cooked pale pork pieces\b/gi, 'light brown pork pieces sitting on the surface')
    .replace(/\bpale pork\b/gi, 'light brown pork')
    .replace(/\bsoft white yam chunks\b/gi, 'ivory yam slices sitting on the surface')
    .replace(/\bwhite yam\b/gi, 'ivory yam')
    .replace(/\bsmooth pale porridge\b/gi, 'creamy porridge filling the bowl to the brim')
    .replace(/\bpale porridge\b/gi, 'creamy porridge filling the bowl to the brim')
    .replace(/\bsmooth pale yellow custard\b/gi, 'smooth yellow custard filling the bowl to the brim, the top even and flat')
    .replace(/\bpale yellow custard\b/gi, 'yellow custard filling the bowl to the brim')
    .replace(/\bsmall white bowl\b/gi, 'large white bowl')
  if (/bowl/i.test(filled) && !/brim|filled/i.test(filled)) {
    return `${filled} Each bowl is filled to the brim and the food covers the surface.`
  }
  return filled
}

/** 把模型写的画面收成和食谱配图一样的短提示词。点名的物体会被画出来，所以先换掉那几个词。 */
export function styleImagePrompt(scene: string): string {
  const stripped = visibleFood(scene)
    .replaceAll(HEADER, '')
    .replaceAll(FOOTER, '')
    .replace(/only these dishes\.?/gi, '')
    .replace(/\b(never|not|no|don't|dont|without|pumpkin|yolk|rice|raw)\b/gi, (word) => SWAP[word.toLowerCase()] ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  const picture = stripped || 'The picture shows one white plate of one finished home-cooked dish.'
  return `${HEADER} ${picture} ${FOOTER} Only these dishes.`.slice(0, 1500)
}

/** 模型没写 imagePrompt 时，按菜名的段数摆盘。 */
export function fallbackScene(name: string): string {
  const count = name.split(' · ').filter(Boolean).length
  if (count >= 3) return 'Left: one white bowl of a finished main dish. Center: one white bowl filled level with cooked grains. Right: one white plate of cooked green vegetables.'
  if (count === 2) return 'Left half: one white bowl of a finished dish. Right half: one white plate of a second finished dish.'
  return 'The picture shows one white bowl of one finished dish, food drawn large.'
}

interface ImageBody {
  data?: { image_base64?: string[] }
  base_resp?: { status_code?: number; status_msg?: string }
}

/** 和聊天一样，用设置里的接口地址。文生图在 `/image_generation`，不走网站自己的路径。 */
export function imageApiUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$/, '') + '/image_generation'
}

function dataUrl(encoded: string): string {
  const raw = encoded.replace(/^data:image\/\w+;base64,/, '')
  const mime = raw.startsWith('iVBOR') ? 'image/png' : raw.startsWith('UklGR') ? 'image/webp' : 'image/jpeg'
  return `data:${mime};base64,${raw}`
}

function explain(status: number | undefined, fallback: string): string {
  if (status === 1002 || status === 429) return '绘图排队中，稍后再试'
  if (status === 1004 || status === 2049 || status === 401 || status === 403) return 'API Key 无效，请在设置里检查'
  if (status === 1008) return '绘图余额不足'
  if (status === 1026) return '这张图的描述没通过审核'
  if (status === 2013) return '绘图参数不对'
  return fallback
}

/** 用设置里的密钥直接请求文生图。接口拒绝时抛出 AiError。 */
export async function requestMealImage(
  scene: string,
  settings: Pick<AiSettings, 'baseUrl' | 'apiKey'>,
  fetchImpl: typeof fetch = fetch,
  wait: (ms: number) => Promise<void> = delay,
): Promise<string> {
  const baseUrl = settings.baseUrl?.trim()
  const apiKey = settings.apiKey?.trim()
  if (!baseUrl || !apiKey) throw new AiError('请先在设置里填写接口地址和 API Key')
  const prompt = styleImagePrompt(scene)
  let pause = 3000
  for (let attempt = 1; attempt <= 4; attempt++) {
    let response: Response
    try {
      response = await fetchImpl(imageApiUrl(baseUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'image-01',
          prompt,
          aspect_ratio: '16:9',
          response_format: 'base64',
          n: 1,
          prompt_optimizer: false,
          aigc_watermark: false,
        }),
      })
    } catch {
      throw new AiError('绘图接口没有连上')
    }
    const body = (await response.json().catch(() => null)) as ImageBody | null
    const status = body?.base_resp?.status_code
    const encoded = body?.data?.image_base64?.[0]
    if (response.ok && (status == null || status === 0) && encoded) return dataUrl(encoded)
    const code = status ?? response.status
    const retry = code === 1002 || code === 429
    if (!retry || attempt === 4) throw new AiError(explain(code, body?.base_resp?.status_msg || '这张图没有画出来'))
    await wait(pause)
    pause *= 2
  }
  throw new AiError('这张图没有画出来')
}
