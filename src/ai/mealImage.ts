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
  dataUrl?: string
  message?: string
  statusCode?: number
}

/** 交给本机开发服务去调绘图接口。配图服务没开、或接口拒绝时抛出 AiError。 */
export async function requestMealImage(
  scene: string,
  fetchImpl: typeof fetch = fetch,
  wait: (ms: number) => Promise<void> = delay,
): Promise<string> {
  const prompt = styleImagePrompt(scene)
  let pause = 3000
  for (let attempt = 1; attempt <= 4; attempt++) {
    let response: Response
    try {
      response = await fetchImpl('/api/meal-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
    } catch {
      throw new AiError('配图服务没有连上')
    }
    const body = (await response.json().catch(() => null)) as ImageBody | null
    if (response.ok && body?.dataUrl?.startsWith('data:image/')) return body.dataUrl
    const status = body?.statusCode ?? response.status
    const retry = status === 1002 || status === 429
    if (!retry || attempt === 4) throw new AiError(body?.message || '这张图没有画出来')
    await wait(pause)
    pause *= 2
  }
  throw new AiError('这张图没有画出来')
}
