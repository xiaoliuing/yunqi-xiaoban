export type Trimester = 1 | 2 | 3

export type MealKind = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type PlanSlot = 'breakfast' | 'snackAm' | 'lunch' | 'snackPm' | 'dinner'

export type NutrientTag =
  | '补铁' | '补钙' | '叶酸' | 'DHA' | '补碘' | '蛋白质' | '膳食纤维' | '维C' | '清淡止吐' | '控糖'

export type IngredientCategory = '蔬菜' | '水果' | '肉禽' | '水产' | '蛋奶' | '豆制品' | '主食' | '干货调料'

export interface Ingredient {
  name: string
  amount: string
  category: IngredientCategory
}

export interface Recipe {
  id: string
  name: string
  tip: string
  kinds: MealKind[]
  trimesters: Trimester[]
  tags: NutrientTag[]
  avoidTags: string[]
  ingredients: Ingredient[]
  steps: string[]
}

/** AI 安排的一餐，字段和食谱卡片一致，不进内置食谱库。 */
export interface AiDish {
  name: string
  tip: string
  tags: NutrientTag[]
  ingredients: Ingredient[]
  steps: string[]
  /** 给绘图模型的英文画面描述，不含风格和背景。 */
  imagePrompt?: string
  /** 生成后的 data URL，只存在本机。 */
  image?: string
}

export interface Exclusions {
  tags: string[]
  ingredients: string[]
}

export type FoodLevel = 'ok' | 'caution' | 'avoid'

export interface FoodEntry {
  name: string
  aliases: string[]
  level: FoodLevel
  reason: string
  advice: string
}

export type FruitShape = 'seed' | 'berry' | 'round' | 'long' | 'leafy'

export interface WeekTip {
  title: string
  detail: string
}

export interface WeekInfo {
  week: number
  fruit: string
  fruitShape: FruitShape
  fruitColor: string
  lengthCm: number
  weightG: number
  baby: string
  mom: string
  tips: WeekTip[]
}

export interface CheckupItem {
  id: string
  startWeek: number
  endWeek: number
  name: string
  purpose: string
  fasting: boolean
  fullBladder: boolean
  bring: string[]
  note?: string
}

export interface RedFlag {
  id: string
  symptom: string
  level: 'emergency' | 'soon'
  detail: string
}

export type SupplementId = 'folate' | 'iron' | 'calcium' | 'dha'

export interface SupplementInfo {
  id: SupplementId
  name: string
  dose: string
  timing: string
  trimesters: Trimester[]
  color: string
}

export interface AvoidOption {
  tag: string
  label: string
}

export interface BagItem {
  id: string
  group: '妈妈' | '宝宝' | '证件' | '其他'
  name: string
}
