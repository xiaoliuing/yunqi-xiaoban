/**
 * 给食谱库里的每一餐生成一张卡通配图。
 *
 * 密钥写在 scripts/minimax.local（一行，不要加引号），或临时用环境变量：
 *   MINIMAX_API_KEY=你的密钥 pnpm meals:images
 *
 * 先试一张：pnpm meals:images -- --limit 1
 * 全部生成：pnpm meals:images
 * 已有图片会跳过。要重画：pnpm meals:images -- --force
 *
 * 接口说明：https://platform.minimax.cn/docs/api-reference/image-generation-t2i
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RECIPES } from '../src/content/recipes.ts'
import { mealPrompt } from './meal-prompts.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/meal-images')
const endpoint = 'https://api.minimax.cn/v1/image_generation'

const args = process.argv.slice(2)
const force = args.includes('--force')
const limit = numberArg('--limit')
const onlyId = stringArg('--id')
const model = stringArg('--model') ?? 'image-01'

function numberArg(name: string): number | undefined {
  const index = args.indexOf(name)
  if (index < 0) return undefined
  const value = Number(args[index + 1])
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} 后面要写一个正整数`)
  return value
}

function stringArg(name: string): string | undefined {
  const index = args.indexOf(name)
  if (index < 0) return undefined
  const value = args[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${name} 后面要写食谱 id，例如 r1`)
  return value
}

async function apiKey(): Promise<string> {
  const fromEnv = process.env.MINIMAX_API_KEY?.trim()
  if (fromEnv) return fromEnv
  try {
    const text = await readFile(resolve(root, 'scripts/minimax.local'), 'utf8')
    const line = text.split('\n').map((row) => row.trim()).find((row) => row && !row.startsWith('#'))
    if (line) return line
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  throw new Error('还没有 API Key。把密钥写进 scripts/minimax.local，或设置环境变量 MINIMAX_API_KEY')
}

function extension(bytes: Buffer): string {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'jpg'
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return 'png'
  if (bytes[0] === 0x52 && bytes[1] === 0x49) return 'webp'
  return 'png'
}

interface ImageResponse {
  data?: { image_urls?: string[]; image_base64?: string[] }
  base_resp?: { status_code?: number; status_msg?: string }
}

async function requestImage(key: string, recipe: Recipe): Promise<Buffer> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      prompt: mealPrompt(recipe.name),
      ...(model === 'image-01-live' ? { style: { style_type: '漫画', style_weight: 0.45 } } : {}),
      aspect_ratio: '16:9',
      response_format: 'base64',
      n: 1,
      prompt_optimizer: false,
      aigc_watermark: false,
    }),
    signal: AbortSignal.timeout(120_000),
  })
  const body = (await response.json().catch(() => null)) as ImageResponse | null
  const status = body?.base_resp?.status_code
  if (!response.ok || (status != null && status !== 0)) {
    const message = body?.base_resp?.status_msg || `HTTP ${response.status}`
    const error = new Error(message) as Error & { statusCode?: number }
    error.statusCode = status ?? response.status
    throw error
  }
  const encoded = body?.data?.image_base64?.[0]
  if (encoded) {
    const raw = encoded.replace(/^data:image\/\w+;base64,/, '')
    return Buffer.from(raw, 'base64')
  }
  const url = body?.data?.image_urls?.[0]
  if (!url) throw new Error('接口没有返回图片')
  const file = await fetch(url, { signal: AbortSignal.timeout(60_000) })
  if (!file.ok) throw new Error(`下载图片失败（${file.status}）`)
  return Buffer.from(await file.arrayBuffer())
}

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms))
}

async function requestWithRetry(key: string, recipe: Recipe): Promise<Buffer> {
  let wait = 3_000
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return await requestImage(key, recipe)
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode
      const retry = status === 1002 || status === 429 || (status == null && attempt < 4)
      if (!retry || attempt === 4) throw error
      console.log(`  第 ${attempt} 次失败，${wait / 1000} 秒后重试：${(error as Error).message}`)
      await sleep(wait)
      wait *= 2
    }
  }
  throw new Error('重试次数用完了')
}

async function main() {
  const key = await apiKey()
  await mkdir(outDir, { recursive: true })
  const recipes = RECIPES.filter((recipe) => !onlyId || recipe.id === onlyId)
  if (onlyId && recipes.length === 0) throw new Error(`没有找到食谱 ${onlyId}`)
  const selected = limit ? recipes.slice(0, limit) : recipes
  console.log(`准备生成 ${selected.length} 张，模型 ${model}，保存到 public/meal-images/`)

  let done = 0
  let skipped = 0
  for (const [index, recipe] of selected.entries()) {
    const label = `[${index + 1}/${selected.length}] ${recipe.id} ${recipe.name}`
    const existing = [`${recipe.id}.jpg`, `${recipe.id}.png`, `${recipe.id}.webp`]
    if (!force) {
      let found = false
      for (const name of existing) {
        try {
          await readFile(resolve(outDir, name))
          found = true
          break
        } catch {
          found = false
        }
      }
      if (found) {
        skipped += 1
        console.log(`${label} 已有，跳过`)
        continue
      }
    }
    const bytes = await requestWithRetry(key, recipe)
    const file = resolve(outDir, `${recipe.id}.${extension(bytes)}`)
    await writeFile(file, bytes)
    done += 1
    console.log(`${label} → ${file.slice(root.length + 1)}`)
    console.log(`  ${mealPrompt(recipe.name)}`)
    if (index < selected.length - 1) await sleep(1_200)
  }
  console.log(`完成：新生成 ${done} 张，跳过 ${skipped} 张`)
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])
if (isDirectRun) {
  main().catch((error: Error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
