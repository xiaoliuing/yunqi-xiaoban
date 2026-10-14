import type { AvoidOption, NutrientTag, SupplementInfo, Trimester } from './types'

export const TRIMESTER_LABEL: Record<Trimester, string> = {
  1: '孕早期',
  2: '孕中期',
  3: '孕晚期',
}

export const FOCUS_TAGS: Record<Trimester, NutrientTag[]> = {
  1: ['叶酸', '清淡止吐', '补碘'],
  2: ['补铁', '补钙', 'DHA'],
  3: ['补铁', '补钙', '蛋白质'],
}

export const SUPPLEMENTS: SupplementInfo[] = [
  { id: 'folate', name: '叶酸', dose: '400μg', timing: '早餐后', trimesters: [1, 2, 3], color: '#E9C766' },
  { id: 'iron', name: '铁', dose: '遵医嘱', timing: '午餐后，可配橙子', trimesters: [2, 3], color: '#E07A4F' },
  { id: 'calcium', name: '钙', dose: '遵医嘱', timing: '晚饭后', trimesters: [2, 3], color: '#6F8F74' },
  { id: 'dha', name: 'DHA', dose: '200mg', timing: '随餐', trimesters: [2, 3], color: '#5B87A3' },
]

export const SUPPLEMENT_HINT = '钙和铁至少间隔 2 小时，铁剂配橙子吸收更好'

export const AVOID_OPTIONS: AvoidOption[] = [
  { tag: '辣', label: '不吃辣' },
  { tag: '羊肉', label: '不吃羊肉' },
  { tag: '牛肉', label: '不吃牛肉' },
  { tag: '猪肉', label: '不吃猪肉' },
  { tag: '海鲜', label: '海鲜过敏' },
  { tag: '蛋', label: '鸡蛋过敏' },
  { tag: '奶', label: '乳糖不耐' },
  { tag: '坚果', label: '坚果过敏' },
  { tag: '香菜', label: '不吃香菜' },
  { tag: '荤', label: '素食' },
]
