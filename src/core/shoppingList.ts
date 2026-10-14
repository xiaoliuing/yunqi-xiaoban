import type { IngredientCategory, Recipe } from '@/content/types'

export interface ShoppingItem {
  name: string
  amounts: string[]
  count: number
}

export interface ShoppingGroup {
  category: IngredientCategory
  items: ShoppingItem[]
}

export const CATEGORY_ORDER: IngredientCategory[] = ['蔬菜', '水果', '肉禽', '水产', '蛋奶', '豆制品', '主食', '干货调料']

export function buildShoppingList(recipes: Recipe[]): ShoppingGroup[] {
  const groups = new Map<IngredientCategory, Map<string, ShoppingItem>>()
  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const group = groups.get(ing.category) ?? new Map<string, ShoppingItem>()
      groups.set(ing.category, group)
      const item = group.get(ing.name) ?? { name: ing.name, amounts: [], count: 0 }
      item.amounts.push(ing.amount)
      item.count += 1
      group.set(ing.name, item)
    }
  }
  return CATEGORY_ORDER.filter((c) => groups.has(c)).map((category) => ({
    category,
    items: [...groups.get(category)!.values()],
  }))
}
