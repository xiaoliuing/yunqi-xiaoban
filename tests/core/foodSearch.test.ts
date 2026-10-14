import { describe, it, expect } from 'vitest'
import { searchFoods } from '@/core/foodSearch'
import type { FoodEntry } from '@/content/types'

const foods: FoodEntry[] = [
  { name: '螃蟹', aliases: ['大闸蟹', '蟹'], level: 'caution', reason: 'r', advice: 'a' },
  { name: '蟹棒', aliases: [], level: 'caution', reason: 'r', advice: 'a' },
  { name: '酒', aliases: ['啤酒'], level: 'avoid', reason: 'r', advice: 'a' },
]

describe('searchFoods', () => {
  it('returns nothing for blank input', () => {
    expect(searchFoods('  ', foods)).toEqual([])
  })
  it('matches names and aliases, exact matches first', () => {
    expect(searchFoods('蟹', foods).map((f) => f.name)).toEqual(['螃蟹', '蟹棒'])
    expect(searchFoods('啤酒', foods).map((f) => f.name)).toEqual(['酒'])
  })
  it('matches partial alias', () => {
    expect(searchFoods('闸蟹', foods).map((f) => f.name)).toEqual(['螃蟹'])
  })
})
