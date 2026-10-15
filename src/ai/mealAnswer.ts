import { TRIMESTER_LABEL } from '@/content/nutrition'
import { FOODS } from '@/content/foods'
import { RECIPES } from '@/content/recipes'
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
    '菜名和步骤用简体中文。不要逐条做安全审查，立刻输出 JSON。正式输出只能是一个 JSON 对象，不要 Markdown，不要代码块，不要前后说明。',
    `用户目前孕 ${ctx.week} 周 ${ctx.day} 天，处于${TRIMESTER_LABEL[ctx.trimester]}。份量按一位孕妈妈在家做的一餐来写。`,
    ctx.focus.length ? `本阶段营养重点是${ctx.focus.join('、')}，全天覆盖即可，不必每餐都有。` : '',
    avoid.length ? `用户忌口：${avoid.join('、')}。这些食材和用它们做的菜都不要出现。` : '',
    `不要安排这些食物：${banned.join('、')}。`,
    '全部做熟。不要酒、生或半生的肉鱼蛋、未经巴氏消毒的奶和软奶酪、高汞鱼。不要用「发物」「上火」当理由，也不要写药和保健品剂量。',
    '五餐的键必须是 breakfast、snackAm、lunch、snackPm、dinner，一个都不能少，主菜不要重复。',
    'breakfast 是早餐：一份主食加一份蛋白，清淡。snackAm 和 snackPm 是加餐：一小份水果、奶或坚果，比正餐简单。lunch 和 dinner 是完整的一餐，名字用「 · 」把主菜、主食、蔬菜连起来，晚餐比午餐略少。',
    '每餐字段：name（不超过 24 个字）、tip（一句，不超过 20 个字）、tags（1 到 3 个，只能从给定列表里选）、ingredients（正餐 3 到 6 样，加餐 1 到 3 样）、steps（2 到 4 步，每步不超过 24 个字）、imagePrompt。',
    'imagePrompt 用英文写成品长什么样，不超过 500 个字符。按 name 里「 · 」的顺序从左到右各写一盘，盘数和段数一样，加餐只有一道就只写这一道。每道都写容器、颜色、形状，以及一眼能认出的配料，必须和这一餐的 name、ingredients 对得上。',
    '每只碗都要写 filling the bowl to the brim，食物盖住碗面。粥、瘦肉、山药不要写成 pale 或 white，浅色会和白碗、白背景画成空碗。',
    '写法照这些成品的样子：小米粥写 vivid golden millet porridge filling the bowl to the brim；白粥写 creamy porridge filling the bowl to the brim；山药写 ivory yam slices sitting on the surface；瘦肉写 light brown pork pieces sitting on the surface；南瓜写 three soft orange pieces；红薯写 split orange sweet potato；米饭写 soft white grains filling the bowl to the brim；杂粮饭写 white grains mixed with brown grains；面条写 noodles；水煮蛋写 boiled-egg halves cut side up with solid yellow centers；蒸蛋写 smooth yellow custard filling the bowl to the brim；番茄写 soft red wedges；牛肉写 small brown meat chunks；鸡肉写 light brown chicken pieces；鱼写 one cooked pale fish；虾写 pink curled shrimp；西兰花写 small bright green florets；叶菜写 dark green cooked leaves；豆腐写 soft white cubes；酸奶写 one small glass of plain white yogurt；水果写切开后能看见的果肉。',
    '不要写出 pumpkin、yolk、rice、raw、never、no、not 这几个英文词。不要写人、文字、筷子、勺子、整只没切开的蔬菜，也不要写背景和画风。',
    `tags 只能是：${TAGS.join('、')}。`,
    `ingredients 里的 category 只能是：${CATEGORIES.join('、')}。amount 要带单位，例如 50g、1 个、200ml。食材用中国家庭超市买得到的。`,
    '五餐都由你自己搭配。菜名、食材和步骤按今天的营养重点现想，写成家里能做的家常菜，不要复用现成套餐。',
    `这些菜名不要再用：${RECIPES.map((recipe) => recipe.name).join('、')}。`,
    current.length ? `今天已经出现过这些，也要避开：${current.join('、')}。` : '',
    '下面的 JSON 只说明字段格式。不要输出例子里的菜：',
    '{"breakfast":{"name":"香菇鸡肉粥 · 茶叶蛋","tip":"鸡肉撕碎，蛋要煮透","tags":["蛋白质","清淡止吐"],"ingredients":[{"name":"大米","amount":"40g","category":"主食"},{"name":"鸡胸肉","amount":"40g","category":"肉禽"},{"name":"香菇","amount":"2 朵","category":"蔬菜"},{"name":"鸡蛋","amount":"1 个","category":"蛋奶"}],"steps":["米、香菇和鸡肉一起煮 25 分钟","鸡蛋煮 8 分钟后敲碎入味"],"imagePrompt":"Left half: one large white bowl of creamy porridge filling the bowl to the brim, with light brown chicken pieces and brown mushroom slices on the surface. Right half: one white plate with one brown peeled egg cut open, solid yellow center."},"snackAm":{"name":"火龙果","tip":"去皮切块","tags":["膳食纤维"],"ingredients":[{"name":"火龙果","amount":"150g","category":"水果"}],"steps":["去皮切块"],"imagePrompt":"The picture shows one dragon fruit cut open on a white plate, black seeds in pale flesh."},"lunch":{"name":"土豆炖鸡块 · 小米饭 · 清炒油麦菜","tip":"鸡块炖到能用勺子切断","tags":["蛋白质","补铁"],"ingredients":[{"name":"鸡腿肉","amount":"80g","category":"肉禽"},{"name":"土豆","amount":"100g","category":"蔬菜"},{"name":"小米","amount":"60g","category":"主食"},{"name":"油麦菜","amount":"150g","category":"蔬菜"}],"steps":["鸡块和土豆炖 30 分钟","小米煮成饭","油麦菜快炒"],"imagePrompt":"Left: one white bowl of pale cooked chicken pieces and soft yellow potato chunks in a light sauce. Center: one white bowl filled level with vivid golden millet grains. Right: one white plate of long dark green cooked leaves."},"snackPm":{"name":"巴氏奶","tip":"温热再喝","tags":["补钙"],"ingredients":[{"name":"巴氏奶","amount":"200ml","category":"蛋奶"}],"steps":["温热后喝"],"imagePrompt":"The picture shows one clear glass of white milk."},"dinner":{"name":"番茄豆腐煲 · 软米饭 · 蒜蓉生菜","tip":"豆腐保持完整","tags":["蛋白质","维C"],"ingredients":[{"name":"北豆腐","amount":"120g","category":"豆制品"},{"name":"番茄","amount":"150g","category":"蔬菜"},{"name":"大米","amount":"50g","category":"主食"},{"name":"生菜","amount":"120g","category":"蔬菜"}],"steps":["番茄炒出汁后放豆腐煮 8 分钟","米饭煮软","生菜少油快炒"],"imagePrompt":"Left: one white bowl of soft white cubes and several soft red wedges in a light red sauce. Center: one white bowl filled level with soft white grains. Right: one white plate of pale green cooked leaves."}}',
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
