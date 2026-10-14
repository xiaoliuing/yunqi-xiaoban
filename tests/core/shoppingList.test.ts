import { describe, it, expect } from 'vitest'
import { buildShoppingList } from '@/core/shoppingList'
import type { Recipe } from '@/content/types'

function recipe(id: string, ingredients: Recipe['ingredients']): Recipe {
  return { id, name: id, tip: 't', kinds: ['lunch'], trimesters: [2], tags: ['补铁'], avoidTags: [], steps: ['s'], ingredients }
}

const recipes: Recipe[] = [
  recipe('a', [
    { name: '番茄', amount: '2 个', category: '蔬菜' },
    { name: '牛腩', amount: '150g', category: '肉禽' },
  ]),
  recipe('b', [
    { name: '番茄', amount: '1 个', category: '蔬菜' },
    { name: '大米', amount: '50g', category: '主食' },
  ]),
]

describe('buildShoppingList', () => {
  it('merges same ingredients and groups by category order', () => {
    const list = buildShoppingList(recipes)
    expect(list.map((g) => g.category)).toEqual(['蔬菜', '肉禽', '主食'])
    expect(list[0].items).toEqual([{ name: '番茄', amounts: ['2 个', '1 个'], count: 2 }])
  })

  it('returns an empty list for no recipes', () => {
    expect(buildShoppingList([])).toEqual([])
  })
})
