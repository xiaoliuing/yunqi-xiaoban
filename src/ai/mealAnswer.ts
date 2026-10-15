import { TRIMESTER_LABEL } from '@/content/nutrition'
import { FOODS } from '@/content/foods'
import type { AiDish, Exclusions, Ingredient, IngredientCategory, NutrientTag, PlanSlot, Trimester } from '@/content/types'

const SLOTS: PlanSlot[] = ['breakfast', 'snackAm', 'lunch', 'snackPm', 'dinner']

const TAGS: NutrientTag[] = ['补铁', '补钙', '叶酸', 'DHA', '补碘', '蛋白质', '膳食纤维', '维C', '清淡止吐', '控糖']

const CATEGORIES: IngredientCategory[] = ['蔬菜', '水果', '肉禽', '水产', '蛋奶', '豆制品', '主食', '干货调料']

const CATEGORY_ALIAS: Record<string, IngredientCategory> = {
  肉: '肉禽',
  禽: '肉禽',
  鱼: '水产',
  海鲜: '水产',
  蛋: '蛋奶',
  奶: '蛋奶',
  豆: '豆制品',
  调料: '干货调料',
}

const TAG_TEXT: Record<string, string> = { 荤: '肉禽和海鲜（素食）', 蛋: '鸡蛋', 奶: '奶制品' }

export function buildMealSystemPrompt(ctx: {
  week: number
  day: number
  trimester: Trimester
  exclusions: Exclusions
  focus: string[]
  currentNames?: string[]
}): string {
  const avoid = [...ctx.exclusions.tags.map((t) => TAG_TEXT[t] ?? t), ...ctx.exclusions.ingredients]
  const banned = FOODS.filter((f) => f.level === 'avoid').map((f) => f.name)
  const current = (ctx.currentNames ?? []).filter(Boolean)
  return [
    '你是孕期家常菜的配餐员。只安排今天一个人的五餐，依据《中国居民膳食指南（2022）》孕期部分。',
    '思考用简体中文，最多三句，不要展开食物安全审查，想完立刻输出 JSON。正式输出只能是一个 JSON 对象，不要 Markdown，不要代码块，不要前后说明。',
    `用户目前孕 ${ctx.week} 周 ${ctx.day} 天，处于${TRIMESTER_LABEL[ctx.trimester]}。份量按一位孕妈妈在家做的一餐来写。`,
    ctx.focus.length ? `本阶段营养重点是${ctx.focus.join('、')}，全天覆盖即可，不必每餐都有。` : '',
    avoid.length ? `用户忌口：${avoid.join('、')}。这些食材和用它们做的菜都不要出现。` : '',
    `不要安排这些食物：${banned.join('、')}。`,
    '全部做熟。不要酒、生或半生的肉鱼蛋、未经巴氏消毒的奶和软奶酪、高汞鱼。不要用「发物」「上火」当理由，也不要写药和保健品剂量。',
    '五餐的键必须是 breakfast、snackAm、lunch、snackPm、dinner，一个都不能少，主菜不要重复。',
    'breakfast 是早餐：一份主食加一份蛋白，清淡。snackAm 和 snackPm 是加餐：一小份水果、奶或坚果，比正餐简单。lunch 和 dinner 是完整的一餐，名字用「 · 」把主菜、主食、蔬菜连起来，晚餐比午餐略少。',
    '每餐字段：name（不超过 24 个字）、tip（一句，不超过 20 个字）、tags（1 到 3 个，只能从给定列表里选）、ingredients（正餐 3 到 6 样，加餐 1 到 3 样）、steps（2 到 4 步，每步不超过 24 个字）、imagePrompt。',
    'imagePrompt 用英文写这张图里能看到的成品，从左到右，不超过 400 个字符。只写碗盘和做好的食物。用 grains、soft orange pieces、solid yellow center、custard、white liquid 这类词。不要写 pumpkin、yolk、rice、raw，也不要写 never、no、not。不要写人、文字、筷子、勺子、整只蔬菜，也不要写背景和画风。',
    `tags 只能是：${TAGS.join('、')}。`,
    `ingredients 里的 category 只能是：${CATEGORIES.join('、')}。amount 要带单位，例如 50g、1 个、200ml。食材用中国家庭超市买得到的。`,
    current.length ? `下面这些已经推荐过，请换成另一套做法：${current.join('、')}。` : '',
    '结构照这个例子，但菜要重新搭配，不要照抄：',
    '{"breakfast":{"name":"小米南瓜粥 · 水煮蛋","tip":"南瓜煮软，蛋黄要凝固","tags":["蛋白质","清淡止吐"],"ingredients":[{"name":"小米","amount":"50g","category":"主食"},{"name":"南瓜","amount":"100g","category":"蔬菜"},{"name":"鸡蛋","amount":"1 个","category":"蛋奶"}],"steps":["小米和南瓜煮 25 分钟","鸡蛋冷水下锅，水开后再煮 8 分钟"],"imagePrompt":"Left half: one large white bowl of vivid golden millet porridge with three soft orange pieces in it. Right half: one white plate with two boiled-egg halves, cut side up, solid yellow centers."},"snackAm":{"name":"原味酸奶","tip":"选巴氏杀菌的","tags":["补钙"],"ingredients":[{"name":"原味酸奶","amount":"150g","category":"蛋奶"}],"steps":["打开直接喝"],"imagePrompt":"The picture shows one small glass of plain white yogurt."},"lunch":{"name":"番茄炖牛腩 · 杂粮饭 · 蒜蓉西兰花","tip":"牛肉要炖到软烂","tags":["补铁","蛋白质"],"ingredients":[{"name":"牛腩","amount":"80g","category":"肉禽"},{"name":"番茄","amount":"150g","category":"蔬菜"},{"name":"杂粮米","amount":"70g","category":"主食"},{"name":"西兰花","amount":"100g","category":"蔬菜"}],"steps":["牛腩焯水后和番茄炖 40 分钟","杂粮米煮熟","西兰花焯熟，少许蒜末"],"imagePrompt":"Left: one white bowl of small brown meat chunks in a red sauce. Center: one white bowl filled level with white grains mixed with brown grains. Right: one white plate of small bright green florets."},"snackPm":{"name":"苹果","tip":"洗净连皮吃","tags":["膳食纤维"],"ingredients":[{"name":"苹果","amount":"1 个","category":"水果"}],"steps":["洗净切块"],"imagePrompt":"The picture shows one apple cut open on a white plate, pale flesh showing."},"dinner":{"name":"清蒸鲈鱼 · 米饭 · 炒菠菜","tip":"鱼要完全蒸熟","tags":["DHA","补铁"],"ingredients":[{"name":"鲈鱼","amount":"80g","category":"水产"},{"name":"大米","amount":"60g","category":"主食"},{"name":"菠菜","amount":"150g","category":"蔬菜"}],"steps":["鲈鱼蒸 10 分钟","米饭煮熟","菠菜焯后快炒"],"imagePrompt":"Left: one oval white plate with one cooked pale fish. Center: one white bowl filled level with soft white grains. Right: one white plate of dark green cooked leaves."}}',
  ].filter(Boolean).join('\n')
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function categoryOf(value: unknown): IngredientCategory | null {
  if (typeof value !== 'string') return null
  if ((CATEGORIES as string[]).includes(value)) return value as IngredientCategory
  return CATEGORY_ALIAS[value] ?? null
}

function dishFrom(value: unknown): AiDish | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as { name?: unknown; tip?: unknown; tags?: unknown; ingredients?: unknown; steps?: unknown; imagePrompt?: unknown }
  const name = clip(raw.name, 24)
  if (!name) return null
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((tag): tag is NutrientTag => typeof tag === 'string' && (TAGS as string[]).includes(tag)).slice(0, 3)
    : []
  const ingredients: Ingredient[] = []
  if (Array.isArray(raw.ingredients)) {
    for (const item of raw.ingredients) {
      if (!item || typeof item !== 'object') continue
      const row = item as { name?: unknown; amount?: unknown; category?: unknown }
      const ingredientName = clip(row.name, 12)
      const amount = clip(row.amount, 12)
      const category = categoryOf(row.category)
      if (!ingredientName || !amount || !category) continue
      ingredients.push({ name: ingredientName, amount, category })
      if (ingredients.length === 6) break
    }
  }
  const steps = Array.isArray(raw.steps) ? raw.steps.map((step) => clip(step, 24)).filter(Boolean).slice(0, 4) : []
  if (!ingredients.length || !steps.length) return null
  const imagePrompt = clip(raw.imagePrompt, 500)
  return { name, tip: clip(raw.tip, 20), tags, ingredients, steps, ...(imagePrompt ? { imagePrompt } : {}) }
}

function objectAfter(text: string, key: string): string | null {
  const matched = text.match(new RegExp(`"${key}"\\s*:\\s*\\{`))
  if (!matched || matched.index === undefined) return null
  const start = text.indexOf('{', matched.index)
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < text.length; i++) {
    const char = text[i]
    if (inString) {
      if (escaped) escaped = false
      else if (char === '\\') escaped = true
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return null
}

/** 从模型输出里取出已经写完的餐次。没闭合的对象先略过，方便流式填充。 */
export function parseMealAnswer(text: string): Partial<Record<PlanSlot, AiDish>> {
  const source = text.replace(/```(?:json)?/gi, '')
  const dishes: Partial<Record<PlanSlot, AiDish>> = {}
  for (const slot of SLOTS) {
    const raw = objectAfter(source, slot)
    if (!raw) continue
    try {
      const dish = dishFrom(JSON.parse(raw))
      if (dish) dishes[slot] = dish
    } catch {
      continue
    }
  }
  return dishes
}

export function isCompleteMenu(dishes: Partial<Record<PlanSlot, AiDish>>): dishes is Record<PlanSlot, AiDish> {
  return SLOTS.every((slot) => dishes[slot])
}
