import { FOODS } from '@/content/foods'
import type { FoodEntry } from '@/content/types'

export function searchFoods(query: string, foods: FoodEntry[] = FOODS): FoodEntry[] {
  const q = query.trim()
  if (!q) return []
  const scored: { food: FoodEntry; score: number }[] = []
  for (const food of foods) {
    const names = [food.name, ...food.aliases]
    if (names.includes(q)) scored.push({ food, score: 0 })
    else if (names.some((n) => n.includes(q) || q.includes(n))) scored.push({ food, score: 1 })
  }
  return scored.sort((a, b) => a.score - b.score).map((s) => s.food)
}
