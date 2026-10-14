# 孕期小伴 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 做一个离线可用的孕期助手 PWA：今日卡片、三餐推荐、能不能吃、产检日历、孕周时间轴、补剂打卡、体重曲线、购物清单、危险信号、孕晚期工具和可选的 AI 问一问。

**Architecture:** Vue 3 单页应用，所有内容（孕周、菜谱、食物、产检）作为 TS 数据模块打包；业务逻辑全部是 `src/core/` 下不依赖 Vue 的纯函数，用 Vitest 做测试驱动；用户数据通过 Dexie 存在 IndexedDB，Pinia store 负责连接数据库和页面。

**Tech Stack:** Vue 3 + Vite + TypeScript、vue-router 4、Pinia、Dexie 4、vite-plugin-pwa、Vitest + @vue/test-utils + jsdom + fake-indexeddb、pnpm。

**参考文档：**
- 设计文档：`docs/superpowers/specs/2026-10-14-pregnancy-companion-design.md`
- 视觉稿：`docs/design/home-mockup.html`（用浏览器打开，可交互）；截图 `docs/design/home-*.png`

**全局约定：**
- 日期一律用 `'YYYY-MM-DD'` 字符串（类型 `DateStr`），换算只通过 `src/core/date.ts`，避免时区问题。
- 写入 IndexedDB 之前一律调用 `plain()` 去掉 Vue 的响应式代理，否则会报 `DataCloneError`。
- 所有命令在仓库根目录 `/Users/xiangliu/Documents/claude-demo/son` 下执行。
- 每个任务结束都要运行 `pnpm test`，确认全部通过后再提交。

---

## 文件结构

```
index.html
vite.config.ts
public/logo.svg                       应用图标源文件（生成 PWA 图标用）
src/
  main.ts                             挂载应用、引入字体和样式
  App.vue                             页面外壳：路由出口 + 底部标签栏 + 提示条
  router.ts                           路由表 + 首次设置守卫
  styles/tokens.css                   颜色、字体、圆角等设计变量（来自视觉稿）
  styles/base.css                     全局基础样式和通用类（.card .pill .tag .btn .rise）
  core/                               纯函数，全部有单元测试
    date.ts                           日期换算、中文日期、问候语
    random.ts                         可复现的随机数（字符串哈希 + mulberry32）
    pregnancy.ts                      孕周、孕期阶段、预产期换算
    checkupSchedule.ts                产检日程推算
    ics.ts                            生成 .ics 日历文件
    weightGain.ts                     BMI 和体重增长推荐范围
    mealPlanner.ts                    三餐推荐与「换一份」
    shoppingList.ts                   购物清单合并
    kickCounter.ts                    胎动计数规则
    contractionTimer.ts               宫缩统计和 5-1-1 判定
    foodSearch.ts                     「能不能吃」搜索
    profileValidation.ts              首次设置表单校验
  content/                            只读内容数据
    types.ts                          所有内容类型
    nutrition.ts                      孕期营养重点、补剂、忌口选项
    checkups.ts                       产检项目
    weeks.ts                          第 4–40 周内容
    recipes.ts                        套餐库
    foods.ts                          「能不能吃」词条
    redflags.ts                       危险信号
    birthBag.ts                       待产包清单
  db/index.ts                         Dexie 数据库定义、初始化、plain()
  db/backup.ts                        导出 / 导入备份
  ai/prompt.ts                        AI 系统提示词和回答安全扫描
  ai/client.ts                        调用 OpenAI 兼容接口
  utils/download.ts                   触发浏览器下载文件
  composables/useClock.ts             当前日期（跨午夜自动刷新）
  stores/profile.ts                   个人资料
  stores/meals.ts                     三餐记录
  stores/records.ts                   补剂、体重、产检改期、待产包
  components/                         见各任务
  views/                              见各任务
tests/
  setup.ts                            测试初始化（fake-indexeddb）
  core/*.test.ts  content/*.test.ts  db/*.test.ts  ai/*.test.ts  views/*.test.ts
```

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`、`vite.config.ts`、`tsconfig*.json`、`index.html`、`src/main.ts`、`src/App.vue`（由模板生成后修改）
- Create: `tests/setup.ts`、`tests/smoke.test.ts`
- Create: `.gitignore`

- [ ] **Step 1: 用 Vite 模板生成项目并合并到仓库根目录**

```bash
cd /Users/xiangliu/Documents/claude-demo/son
pnpm dlx create-vite@latest tmp-app --template vue-ts
rsync -a tmp-app/ ./
rm -rf tmp-app
rm -f src/components/HelloWorld.vue src/style.css src/assets/vue.svg
```

- [ ] **Step 2: 安装依赖**

```bash
pnpm add vue-router pinia dexie fake-indexeddb @fontsource-variable/fraunces
pnpm add -D vitest @vue/test-utils jsdom vite-plugin-pwa @vite-pwa/assets-generator
```

`fake-indexeddb` 放在 dependencies 里，因为 Task 13 会在浏览器不支持 IndexedDB 时，用它作为内存数据库兜底。

- [ ] **Step 3: 写 `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

- [ ] **Step 4: 配置路径别名和测试目录**

在 `tsconfig.app.json` 的 `compilerOptions` 中加入：

```json
"paths": { "@/*": ["./src/*"] }
```

并把 `include` 改为：

```json
"include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue", "tests/**/*.ts"]
```

- [ ] **Step 5: 在 `package.json` 的 `scripts` 中加入测试命令**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: 写测试初始化和冒烟测试**

`tests/setup.ts`：

```ts
import 'fake-indexeddb/auto'
```

`tests/smoke.test.ts`：

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 7: 临时简化 `src/App.vue` 和 `src/main.ts`**

`src/App.vue`：

```vue
<template>
  <div>孕期小伴</div>
</template>
```

`src/main.ts`：

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 8: 验证**

Run: `pnpm test && pnpm build`
Expected: 1 个测试通过；`dist/` 构建成功，无类型错误。

- [ ] **Step 9: 确认 `.gitignore` 包含 `node_modules`、`dist`、`dev-dist`，然后提交**

```bash
git add -A
git commit -m "chore: scaffold Vue 3 + Vite + Vitest project"
```

---

### Task 2: 设计变量和基础样式

**Files:**
- Create: `src/styles/tokens.css`、`src/styles/base.css`
- Modify: `src/main.ts`、`index.html`

- [ ] **Step 1: 写 `src/styles/tokens.css`**（数值与视觉稿 `docs/design/home-mockup.html` 保持一致）

```css
:root {
  --paper: #FBF6EE;
  --paper-deep: #F4ECDF;
  --card: #FFFDF9;
  --ink: #2B2420;
  --ink-soft: #6F635A;
  --ink-faint: #A89A8C;
  --line: #EADFD0;

  --apricot: #E07A4F;
  --apricot-soft: #FBE3D6;
  --apricot-ink: #A9502B;
  --sage: #6F8F74;
  --sage-soft: #DFE9DC;
  --sage-ink: #4A6B50;
  --butter: #F6E3A6;
  --butter-ink: #7A5D12;
  --sky-soft: #DCE8F0;
  --sky-ink: #3E6680;
  --alert: #C8483A;
  --alert-soft: #FBE6E2;

  --font-display: "Fraunces Variable", "Songti SC", "Noto Serif SC", "Source Han Serif SC", serif;
  --font-title: "Songti SC", "Noto Serif SC", "Source Han Serif SC", serif;
  --font-body: "PingFang SC", "HarmonyOS Sans SC", "MiSans", "Noto Sans SC", sans-serif;

  --radius-lg: 22px;
  --radius-md: 16px;
  --radius-sm: 10px;
  --shadow: 0 1px 0 rgba(43, 36, 32, .04), 0 8px 24px -12px rgba(120, 80, 50, .18);
  --tabbar-h: 64px;
}
```

- [ ] **Step 2: 写 `src/styles/base.css`**

```css
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; }
body {
  font-family: var(--font-body);
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
}
button, input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }
button { cursor: pointer; }

.page {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  padding: calc(env(safe-area-inset-top) + 18px) 20px calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 28px);
  position: relative;
}
.page-glow {
  position: absolute; z-index: -1; pointer-events: none;
  width: 420px; height: 420px; border-radius: 50%; top: -180px; right: -160px;
  background: radial-gradient(circle, rgba(246, 210, 160, .75), rgba(246, 210, 160, 0) 65%);
}

.card {
  background: var(--card); border-radius: var(--radius-lg);
  box-shadow: var(--shadow); border: 1px solid rgba(234, 223, 208, .7);
}
.block { margin-top: 30px; }

.pill {
  display: inline-flex; align-items: center; gap: 4px;
  height: 26px; padding: 0 10px; border-radius: 999px; font-size: 12.5px; font-weight: 500;
}
.pill.apricot { background: var(--apricot-soft); color: var(--apricot-ink); }
.pill.ghost { border: 1px solid var(--line); color: var(--ink-soft); background: rgba(255, 255, 255, .5); }

.tag {
  font-size: 11.5px; height: 22px; padding: 0 8px; border-radius: 6px;
  display: inline-flex; align-items: center; font-weight: 500;
}
.tag.iron { background: var(--apricot-soft); color: var(--apricot-ink); }
.tag.calcium { background: var(--sage-soft); color: var(--sage-ink); }
.tag.dha { background: var(--sky-soft); color: var(--sky-ink); }
.tag.folate { background: var(--butter); color: var(--butter-ink); }
.tag.other { background: var(--paper-deep); color: var(--ink-soft); }

.btn {
  height: 40px; padding: 0 18px; border-radius: 999px; border: 0;
  font-size: 14px; font-weight: 600;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
}
.btn.dark { background: var(--ink); color: var(--paper); }
.btn.light { background: var(--card); color: var(--ink); border: 1px solid var(--line); }
.btn.block-btn { width: 100%; }
.btn:disabled { opacity: .45; }

.field { display: block; margin-top: 16px; }
.field > span { display: block; font-size: 13px; color: var(--ink-soft); margin-bottom: 6px; }
.field input, .field select, .field textarea {
  width: 100%; height: 44px; padding: 0 14px; border-radius: var(--radius-sm);
  border: 1px solid var(--line); background: var(--card);
}
.field textarea { height: 96px; padding: 10px 14px; resize: vertical; }
.field .error { color: var(--alert); font-size: 12.5px; margin-top: 4px; }

.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  height: 34px; padding: 0 14px; border-radius: 999px;
  border: 1px solid var(--line); background: var(--card); font-size: 13.5px;
}
.chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }

.muted { color: var(--ink-soft); }
.faint { color: var(--ink-faint); }

.rise { opacity: 0; transform: translateY(14px); animation: rise .7s cubic-bezier(.2, .7, .2, 1) forwards; }
@keyframes rise { to { opacity: 1; transform: none; } }
.d1 { animation-delay: .05s; } .d2 { animation-delay: .15s; } .d3 { animation-delay: .25s; }
.d4 { animation-delay: .35s; } .d5 { animation-delay: .45s; } .d6 { animation-delay: .55s; }
@media (prefers-reduced-motion: reduce) {
  .rise { animation: none; opacity: 1; transform: none; }
}
```

- [ ] **Step 3: 在 `src/main.ts` 中引入字体和样式**

```ts
import { createApp } from 'vue'
import '@fontsource-variable/fraunces'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 4: 修改 `index.html` 的 `<head>`**

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#FBF6EE" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="孕期小伴" />
<title>孕期小伴</title>
```

并把 `<html lang="en">` 改为 `<html lang="zh-CN">`。

- [ ] **Step 5: 验证并提交**

Run: `pnpm test && pnpm build`
Expected: 全部通过。

```bash
git add -A
git commit -m "feat: add design tokens and base styles"
```

---

### Task 3: 日期工具 `core/date.ts`

**Files:**
- Create: `src/core/date.ts`
- Test: `tests/core/date.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
import { describe, it, expect } from 'vitest'
import { addDays, diffDays, parseDate, formatDate, todayStr, formatCn, weekdayCn, greeting } from '@/core/date'

describe('date', () => {
  it('parses and formats round trip', () => {
    expect(formatDate(parseDate('2026-10-14'))).toBe('2026-10-14')
  })
  it('rejects invalid strings', () => {
    expect(() => parseDate('2026/10/14')).toThrow()
  })
  it('adds days across months and leap years', () => {
    expect(addDays('2026-10-14', 109)).toBe('2027-01-31')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2027-01-31', -280)).toBe('2026-04-26')
  })
  it('diffs days', () => {
    expect(diffDays('2027-01-31', '2026-10-14')).toBe(109)
    expect(diffDays('2026-10-14', '2027-01-31')).toBe(-109)
  })
  it('uses local date for today', () => {
    expect(todayStr(new Date(2026, 9, 14, 23, 59))).toBe('2026-10-14')
  })
  it('formats Chinese dates', () => {
    expect(formatCn('2026-10-04')).toBe('10月4日')
    expect(weekdayCn('2026-10-14')).toBe('周三')
  })
  it('greets by hour', () => {
    expect(greeting(7)).toBe('早上好')
    expect(greeting(12)).toBe('中午好')
    expect(greeting(15)).toBe('下午好')
    expect(greeting(21)).toBe('晚上好')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/date.test.ts`
Expected: FAIL，提示找不到 `@/core/date`。

- [ ] **Step 3: 实现 `src/core/date.ts`**

```ts
export type DateStr = string

const DAY_MS = 86_400_000

export function parseDate(s: DateStr): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) throw new Error(`无效日期：${s}`)
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

export function formatDate(ms: number): DateStr {
  return new Date(ms).toISOString().slice(0, 10)
}

export function addDays(s: DateStr, n: number): DateStr {
  return formatDate(parseDate(s) + n * DAY_MS)
}

export function diffDays(a: DateStr, b: DateStr): number {
  return Math.round((parseDate(a) - parseDate(b)) / DAY_MS)
}

export function todayStr(now: Date = new Date()): DateStr {
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

export function formatCn(s: DateStr): string {
  const [, m, d] = s.split('-')
  return `${Number(m)}月${Number(d)}日`
}

export function weekdayCn(s: DateStr): string {
  return '周' + '日一二三四五六'[new Date(parseDate(s)).getUTCDay()]
}

export function greeting(hour: number): string {
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/date.test.ts`
Expected: PASS（7 个用例）。

- [ ] **Step 5: 提交**

```bash
git add src/core/date.ts tests/core/date.test.ts
git commit -m "feat(core): add date utilities"
```

---

### Task 4: 内容类型 `content/types.ts`

**Files:**
- Create: `src/content/types.ts`

- [ ] **Step 1: 写类型定义**

```ts
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

/** 一份完整的餐，例如「番茄炖牛腩 · 杂粮饭 · 蒜蓉西兰花」 */
export interface Recipe {
  id: string
  name: string
  tip: string
  kinds: MealKind[]
  trimesters: Trimester[]
  tags: NutrientTag[]
  /** 对应 AVOID_OPTIONS 的 tag，例如 '辣'、'羊肉'、'海鲜'、'荤' */
  avoidTags: string[]
  ingredients: Ingredient[]
  steps: string[]
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
```

- [ ] **Step 2: 验证并提交**

Run: `pnpm vue-tsc -b --noEmit`
Expected: 无错误。

```bash
git add src/content/types.ts
git commit -m "feat(content): add content type definitions"
```

---

### Task 5: 孕周计算 `core/pregnancy.ts`

**Files:**
- Create: `src/core/pregnancy.ts`
- Test: `tests/core/pregnancy.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
import { describe, it, expect } from 'vitest'
import { dueFromLmp, lmpFromDue, getStatus, trimesterOf } from '@/core/pregnancy'
import { addDays } from '@/core/date'

const DUE = '2027-01-31'

describe('pregnancy', () => {
  it('converts between LMP and due date', () => {
    expect(dueFromLmp('2026-04-26')).toBe(DUE)
    expect(lmpFromDue(DUE)).toBe('2026-04-26')
  })

  it('computes week, day and countdown', () => {
    const s = getStatus(DUE, '2026-10-14')
    expect(s).toMatchObject({ week: 24, day: 3, trimester: 2, daysToDue: 109, inRange: true })
    expect(s.progress).toBeCloseTo(171 / 280)
  })

  it('splits trimesters at 14+0 and 28+0', () => {
    expect(getStatus(DUE, addDays(DUE, -(280 - 97))).trimester).toBe(1)  // 13+6
    expect(getStatus(DUE, addDays(DUE, -(280 - 98))).trimester).toBe(2)  // 14+0
    expect(getStatus(DUE, addDays(DUE, -(280 - 195))).trimester).toBe(2) // 27+6
    expect(getStatus(DUE, addDays(DUE, -(280 - 196))).trimester).toBe(3) // 28+0
  })

  it('flags out-of-range weeks', () => {
    expect(getStatus(DUE, addDays(DUE, -(280 - 20))).inRange).toBe(false) // 2+6
    expect(getStatus(DUE, addDays(DUE, 14)).inRange).toBe(true)           // 42+0
    expect(getStatus(DUE, addDays(DUE, 21)).inRange).toBe(false)          // 43+0
  })

  it('clamps progress to 0..1', () => {
    expect(getStatus(DUE, addDays(DUE, 30)).progress).toBe(1)
    expect(getStatus(DUE, addDays(DUE, -300)).progress).toBe(0)
  })

  it('maps weeks to trimester', () => {
    expect(trimesterOf(0)).toBe(1)
    expect(trimesterOf(40)).toBe(3)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/pregnancy.test.ts`
Expected: FAIL，找不到模块。

- [ ] **Step 3: 实现 `src/core/pregnancy.ts`**

```ts
import { addDays, diffDays, type DateStr } from './date'
import type { Trimester } from '@/content/types'

export const TERM_DAYS = 280

export interface PregnancyStatus {
  gestationDays: number
  week: number
  day: number
  trimester: Trimester
  daysToDue: number
  progress: number
  inRange: boolean
}

export function dueFromLmp(lmp: DateStr): DateStr {
  return addDays(lmp, TERM_DAYS)
}

export function lmpFromDue(due: DateStr): DateStr {
  return addDays(due, -TERM_DAYS)
}

export function trimesterOf(week: number): Trimester {
  if (week < 14) return 1
  if (week < 28) return 2
  return 3
}

export function getStatus(due: DateStr, today: DateStr): PregnancyStatus {
  const daysToDue = diffDays(due, today)
  const gestationDays = TERM_DAYS - daysToDue
  const week = Math.floor(gestationDays / 7)
  const day = gestationDays - week * 7
  return {
    gestationDays,
    week,
    day,
    trimester: trimesterOf(Math.max(week, 0)),
    daysToDue,
    progress: Math.min(Math.max(gestationDays / TERM_DAYS, 0), 1),
    inRange: week >= 4 && week <= 42,
  }
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/pregnancy.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/core/pregnancy.ts tests/core/pregnancy.test.ts
git commit -m "feat(core): compute gestational week and trimester"
```

---

### Task 6: 营养和补剂内容 `content/nutrition.ts`

**Files:**
- Create: `src/content/nutrition.ts`

- [ ] **Step 1: 写内容**

```ts
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
```

- [ ] **Step 2: 验证并提交**

Run: `pnpm vue-tsc -b --noEmit`
Expected: 无错误。

```bash
git add src/content/nutrition.ts
git commit -m "feat(content): add nutrition focus, supplements and avoid options"
```

---

### Task 7: 产检内容和日程 `content/checkups.ts` + `core/checkupSchedule.ts`

**Files:**
- Create: `src/content/checkups.ts`、`src/core/checkupSchedule.ts`
- Test: `tests/content/checkups.test.ts`、`tests/core/checkupSchedule.test.ts`

- [ ] **Step 1: 写产检内容 `src/content/checkups.ts`**

```ts
import type { CheckupItem } from './types'

const routine = (week: number, extra = ''): CheckupItem => ({
  id: `c${week}`,
  startWeek: week,
  endWeek: week,
  name: `孕 ${week} 周产检${extra}`,
  purpose: '常规产检：血压、体重、宫高腹围、胎心、尿常规',
  fasting: false,
  fullBladder: false,
  bring: ['产检手册', '医保卡'],
})

export const CHECKUPS: CheckupItem[] = [
  {
    id: 'c06', startWeek: 6, endWeek: 8, name: '早孕 B 超',
    purpose: '确认宫内妊娠，看胎心胎芽，核对孕周',
    fasting: false, fullBladder: true, bring: ['身份证', '医保卡'],
    note: '经腹 B 超需憋尿，经阴道 B 超不需要，以医院要求为准',
  },
  {
    id: 'c11', startWeek: 11, endWeek: 13, name: 'NT 检查 + 建档',
    purpose: '测量胎儿颈项透明层厚度，建立孕期档案并做首次全面检查',
    fasting: true, fullBladder: false, bring: ['身份证', '医保卡', '早孕 B 超单'],
    note: '建档抽血通常需空腹，带上早餐，抽完血再吃',
  },
  {
    id: 'c15', startWeek: 15, endWeek: 20, name: '唐氏筛查',
    purpose: '评估胎儿染色体异常风险',
    fasting: false, fullBladder: false, bring: ['产检手册', '医保卡'],
    note: '也可以在 12–22⁺⁶ 周改做无创 DNA（NIPT），按医生建议选择',
  },
  {
    id: 'c20', startWeek: 20, endWeek: 24, name: '系统超声（大排畸）',
    purpose: '全面检查胎儿结构发育',
    fasting: false, fullBladder: false, bring: ['产检手册'],
    note: '宝宝姿势不好时可能要走动后复查，预留半天时间',
  },
  {
    id: 'c24', startWeek: 24, endWeek: 28, name: '糖耐量试验（OGTT）',
    purpose: '筛查妊娠期糖尿病',
    fasting: true, fullBladder: false, bring: ['产检手册'],
    note: '前一晚 10 点后不再进食，空腹 8 小时以上；喝糖水后在医院静坐约 2 小时，期间不能进食',
  },
  routine(28),
  { ...routine(30, ' + 生长 B 超'), endWeek: 32, purpose: '常规产检，并做 B 超评估胎儿生长、胎位和羊水' },
  routine(32),
  routine(34),
  {
    id: 'c35', startWeek: 35, endWeek: 37, name: 'B 族链球菌（GBS）筛查',
    purpose: '筛查产道 B 族链球菌，阳性的话分娩时需要用抗生素',
    fasting: false, fullBladder: false, bring: ['产检手册'],
  },
  { ...routine(36, ' + 胎心监护'), purpose: '开始每周产检：评估胎位，做胎心监护' },
  { ...routine(37, ' + 胎心监护'), purpose: '常规产检 + 胎心监护' },
  { ...routine(38, ' + 胎心监护'), purpose: '常规产检 + 胎心监护' },
  { ...routine(39, ' + 胎心监护'), purpose: '常规产检 + 胎心监护' },
  {
    ...routine(40, ' + 胎心监护'), purpose: '常规产检 + 胎心监护',
    note: '到预产期还没有动静，按医生安排做监护或引产评估',
  },
]
```

- [ ] **Step 2: 写内容测试 `tests/content/checkups.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { CHECKUPS } from '@/content/checkups'

describe('CHECKUPS', () => {
  it('has unique ids', () => {
    expect(new Set(CHECKUPS.map((c) => c.id)).size).toBe(CHECKUPS.length)
  })
  it('is sorted by start week with valid ranges', () => {
    for (let i = 0; i < CHECKUPS.length; i++) {
      const c = CHECKUPS[i]
      expect(c.endWeek).toBeGreaterThanOrEqual(c.startWeek)
      if (i > 0) expect(c.startWeek).toBeGreaterThan(CHECKUPS[i - 1].startWeek)
    }
  })
  it('includes OGTT as fasting', () => {
    expect(CHECKUPS.find((c) => c.id === 'c24')?.fasting).toBe(true)
  })
})
```

- [ ] **Step 3: 写日程测试 `tests/core/checkupSchedule.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { buildSchedule, nextCheckup } from '@/core/checkupSchedule'

const DUE = '2027-01-31' // LMP 2026-04-26

describe('checkupSchedule', () => {
  it('suggests the start of each week range', () => {
    const s = buildSchedule(DUE, [])
    const ogtt = s.find((c) => c.id === 'c24')!
    expect(ogtt.suggestedDate).toBe('2026-10-11') // LMP + 24*7
    expect(ogtt.date).toBe('2026-10-11')
    expect(ogtt.done).toBe(false)
  })

  it('applies overrides and re-sorts by date', () => {
    const s = buildSchedule(DUE, [{ id: 'c24', date: '2026-10-19' }, { id: 'c20', done: true }])
    expect(s.find((c) => c.id === 'c24')!.date).toBe('2026-10-19')
    expect(s.find((c) => c.id === 'c20')!.done).toBe(true)
    const dates = s.map((c) => c.date)
    expect([...dates].sort()).toEqual(dates)
  })

  it('finds the next undone checkup on or after today', () => {
    const s = buildSchedule(DUE, [{ id: 'c24', date: '2026-10-19' }])
    expect(nextCheckup(s, '2026-10-14')?.id).toBe('c24')
    expect(nextCheckup(s, '2026-10-19')?.id).toBe('c24')
    const done = buildSchedule(DUE, [{ id: 'c24', date: '2026-10-19', done: true }])
    expect(nextCheckup(done, '2026-10-14')?.id).toBe('c28')
  })

  it('returns null when everything is past', () => {
    expect(nextCheckup(buildSchedule(DUE, []), '2027-03-01')).toBeNull()
  })
})
```

- [ ] **Step 4: 运行测试，确认日程测试失败**

Run: `pnpm vitest run tests/content/checkups.test.ts tests/core/checkupSchedule.test.ts`
Expected: 内容测试 PASS；日程测试 FAIL（找不到模块）。

- [ ] **Step 5: 实现 `src/core/checkupSchedule.ts`**

```ts
import { addDays, type DateStr } from './date'
import { lmpFromDue } from './pregnancy'
import { CHECKUPS } from '@/content/checkups'
import type { CheckupItem } from '@/content/types'

export interface CheckupOverride {
  id: string
  date?: DateStr
  done?: boolean
}

export interface ScheduledCheckup extends CheckupItem {
  suggestedDate: DateStr
  date: DateStr
  done: boolean
}

export function buildSchedule(
  due: DateStr,
  overrides: CheckupOverride[],
  items: CheckupItem[] = CHECKUPS,
): ScheduledCheckup[] {
  const lmp = lmpFromDue(due)
  const byId = new Map(overrides.map((o) => [o.id, o]))
  return items
    .map((item) => {
      const o = byId.get(item.id)
      const suggestedDate = addDays(lmp, item.startWeek * 7)
      return { ...item, suggestedDate, date: o?.date ?? suggestedDate, done: o?.done ?? false }
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function nextCheckup(schedule: ScheduledCheckup[], today: DateStr): ScheduledCheckup | null {
  return schedule.find((c) => !c.done && c.date >= today) ?? null
}
```

- [ ] **Step 6: 运行测试，确认通过**

Run: `pnpm vitest run tests/content/checkups.test.ts tests/core/checkupSchedule.test.ts`
Expected: PASS。

- [ ] **Step 7: 提交**

```bash
git add src/content/checkups.ts src/core/checkupSchedule.ts tests/content/checkups.test.ts tests/core/checkupSchedule.test.ts
git commit -m "feat: add checkup content and schedule builder"
```

---

### Task 8: 日历文件 `core/ics.ts` + 下载工具

**Files:**
- Create: `src/core/ics.ts`、`src/utils/download.ts`
- Test: `tests/core/ics.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
import { describe, it, expect } from 'vitest'
import { toIcs } from '@/core/ics'
import { buildSchedule } from '@/core/checkupSchedule'

const NOW = new Date('2026-10-14T02:30:00Z')

describe('toIcs', () => {
  const schedule = buildSchedule('2027-01-31', [{ id: 'c06', done: true }, { id: 'c24', date: '2026-10-19' }])
  const ics = toIcs(schedule, { location: '市妇幼保健院', now: NOW })
  const unfolded = ics.replace(/\r\n /g, '')

  it('wraps events in a calendar with CRLF line endings', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('skips done checkups', () => {
    expect(unfolded).not.toContain('UID:c06@yunqi-xiaoban')
    expect((unfolded.match(/BEGIN:VEVENT/g) ?? []).length).toBe(schedule.length - 1)
  })

  it('writes all-day events with a reminder the day before', () => {
    expect(unfolded).toContain('UID:c24@yunqi-xiaoban')
    expect(unfolded).toContain('DTSTART;VALUE=DATE:20261019')
    expect(unfolded).toContain('DTEND;VALUE=DATE:20261020')
    expect(unfolded).toContain('DTSTAMP:20261014T023000Z')
    expect(unfolded).toContain('TRIGGER:-PT15H')
    expect(unfolded).toContain('LOCATION:市妇幼保健院')
  })

  it('escapes text and lists preparation notes', () => {
    expect(unfolded).toContain('SUMMARY:产检：糖耐量试验（OGTT）')
    expect(unfolded).toMatch(/DESCRIPTION:筛查妊娠期糖尿病\\n需空腹/)
  })

  it('folds lines to at most 75 bytes', () => {
    const enc = new TextEncoder()
    for (const line of ics.split('\r\n')) {
      expect(enc.encode(line).length).toBeLessThanOrEqual(75)
    }
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/ics.test.ts`
Expected: FAIL，找不到模块。

- [ ] **Step 3: 实现 `src/core/ics.ts`**

```ts
import { addDays } from './date'
import type { ScheduledCheckup } from './checkupSchedule'

export interface IcsOptions {
  location?: string
  now: Date
}

const encoder = new TextEncoder()

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function fold(line: string): string {
  if (encoder.encode(line).length <= 75) return line
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const ch of line) {
    const size = encoder.encode(ch).length
    if (bytes + size > 75) {
      parts.push(current)
      current = ' ' + ch
      bytes = 1 + size
    } else {
      current += ch
      bytes += size
    }
  }
  parts.push(current)
  return parts.join('\r\n')
}

function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function compact(date: string): string {
  return date.replace(/-/g, '')
}

function describe(c: ScheduledCheckup): string {
  const lines = [c.purpose]
  if (c.fasting) lines.push('需空腹')
  if (c.fullBladder) lines.push('需憋尿')
  if (c.bring.length) lines.push('携带：' + c.bring.join('、'))
  if (c.note) lines.push(c.note)
  return lines.join('\n')
}

export function toIcs(checkups: ScheduledCheckup[], opts: IcsOptions): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//yunqi-xiaoban//CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:产检日程',
  ]
  for (const c of checkups.filter((x) => !x.done)) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${c.id}@yunqi-xiaoban`,
      `DTSTAMP:${stamp(opts.now)}`,
      `DTSTART;VALUE=DATE:${compact(c.date)}`,
      `DTEND;VALUE=DATE:${compact(addDays(c.date, 1))}`,
      `SUMMARY:${escapeText('产检：' + c.name)}`,
      `DESCRIPTION:${escapeText(describe(c))}`,
    )
    if (opts.location) lines.push(`LOCATION:${escapeText(opts.location)}`)
    lines.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeText('明天产检：' + c.name)}`,
      'TRIGGER:-PT15H',
      'END:VALARM',
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}
```

全天事件从当天 0 点开始，`-PT15H` 对应前一天上午 9 点提醒。

- [ ] **Step 4: 写 `src/utils/download.ts`**

```ts
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/ics.test.ts`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/core/ics.ts src/utils/download.ts tests/core/ics.test.ts
git commit -m "feat(core): export checkups as iCalendar file"
```

---

### Task 9: 体重增长 `core/weightGain.ts`

**Files:**
- Create: `src/core/weightGain.ts`
- Test: `tests/core/weightGain.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
import { describe, it, expect } from 'vitest'
import { bmi, totalGainRange, recommendedGain, assessGain } from '@/core/weightGain'

describe('weightGain', () => {
  it('computes BMI to one decimal', () => {
    expect(bmi(160, 55)).toBe(21.5)
  })

  it('picks the WS/T 801-2022 range by pre-pregnancy BMI', () => {
    expect(totalGainRange(18.4)).toMatchObject({ min: 11, max: 16 })
    expect(totalGainRange(18.5)).toMatchObject({ min: 8, max: 14 })
    expect(totalGainRange(23.9)).toMatchObject({ min: 8, max: 14 })
    expect(totalGainRange(24.0)).toMatchObject({ min: 7, max: 11 })
    expect(totalGainRange(28.0)).toMatchObject({ min: 5, max: 9 })
  })

  it('allows 0-2 kg in the first trimester then interpolates to term', () => {
    expect(recommendedGain(21.5, 0)).toEqual({ min: 0, max: 0 })
    expect(recommendedGain(21.5, 13)).toEqual({ min: 0, max: 2 })
    expect(recommendedGain(21.5, 26)).toEqual({ min: 3.9, max: 7.8 })
    expect(recommendedGain(21.5, 40)).toEqual({ min: 8, max: 14 })
    expect(recommendedGain(21.5, 42)).toEqual({ min: 8, max: 14 })
  })

  it('assesses current gain', () => {
    const p = { heightCm: 160, preWeightKg: 55 }
    expect(assessGain(p, 26, 60)).toBe('normal')
    expect(assessGain(p, 26, 66)).toBe('high')
    expect(assessGain(p, 26, 56)).toBe('low')
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/weightGain.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 `src/core/weightGain.ts`**

```ts
export interface GainRange {
  min: number
  max: number
}

export type GainAssessment = 'low' | 'normal' | 'high'

const TOTAL_GAIN: (GainRange & { belowBmi: number })[] = [
  { belowBmi: 18.5, min: 11, max: 16 },
  { belowBmi: 24, min: 8, max: 14 },
  { belowBmi: 28, min: 7, max: 11 },
  { belowBmi: Infinity, min: 5, max: 9 },
]

const FIRST_TRIMESTER_MAX = 2

const round1 = (n: number) => Math.round(n * 10) / 10

export function bmi(heightCm: number, weightKg: number): number {
  const m = heightCm / 100
  return round1(weightKg / (m * m))
}

export function totalGainRange(preBmi: number): GainRange {
  const r = TOTAL_GAIN.find((x) => preBmi < x.belowBmi)!
  return { min: r.min, max: r.max }
}

export function recommendedGain(preBmi: number, week: number): GainRange {
  const w = Math.min(Math.max(week, 0), 40)
  if (w <= 13) return { min: 0, max: round1((FIRST_TRIMESTER_MAX * w) / 13) }
  const total = totalGainRange(preBmi)
  const t = (w - 13) / 27
  return {
    min: round1(total.min * t),
    max: round1(FIRST_TRIMESTER_MAX + (total.max - FIRST_TRIMESTER_MAX) * t),
  }
}

export function assessGain(
  person: { heightCm: number; preWeightKg: number },
  week: number,
  currentKg: number,
): GainAssessment {
  const range = recommendedGain(bmi(person.heightCm, person.preWeightKg), week)
  const gain = round1(currentKg - person.preWeightKg)
  if (gain < range.min) return 'low'
  if (gain > range.max) return 'high'
  return 'normal'
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/weightGain.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/core/weightGain.ts tests/core/weightGain.test.ts
git commit -m "feat(core): weight gain ranges by pre-pregnancy BMI"
```

---

### Task 10: 「能不能吃」词条 `content/foods.ts` + 搜索 `core/foodSearch.ts`

**Files:**
- Create: `src/content/foods.ts`、`src/core/foodSearch.ts`
- Test: `tests/content/foods.test.ts`、`tests/core/foodSearch.test.ts`

- [ ] **Step 1: 写 `src/content/foods.ts`，先放入以下核心词条**

```ts
import type { FoodEntry } from './types'

export const FOODS: FoodEntry[] = [
  { name: '酒', aliases: ['啤酒', '白酒', '红酒', '米酒', '醪糟'], level: 'avoid', reason: '酒精会通过胎盘影响胎儿发育，不存在安全剂量', advice: '整个孕期都不要喝，含酒精的菜（醉虾、酒酿）也避免' },
  { name: '生鱼片', aliases: ['刺身', '生鱼'], level: 'avoid', reason: '可能含寄生虫和李斯特菌', advice: '鱼要做熟再吃' },
  { name: '寿司', aliases: [], level: 'caution', reason: '含生鱼的寿司有寄生虫和细菌风险', advice: '可以吃全熟食材做的寿司，如鳗鱼、玉子、蔬菜卷' },
  { name: '溏心蛋', aliases: ['生鸡蛋', '温泉蛋', '半熟蛋'], level: 'avoid', reason: '未熟透的蛋可能带有沙门氏菌', advice: '蛋黄蛋白都凝固后再吃' },
  { name: '鸡蛋', aliases: ['鸡蛋', '水煮蛋'], level: 'ok', reason: '优质蛋白和胆碱的好来源', advice: '每天 1 个，煮熟吃' },
  { name: '生牛奶', aliases: ['未消毒奶', '生乳'], level: 'avoid', reason: '未经巴氏消毒，可能有李斯特菌', advice: '选择巴氏消毒奶或常温灭菌奶' },
  { name: '牛奶', aliases: ['纯牛奶'], level: 'ok', reason: '补钙的主要来源', advice: '孕中晚期每天 300–500g 奶或奶制品' },
  { name: '软质奶酪', aliases: ['布里奶酪', '卡芒贝尔'], level: 'caution', reason: '未经消毒的软奶酪可能有李斯特菌', advice: '只吃标明巴氏消毒的产品，或加热后吃' },
  { name: '半熟牛排', aliases: ['三分熟', '五分熟'], level: 'avoid', reason: '未熟透的肉可能带有弓形虫', advice: '牛排做到全熟' },
  { name: '冷切肉', aliases: ['火腿片', '熟食冷盘', '午餐肉'], level: 'caution', reason: '冷藏即食肉类有李斯特菌风险', advice: '加热到冒热气再吃，平时少吃' },
  { name: '腊肉', aliases: ['腊肠', '咸鱼', '腌肉'], level: 'caution', reason: '含盐量高，可能含亚硝酸盐', advice: '偶尔少量，做熟再吃' },
  { name: '生蚝', aliases: ['牡蛎'], level: 'caution', reason: '生吃有诺如病毒和细菌风险', advice: '彻底做熟可以吃，富含锌' },
  { name: '螃蟹', aliases: ['大闸蟹', '蟹'], level: 'caution', reason: '性质没有传说中可怕，但不新鲜或没熟透容易引起食物中毒', advice: '新鲜、蒸熟透，适量吃；对海鲜过敏不要吃' },
  { name: '鲨鱼', aliases: ['旗鱼', '方头鱼', '大眼金枪鱼', '剑鱼'], level: 'avoid', reason: '大型掠食性鱼类汞含量高', advice: '换成三文鱼、鲈鱼、鳕鱼等低汞鱼' },
  { name: '三文鱼', aliases: ['鲑鱼'], level: 'ok', reason: '低汞，富含 DHA', advice: '做熟吃，每周 2–3 次鱼' },
  { name: '鲈鱼', aliases: [], level: 'ok', reason: '低汞，蛋白质好吸收', advice: '清蒸最佳' },
  { name: '咖啡', aliases: ['拿铁', '美式'], level: 'caution', reason: '咖啡因摄入过多与流产、低出生体重有关', advice: '每天咖啡因不超过 200mg，约一杯中杯美式' },
  { name: '浓茶', aliases: ['奶茶'], level: 'caution', reason: '含咖啡因，茶多酚影响铁吸收', advice: '淡茶少量，别和补铁的餐一起喝' },
  { name: '动物肝脏', aliases: ['猪肝', '鸡肝'], level: 'caution', reason: '补铁效果好，但维生素 A 含量很高，过量有致畸风险', advice: '每周 1–2 次，每次 20–50g' },
  { name: '动物血', aliases: ['鸭血', '猪血'], level: 'ok', reason: '血红素铁含量高，好吸收', advice: '每周 1–2 次，选正规渠道' },
  { name: '山楂', aliases: ['山楂片', '糖葫芦'], level: 'caution', reason: '大量食用可能刺激子宫收缩，加工品含糖高', advice: '偶尔吃几颗没关系，别当零食大量吃' },
  { name: '芦荟', aliases: [], level: 'avoid', reason: '口服可能引起腹泻和子宫收缩', advice: '不要吃芦荟或芦荟饮料，外用护肤品可以' },
  { name: '薏米', aliases: ['薏仁'], level: 'caution', reason: '传统观点认为孕早期不宜多吃，证据有限', advice: '孕早期避免大量，偶尔少量没关系' },
  { name: '桂圆', aliases: ['龙眼'], level: 'caution', reason: '含糖量高', advice: '一次几颗，血糖偏高要少吃' },
  { name: '西瓜', aliases: [], level: 'caution', reason: '含糖量较高，易让血糖升高', advice: '一次一小块，糖耐前后注意控制' },
  { name: '榴莲', aliases: [], level: 'caution', reason: '热量和含糖量都高', advice: '一次 1–2 块，血糖高要避免' },
  { name: '菠萝', aliases: ['凤梨'], level: 'ok', reason: '正常饮食量不会导致流产', advice: '适量吃，过敏体质先少量尝试' },
  { name: '木瓜', aliases: [], level: 'ok', reason: '成熟木瓜可以吃，富含维生素 C', advice: '吃熟透的；青木瓜含较多乳胶，避免' },
  { name: '鲜黄花菜', aliases: ['新鲜金针菜'], level: 'avoid', reason: '新鲜黄花菜含秋水仙碱，会引起中毒', advice: '吃干黄花菜，泡发后彻底煮熟' },
  { name: '发芽土豆', aliases: ['青皮土豆'], level: 'avoid', reason: '含龙葵素，会引起中毒', advice: '发芽、变绿的土豆直接扔掉' },
  { name: '槟榔', aliases: [], level: 'avoid', reason: '一级致癌物，与不良妊娠结局有关', advice: '不要吃' },
  { name: '人参', aliases: ['西洋参', '高丽参'], level: 'caution', reason: '药材类补品可能影响血压和凝血', advice: '不要自行进补，先问医生' },
  { name: '燕窝', aliases: [], level: 'ok', reason: '可以吃，但营养价值与鸡蛋、牛奶相近', advice: '不必刻意购买' },
  { name: '冰淇淋', aliases: ['雪糕'], level: 'caution', reason: '糖分高，少数产品有李斯特菌风险', advice: '偶尔吃正规品牌，一次少量' },
  { name: '方便面', aliases: ['泡面'], level: 'caution', reason: '高盐高油、营养单一', advice: '偶尔应急可以，加个蛋和青菜' },
  { name: '菠菜', aliases: [], level: 'ok', reason: '富含叶酸', advice: '焯水去草酸后再炒或凉拌' },
  { name: '海带', aliases: ['紫菜', '裙带菜'], level: 'ok', reason: '补碘的好食物', advice: '每周 1–2 次，配合加碘盐' },
  { name: '酸奶', aliases: [], level: 'ok', reason: '补钙，帮助肠道', advice: '选无糖或低糖的' },
  { name: '核桃', aliases: ['坚果'], level: 'ok', reason: '健康脂肪和维生素 E', advice: '每天一小把（约 10g），坚果过敏不要吃' },
]
```

- [ ] **Step 2: 按同样格式扩充到约 150 条**

在 Step 1 的基础上，按以下分类补充词条（每类至少列出的数量），每条都要有具体的 `reason` 和 `advice`，并核对来源（《中国居民膳食指南（2022）》孕期部分及权威医院科普）：
- 水果：至少 20 种（苹果、香蕉、橙子、猕猴桃、葡萄、荔枝、芒果、柿子、樱桃、草莓、火龙果、柚子、梨、桃子、牛油果、蓝莓、哈密瓜、石榴、杏、李子……）
- 蔬菜和菌菇：至少 20 种（西兰花、胡萝卜、番茄、苦瓜、韭菜、香菜、木耳、香菇、马齿苋、豆芽、茄子、南瓜……）
- 肉蛋水产：至少 20 种（牛肉、羊肉、猪肉、鸡肉、鸭肉、虾、鱿鱼、带鱼、金枪鱼罐头、鳕鱼、甲鱼……）
- 主食和豆制品：至少 15 种（小米、燕麦、糙米、红薯、玉米、豆腐、豆浆、腐竹、粽子、年糕……）
- 饮品零食和调味：至少 20 种（可乐、功能饮料、蜂蜜、红糖、巧克力、薯片、辣条、花椒、味精、代糖……）
- 补品和中药：至少 10 种（阿胶、红枣、枸杞、鸡精、蛋白粉、益母草、藏红花……）

档位判断原则：有明确中毒、感染或致畸风险的为 `avoid`；需要控制数量、做法或因人而异的为 `caution`；正常饮食量没有特殊风险的为 `ok`。名称和别名在全表内不能重复。

- [ ] **Step 3: 写内容测试 `tests/content/foods.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { FOODS } from '@/content/foods'

describe('FOODS', () => {
  it('has around 150 entries', () => {
    expect(FOODS.length).toBeGreaterThanOrEqual(140)
  })
  it('has no duplicate names or aliases', () => {
    const all = FOODS.flatMap((f) => [f.name, ...f.aliases.filter((a) => a !== f.name)])
    const dupes = all.filter((n, i) => all.indexOf(n) !== i)
    expect(dupes).toEqual([])
  })
  it('explains every entry', () => {
    for (const f of FOODS) {
      expect(f.reason.length, f.name).toBeGreaterThan(4)
      expect(f.advice.length, f.name).toBeGreaterThan(2)
    }
  })
  it('marks known hazards as avoid', () => {
    for (const name of ['酒', '生鱼片', '溏心蛋', '生牛奶', '鲜黄花菜']) {
      expect(FOODS.find((f) => f.name === name)?.level, name).toBe('avoid')
    }
  })
})
```

- [ ] **Step 4: 写搜索测试 `tests/core/foodSearch.test.ts`**

```ts
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
```

- [ ] **Step 5: 运行测试，确认搜索测试失败**

Run: `pnpm vitest run tests/content/foods.test.ts tests/core/foodSearch.test.ts`
Expected: foods 测试 PASS；foodSearch FAIL（找不到模块）。

- [ ] **Step 6: 实现 `src/core/foodSearch.ts`**

```ts
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
```

- [ ] **Step 7: 运行测试，确认通过**

Run: `pnpm vitest run tests/content/foods.test.ts tests/core/foodSearch.test.ts`
Expected: PASS。

- [ ] **Step 8: 提交**

```bash
git add src/content/foods.ts src/core/foodSearch.ts tests/content/foods.test.ts tests/core/foodSearch.test.ts
git commit -m "feat: add can-I-eat food entries and search"
```

---

### Task 11: 套餐库 `content/recipes.ts`

**Files:**
- Create: `src/content/recipes.ts`
- Test: `tests/content/recipes.test.ts`

- [ ] **Step 1: 写测试 `tests/content/recipes.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { RECIPES, getRecipe } from '@/content/recipes'
import { FOODS } from '@/content/foods'
import { AVOID_OPTIONS } from '@/content/nutrition'
import type { MealKind, Trimester } from '@/content/types'

const avoidNames = new Set(FOODS.filter((f) => f.level === 'avoid').flatMap((f) => [f.name, ...f.aliases]))
const validTags = new Set(AVOID_OPTIONS.map((o) => o.tag))

describe('RECIPES', () => {
  it('has about 100 meals with unique ids', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(90)
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length)
  })

  it('has at least 8 options per trimester and meal kind', () => {
    const kinds: MealKind[] = ['breakfast', 'lunch', 'dinner', 'snack']
    const trimesters: Trimester[] = [1, 2, 3]
    for (const t of trimesters) {
      for (const k of kinds) {
        const n = RECIPES.filter((r) => r.trimesters.includes(t) && r.kinds.includes(k)).length
        expect(n, `trimester ${t} ${k}`).toBeGreaterThanOrEqual(8)
      }
    }
  })

  it('never uses avoid-level foods', () => {
    for (const r of RECIPES) {
      for (const i of r.ingredients) expect(avoidNames.has(i.name), `${r.id} ${i.name}`).toBe(false)
    }
  })

  it('only uses known avoid tags and tags meat/seafood consistently', () => {
    for (const r of RECIPES) {
      for (const t of r.avoidTags) expect(validTags.has(t), `${r.id} ${t}`).toBe(true)
      const cats = r.ingredients.map((i) => i.category)
      if (cats.includes('肉禽') || cats.includes('水产')) expect(r.avoidTags, r.id).toContain('荤')
      if (cats.includes('水产')) expect(r.avoidTags, r.id).toContain('海鲜')
    }
  })

  it('has complete content', () => {
    for (const r of RECIPES) {
      expect(r.tip, r.id).not.toBe('')
      expect(r.ingredients.length, r.id).toBeGreaterThan(0)
      expect(r.steps.length, r.id).toBeGreaterThan(0)
      expect(r.tags.length, r.id).toBeGreaterThan(0)
    }
  })

  it('looks up by id', () => {
    expect(getRecipe(RECIPES[0].id)).toBe(RECIPES[0])
    expect(getRecipe('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/content/recipes.test.ts`
Expected: FAIL，找不到模块。

- [ ] **Step 3: 写 `src/content/recipes.ts`，先写入以下样例**

```ts
import type { Recipe } from './types'

export const RECIPES: Recipe[] = [
  {
    id: 'b-millet-pumpkin', name: '小米南瓜粥 · 水煮蛋 · 拌菠菜', tip: '菠菜焯水去草酸，蛋黄要煮熟',
    kinds: ['breakfast'], trimesters: [1, 2, 3], tags: ['叶酸', '蛋白质'], avoidTags: ['蛋'],
    ingredients: [
      { name: '小米', amount: '50g', category: '主食' },
      { name: '南瓜', amount: '100g', category: '蔬菜' },
      { name: '鸡蛋', amount: '1 个', category: '蛋奶' },
      { name: '菠菜', amount: '100g', category: '蔬菜' },
    ],
    steps: ['小米和南瓜块加水煮 30 分钟成粥', '鸡蛋冷水下锅，水开后煮 8 分钟', '菠菜焯水 1 分钟，加少许香油和盐拌匀'],
  },
  {
    id: 'b-wholewheat-sandwich', name: '全麦三明治 · 牛奶 · 小番茄', tip: '牛奶 250ml，三明治夹鸡蛋和生菜',
    kinds: ['breakfast'], trimesters: [2, 3], tags: ['补钙', '蛋白质'], avoidTags: ['蛋', '奶'],
    ingredients: [
      { name: '全麦面包', amount: '2 片', category: '主食' },
      { name: '鸡蛋', amount: '1 个', category: '蛋奶' },
      { name: '生菜', amount: '2 片', category: '蔬菜' },
      { name: '牛奶', amount: '250ml', category: '蛋奶' },
      { name: '小番茄', amount: '6 颗', category: '水果' },
    ],
    steps: ['鸡蛋煎至全熟', '面包夹入鸡蛋和生菜', '牛奶加热，配小番茄'],
  },
  {
    id: 'b-ginger-congee', name: '白粥 · 苏打饼干 · 姜丝蒸蛋', tip: '孕吐时少量多次，起床前先吃两块饼干',
    kinds: ['breakfast'], trimesters: [1], tags: ['清淡止吐', '蛋白质'], avoidTags: ['蛋'],
    ingredients: [
      { name: '大米', amount: '50g', category: '主食' },
      { name: '苏打饼干', amount: '3 块', category: '主食' },
      { name: '鸡蛋', amount: '1 个', category: '蛋奶' },
      { name: '生姜', amount: '3 片', category: '干货调料' },
    ],
    steps: ['大米煮成稀粥', '鸡蛋打散加 1.5 倍温水和姜丝，蒸 10 分钟'],
  },
  {
    id: 's-yogurt-walnut', name: '原味酸奶 · 一小把核桃', tip: '酸奶选无糖，核桃 2–3 个即可',
    kinds: ['snack'], trimesters: [1, 2, 3], tags: ['补钙', 'DHA'], avoidTags: ['奶', '坚果'],
    ingredients: [
      { name: '酸奶', amount: '150g', category: '蛋奶' },
      { name: '核桃', amount: '10g', category: '干货调料' },
    ],
    steps: ['直接食用'],
  },
  {
    id: 's-orange', name: '橙子一个', tip: '维 C 帮助午餐里的铁吸收',
    kinds: ['snack'], trimesters: [1, 2, 3], tags: ['维C'], avoidTags: [],
    ingredients: [{ name: '橙子', amount: '1 个', category: '水果' }],
    steps: ['洗净剥皮食用'],
  },
  {
    id: 's-kiwi-soymilk', name: '猕猴桃 · 无糖豆浆', tip: '豆浆一定要煮透',
    kinds: ['snack'], trimesters: [2, 3], tags: ['维C', '补钙'], avoidTags: [],
    ingredients: [
      { name: '猕猴桃', amount: '1 个', category: '水果' },
      { name: '黄豆', amount: '20g', category: '豆制品' },
    ],
    steps: ['黄豆提前泡发，用豆浆机煮熟', '猕猴桃对半切开挖着吃'],
  },
  {
    id: 'l-tomato-beef', name: '番茄炖牛腩 · 杂粮饭 · 蒜蓉西兰花', tip: '番茄里的维 C 帮助牛肉的铁吸收',
    kinds: ['lunch', 'dinner'], trimesters: [2, 3], tags: ['补铁', '维C'], avoidTags: ['牛肉', '荤'],
    ingredients: [
      { name: '牛腩', amount: '150g', category: '肉禽' },
      { name: '番茄', amount: '2 个', category: '蔬菜' },
      { name: '西兰花', amount: '150g', category: '蔬菜' },
      { name: '大米', amount: '50g', category: '主食' },
      { name: '糙米', amount: '30g', category: '主食' },
      { name: '大蒜', amount: '3 瓣', category: '干货调料' },
    ],
    steps: ['牛腩切块焯水，加番茄和水小火炖 1.5 小时', '大米和糙米混合煮饭', '西兰花焯水后加蒜末快炒'],
  },
  {
    id: 'l-duckblood-tofu', name: '鸭血豆腐汤 · 糙米饭 · 清炒油麦菜', tip: '鸭血每周 1–2 次，是补铁好帮手',
    kinds: ['lunch', 'dinner'], trimesters: [2, 3], tags: ['补铁', '补钙'], avoidTags: ['荤'],
    ingredients: [
      { name: '鸭血', amount: '100g', category: '肉禽' },
      { name: '北豆腐', amount: '100g', category: '豆制品' },
      { name: '油麦菜', amount: '200g', category: '蔬菜' },
      { name: '糙米', amount: '80g', category: '主食' },
    ],
    steps: ['鸭血和豆腐切块，水开后下锅煮 5 分钟，加盐和葱花', '糙米提前泡 2 小时后煮饭', '油麦菜大火快炒'],
  },
  {
    id: 'd-steamed-bass', name: '清蒸鲈鱼 · 虾皮炒小白菜 · 紫菜蛋花汤', tip: '鲈鱼是低汞鱼，每周可吃 2–3 次',
    kinds: ['dinner', 'lunch'], trimesters: [1, 2, 3], tags: ['DHA', '补钙', '补碘'], avoidTags: ['海鲜', '荤', '蛋'],
    ingredients: [
      { name: '鲈鱼', amount: '1 条（约 400g）', category: '水产' },
      { name: '小白菜', amount: '200g', category: '蔬菜' },
      { name: '虾皮', amount: '5g', category: '水产' },
      { name: '紫菜', amount: '5g', category: '干货调料' },
      { name: '鸡蛋', amount: '1 个', category: '蛋奶' },
      { name: '大米', amount: '80g', category: '主食' },
    ],
    steps: ['鲈鱼划刀铺姜葱，水开后蒸 8 分钟，淋蒸鱼豉油', '小白菜和虾皮一起快炒', '紫菜煮开后淋入蛋液'],
  },
  {
    id: 'd-mushroom-chicken', name: '香菇滑鸡 · 二米饭 · 凉拌海带丝', tip: '海带补碘，吃前多泡洗一下',
    kinds: ['dinner', 'lunch'], trimesters: [1, 2, 3], tags: ['蛋白质', '补碘'], avoidTags: ['荤'],
    ingredients: [
      { name: '鸡腿肉', amount: '150g', category: '肉禽' },
      { name: '香菇', amount: '5 朵', category: '蔬菜' },
      { name: '海带丝', amount: '100g', category: '蔬菜' },
      { name: '大米', amount: '50g', category: '主食' },
      { name: '小米', amount: '30g', category: '主食' },
    ],
    steps: ['鸡腿肉切块用生抽淀粉抓匀，和香菇一起蒸 20 分钟', '大米小米混合煮饭', '海带丝焯水，加醋和蒜末凉拌'],
  },
  {
    id: 'l-tofu-veggie', name: '麻婆豆腐（不辣版）· 杂粮饭 · 清炒菠菜', tip: '豆腐用北豆腐，含钙更多',
    kinds: ['lunch', 'dinner'], trimesters: [1, 2, 3], tags: ['补钙', '叶酸'], avoidTags: [],
    ingredients: [
      { name: '北豆腐', amount: '200g', category: '豆制品' },
      { name: '菠菜', amount: '200g', category: '蔬菜' },
      { name: '大米', amount: '50g', category: '主食' },
      { name: '燕麦米', amount: '30g', category: '主食' },
    ],
    steps: ['豆腐切块焯水，用豆瓣酱以外的酱汁（生抽、少许糖、淀粉水）烧 5 分钟', '菠菜焯水后快炒', '杂粮饭同前'],
  },
]

const byId = new Map(RECIPES.map((r) => [r.id, r]))

export function getRecipe(id: string): Recipe | undefined {
  return byId.get(id)
}
```

- [ ] **Step 4: 按同样格式扩充到约 100 份，直到 Step 1 的测试全部通过**

扩充要求：
- 每个孕期的早餐、午餐、晚餐、加餐都至少有 8 份可选（测试会检查）。午餐和晚餐的套餐可以同时标注 `['lunch', 'dinner']`。
- 孕早期侧重 `叶酸`、`清淡止吐`、`补碘`；孕中、晚期侧重 `补铁`、`补钙`、`DHA`、`蛋白质`。另外准备至少 10 份标注 `控糖` 的低升糖套餐（主食用杂粮，少糖）。
- 至少 15 份不含肉禽和水产的素食套餐，保证选择「素食」后每个餐次仍然够用。
- 含辣椒的菜标 `辣`；含羊肉、牛肉、猪肉的分别标对应 tag；含鸡蛋的标 `蛋`；含奶制品的标 `奶`；含坚果的标 `坚果`；含香菜的标 `香菜`。
- 食材名称尽量使用 `foods.ts` 里的写法，方便以后关联。
- 只用家常食材，做法每份 2–4 步，单份烹饪时间控制在 40 分钟以内（炖菜除外）。

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm vitest run tests/content/recipes.test.ts`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/content/recipes.ts tests/content/recipes.test.ts
git commit -m "feat(content): add meal recipe library"
```

---

### Task 12: 三餐推荐 `core/random.ts` + `core/mealPlanner.ts`

**Files:**
- Create: `src/core/random.ts`、`src/core/mealPlanner.ts`
- Test: `tests/core/mealPlanner.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
import { describe, it, expect } from 'vitest'
import { planDay, swapDish, isExcluded, PLAN_SLOTS, type PlanContext } from '@/core/mealPlanner'
import { hashString, mulberry32 } from '@/core/random'
import type { Recipe, MealKind, Trimester } from '@/content/types'

function r(id: string, kinds: MealKind[], opts: Partial<Recipe> = {}): Recipe {
  return {
    id, name: id, tip: 't', kinds, trimesters: [1, 2, 3] as Trimester[], tags: ['蛋白质'],
    avoidTags: [], ingredients: [{ name: '大米', amount: '1', category: '主食' }], steps: ['s'], ...opts,
  }
}

const library: Recipe[] = [
  r('b1', ['breakfast']), r('b2', ['breakfast']), r('b3', ['breakfast'], { avoidTags: ['蛋'] }),
  r('s1', ['snack']), r('s2', ['snack']), r('s3', ['snack']),
  r('m1', ['lunch', 'dinner'], { avoidTags: ['辣'] }), r('m2', ['lunch', 'dinner']), r('m3', ['lunch', 'dinner']),
  r('m4', ['lunch', 'dinner'], { trimesters: [1], tags: ['补铁'] }),
  r('m5', ['lunch', 'dinner'], { ingredients: [{ name: '香菜', amount: '1', category: '蔬菜' }] }),
]

const ctx = (over: Partial<PlanContext> = {}): PlanContext => ({
  trimester: 2, exclusions: { tags: [], ingredients: [] }, recentIds: [], seed: '2026-10-14', recipes: library, ...over,
})

describe('random', () => {
  it('is deterministic per seed', () => {
    const a = mulberry32(hashString('x'))
    const b = mulberry32(hashString('x'))
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
    expect(mulberry32(hashString('y'))()).not.toBe(mulberry32(hashString('x'))())
  })
})

describe('mealPlanner', () => {
  it('fills all five slots with matching kinds and no duplicates', () => {
    const plan = planDay(ctx())
    expect(Object.keys(plan).sort()).toEqual(PLAN_SLOTS.map((s) => s.key).sort())
    expect(plan.breakfast).toMatch(/^b/)
    expect(plan.snackAm).toMatch(/^s/)
    expect(plan.snackPm).toMatch(/^s/)
    expect(plan.lunch).toMatch(/^m/)
    expect(plan.dinner).toMatch(/^m/)
    const ids = Object.values(plan)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('is deterministic for the same seed', () => {
    expect(planDay(ctx())).toEqual(planDay(ctx()))
  })

  it('never picks excluded recipes, even when options run out', () => {
    for (let i = 0; i < 30; i++) {
      const plan = planDay(ctx({ seed: `d${i}`, exclusions: { tags: ['辣', '蛋'], ingredients: ['香菜'] } }))
      expect(Object.values(plan)).not.toContain('m1')
      expect(Object.values(plan)).not.toContain('b3')
      expect(Object.values(plan)).not.toContain('m5')
    }
  })

  it('prefers recipes for the current trimester', () => {
    for (let i = 0; i < 30; i++) {
      const plan = planDay(ctx({ seed: `d${i}` }))
      expect([plan.lunch, plan.dinner]).not.toContain('m4')
    }
  })

  it('avoids recently used recipes when possible', () => {
    for (let i = 0; i < 30; i++) {
      const plan = planDay(ctx({ seed: `d${i}`, recentIds: ['b1'] }))
      expect(plan.breakfast).not.toBe('b1')
    }
  })

  it('falls back to recent recipes rather than leaving a slot empty', () => {
    const plan = planDay(ctx({ recentIds: ['b1', 'b2', 'b3'] }))
    expect(plan.breakfast).not.toBeNull()
  })

  it('returns null when nothing is allowed', () => {
    const plan = planDay(ctx({ recipes: library.filter((x) => !x.kinds.includes('breakfast')) }))
    expect(plan.breakfast).toBeNull()
  })

  it('swaps one slot to a different recipe and keeps the rest', () => {
    const plan = planDay(ctx())
    for (let attempt = 1; attempt <= 10; attempt++) {
      const next = swapDish(plan, 'lunch', ctx(), attempt)
      expect(next.lunch).not.toBe(plan.lunch)
      expect(next.lunch).not.toBe(plan.dinner)
      expect({ ...next, lunch: plan.lunch }).toEqual(plan)
    }
  })

  it('keeps the plan when no alternative exists', () => {
    const only = [r('b1', ['breakfast']), r('s1', ['snack']), r('s2', ['snack']), r('m1', ['lunch', 'dinner']), r('m2', ['lunch', 'dinner'])]
    const c = ctx({ recipes: only })
    const plan = planDay(c)
    expect(swapDish(plan, 'breakfast', c, 1)).toEqual(plan)
  })

  it('detects exclusions by tag or ingredient', () => {
    expect(isExcluded(library[6], { tags: ['辣'], ingredients: [] })).toBe(true)
    expect(isExcluded(library[10], { tags: [], ingredients: ['香菜'] })).toBe(true)
    expect(isExcluded(library[0], { tags: [], ingredients: [''] })).toBe(false)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/mealPlanner.test.ts`
Expected: FAIL，找不到模块。

- [ ] **Step 3: 实现 `src/core/random.ts`**

```ts
export function hashString(s: string): number {
  let h = 2166136261
  for (const ch of s) {
    h ^= ch.codePointAt(0)!
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

- [ ] **Step 4: 实现 `src/core/mealPlanner.ts`**

```ts
import { hashString, mulberry32 } from './random'
import { RECIPES } from '@/content/recipes'
import { FOCUS_TAGS } from '@/content/nutrition'
import type { Exclusions, MealKind, PlanSlot, Recipe, Trimester } from '@/content/types'

export const PLAN_SLOTS: { key: PlanSlot; kind: MealKind; label: string; time: string }[] = [
  { key: 'breakfast', kind: 'breakfast', label: '早餐', time: '7:30' },
  { key: 'snackAm', kind: 'snack', label: '加餐', time: '10:00' },
  { key: 'lunch', kind: 'lunch', label: '午餐', time: '12:00' },
  { key: 'snackPm', kind: 'snack', label: '加餐', time: '15:30' },
  { key: 'dinner', kind: 'dinner', label: '晚餐', time: '18:30' },
]

export type DayPlan = Record<PlanSlot, string | null>

export interface PlanContext {
  trimester: Trimester
  exclusions: Exclusions
  recentIds: string[]
  seed: string
  recipes?: Recipe[]
}

export function isExcluded(recipe: Recipe, ex: Exclusions): boolean {
  if (recipe.avoidTags.some((t) => ex.tags.includes(t))) return true
  const words = ex.ingredients.map((w) => w.trim()).filter(Boolean)
  return words.some((w) => recipe.name.includes(w) || recipe.ingredients.some((i) => i.name.includes(w)))
}

function candidates(kind: MealKind, ctx: PlanContext, banned: Set<string>): Recipe[] {
  const base = (ctx.recipes ?? RECIPES).filter(
    (r) => r.kinds.includes(kind) && !banned.has(r.id) && !isExcluded(r, ctx.exclusions),
  )
  const recent = new Set(ctx.recentIds)
  const inTrimester = base.filter((r) => r.trimesters.includes(ctx.trimester))
  const tiers = [inTrimester.filter((r) => !recent.has(r.id)), inTrimester, base]
  return tiers.find((t) => t.length > 0) ?? []
}

function pick(list: Recipe[], rand: () => number, trimester: Trimester): Recipe | null {
  if (list.length === 0) return null
  const focus = FOCUS_TAGS[trimester]
  const weights = list.map((r) => 1 + 2 * r.tags.filter((t) => focus.includes(t)).length)
  let x = rand() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < list.length; i++) {
    x -= weights[i]
    if (x < 0) return list[i]
  }
  return list[list.length - 1]
}

export function planDay(ctx: PlanContext): DayPlan {
  const rand = mulberry32(hashString(ctx.seed))
  const used = new Set<string>()
  const plan = {} as DayPlan
  for (const slot of PLAN_SLOTS) {
    const chosen = pick(candidates(slot.kind, ctx, used), rand, ctx.trimester)
    plan[slot.key] = chosen?.id ?? null
    if (chosen) used.add(chosen.id)
  }
  return plan
}

export function swapDish(plan: DayPlan, slotKey: PlanSlot, ctx: PlanContext, attempt: number): DayPlan {
  const slot = PLAN_SLOTS.find((s) => s.key === slotKey)!
  const banned = new Set(Object.values(plan).filter((id): id is string => id !== null))
  const list = candidates(slot.kind, ctx, banned)
  if (list.length === 0) return plan
  const rand = mulberry32(hashString(`${ctx.seed}:${slotKey}:${attempt}`))
  return { ...plan, [slotKey]: pick(list, rand, ctx.trimester)!.id }
}
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/mealPlanner.test.ts`
Expected: PASS。

- [ ] **Step 6: 加一条针对真实套餐库的测试，追加到 `tests/core/mealPlanner.test.ts` 末尾**

```ts
import { RECIPES } from '@/content/recipes'
import { AVOID_OPTIONS } from '@/content/nutrition'

describe('mealPlanner with real library', () => {
  it('fills every slot for each trimester even with all avoid tags except 荤', () => {
    const tags = AVOID_OPTIONS.map((o) => o.tag).filter((t) => t !== '荤' && t !== '蛋' && t !== '奶')
    for (const trimester of [1, 2, 3] as const) {
      const plan = planDay({ trimester, exclusions: { tags, ingredients: [] }, recentIds: [], seed: 'x', recipes: RECIPES })
      expect(Object.values(plan).every((id) => id !== null), `trimester ${trimester}`).toBe(true)
    }
  })

  it('fills every slot for vegetarians', () => {
    for (const trimester of [1, 2, 3] as const) {
      const plan = planDay({ trimester, exclusions: { tags: ['荤'], ingredients: [] }, recentIds: [], seed: 'v', recipes: RECIPES })
      expect(Object.values(plan).every((id) => id !== null), `trimester ${trimester}`).toBe(true)
    }
  })
})
```

Run: `pnpm vitest run tests/core/mealPlanner.test.ts`
Expected: PASS。如果失败，回到 Task 11 Step 4 补充对应餐次的套餐，而不是放宽忌口过滤。

- [ ] **Step 7: 提交**

```bash
git add src/core/random.ts src/core/mealPlanner.ts tests/core/mealPlanner.test.ts
git commit -m "feat(core): deterministic meal planner with swap"
```

---

### Task 13: 购物清单 `core/shoppingList.ts`

**Files:**
- Create: `src/core/shoppingList.ts`
- Test: `tests/core/shoppingList.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
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
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/shoppingList.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 `src/core/shoppingList.ts`**

```ts
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
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/shoppingList.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/core/shoppingList.ts tests/core/shoppingList.test.ts
git commit -m "feat(core): build shopping list from meal plans"
```

---

### Task 14: 胎动计数和宫缩计时规则

**Files:**
- Create: `src/core/kickCounter.ts`、`src/core/contractionTimer.ts`
- Test: `tests/core/kickCounter.test.ts`、`tests/core/contractionTimer.test.ts`

- [ ] **Step 1: 写胎动测试 `tests/core/kickCounter.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { countKicks, assessKickSession, KICK_WINDOW_MS } from '@/core/kickCounter'

const MIN = 60_000

describe('kickCounter', () => {
  it('merges taps within 5 minutes into one movement', () => {
    expect(countKicks([0, 1 * MIN, 4 * MIN])).toBe(1)
    expect(countKicks([0, 5 * MIN, 6 * MIN, 11 * MIN])).toBe(3)
    expect(countKicks([])).toBe(0)
  })

  it('is done after 10 movements', () => {
    const taps = Array.from({ length: 10 }, (_, i) => i * 6 * MIN)
    expect(assessKickSession(0, taps, 61 * MIN).state).toBe('done')
  })

  it('is low when fewer than 10 movements after 2 hours', () => {
    const taps = Array.from({ length: 9 }, (_, i) => i * 6 * MIN)
    const r = assessKickSession(0, taps, KICK_WINDOW_MS)
    expect(r).toMatchObject({ count: 9, state: 'low', remainingMs: 0 })
  })

  it('is counting within the window', () => {
    expect(assessKickSession(0, [0], 30 * MIN)).toMatchObject({ count: 1, state: 'counting', remainingMs: 90 * MIN })
  })
})
```

- [ ] **Step 2: 写宫缩测试 `tests/core/contractionTimer.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { is511, withStats, type Contraction } from '@/core/contractionTimer'

const MIN = 60_000

function series(n: number, everyMin: number, durationSec: number, startAt = 0): Contraction[] {
  return Array.from({ length: n }, (_, i) => {
    const start = startAt + i * everyMin * MIN
    return { start, end: start + durationSec * 1000 }
  })
}

describe('contractionTimer', () => {
  it('computes duration and interval from previous start', () => {
    const s = withStats(series(3, 6, 50))
    expect(s.map((c) => c.durationSec)).toEqual([50, 50, 50])
    expect(s.map((c) => c.intervalMin)).toEqual([null, 6, 6])
  })

  it('detects 5-1-1 after an hour of regular contractions', () => {
    expect(is511(series(13, 5, 70))).toBe(true)
  })

  it('needs a full hour', () => {
    expect(is511(series(12, 5, 70))).toBe(false)
  })

  it('needs each contraction to last at least a minute', () => {
    expect(is511(series(13, 5, 50))).toBe(false)
  })

  it('only counts the latest unbroken streak', () => {
    const early = series(6, 5, 70)
    const late = series(8, 5, 70, 25 * MIN + 10 * MIN)
    expect(is511([...early, ...late])).toBe(false)
  })

  it('ignores order of input', () => {
    expect(is511(series(13, 5, 70).reverse())).toBe(true)
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/kickCounter.test.ts tests/core/contractionTimer.test.ts`
Expected: FAIL。

- [ ] **Step 4: 实现 `src/core/kickCounter.ts`**

```ts
export const KICK_MERGE_MS = 5 * 60_000
export const KICK_WINDOW_MS = 2 * 60 * 60_000
export const KICK_TARGET = 10

export type KickState = 'counting' | 'done' | 'low'

export function countKicks(taps: number[]): number {
  let count = 0
  let groupStart = -Infinity
  for (const t of [...taps].sort((a, b) => a - b)) {
    if (t - groupStart >= KICK_MERGE_MS) {
      count += 1
      groupStart = t
    }
  }
  return count
}

export function assessKickSession(
  startedAt: number,
  taps: number[],
  now: number,
): { count: number; state: KickState; remainingMs: number } {
  const count = countKicks(taps)
  const remainingMs = Math.max(startedAt + KICK_WINDOW_MS - now, 0)
  if (count >= KICK_TARGET) return { count, state: 'done', remainingMs }
  if (remainingMs === 0) return { count, state: 'low', remainingMs }
  return { count, state: 'counting', remainingMs }
}
```

- [ ] **Step 5: 实现 `src/core/contractionTimer.ts`**

```ts
export interface Contraction {
  start: number
  end: number
}

export interface ContractionWithStats extends Contraction {
  durationSec: number
  intervalMin: number | null
}

const MIN = 60_000

export function withStats(list: Contraction[]): ContractionWithStats[] {
  const sorted = [...list].sort((a, b) => a.start - b.start)
  return sorted.map((c, i) => ({
    ...c,
    durationSec: Math.round((c.end - c.start) / 1000),
    intervalMin: i === 0 ? null : Math.round(((c.start - sorted[i - 1].start) / MIN) * 10) / 10,
  }))
}

export function is511(list: Contraction[]): boolean {
  const s = [...list].sort((a, b) => a.start - b.start)
  if (s.length < 2) return false
  const longEnough = (c: Contraction) => c.end - c.start >= MIN
  let i = s.length - 1
  if (!longEnough(s[i])) return false
  while (i > 0 && s[i].start - s[i - 1].start <= 5 * MIN && longEnough(s[i - 1])) i--
  return s[s.length - 1].start - s[i].start >= 60 * MIN
}
```

- [ ] **Step 6: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/kickCounter.test.ts tests/core/contractionTimer.test.ts`
Expected: PASS。

- [ ] **Step 7: 提交**

```bash
git add src/core/kickCounter.ts src/core/contractionTimer.ts tests/core/kickCounter.test.ts tests/core/contractionTimer.test.ts
git commit -m "feat(core): kick counting and 5-1-1 contraction rules"
```

---

### Task 15: 孕周、危险信号、待产包内容

**Files:**
- Create: `src/content/weeks.ts`、`src/content/redflags.ts`、`src/content/birthBag.ts`
- Test: `tests/content/weeks.test.ts`

- [ ] **Step 1: 写测试 `tests/content/weeks.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { WEEKS, getWeekInfo } from '@/content/weeks'
import { RED_FLAGS } from '@/content/redflags'
import { BIRTH_BAG } from '@/content/birthBag'

describe('WEEKS', () => {
  it('covers weeks 4 to 40 in order', () => {
    expect(WEEKS.map((w) => w.week)).toEqual(Array.from({ length: 37 }, (_, i) => i + 4))
  })
  it('has complete content for every week', () => {
    for (const w of WEEKS) {
      expect(w.fruit, `w${w.week}`).not.toBe('')
      expect(w.baby.length, `w${w.week}`).toBeGreaterThan(10)
      expect(w.mom.length, `w${w.week}`).toBeGreaterThan(10)
      expect(w.tips.length, `w${w.week}`).toBeGreaterThanOrEqual(2)
      expect(w.tips.length, `w${w.week}`).toBeLessThanOrEqual(3)
    }
  })
  it('grows monotonically from week 8', () => {
    const from8 = WEEKS.filter((w) => w.week >= 8)
    for (let i = 1; i < from8.length; i++) {
      expect(from8[i].lengthCm).toBeGreaterThanOrEqual(from8[i - 1].lengthCm)
      expect(from8[i].weightG).toBeGreaterThanOrEqual(from8[i - 1].weightG)
    }
  })
  it('clamps lookups to the covered range', () => {
    expect(getWeekInfo(2).week).toBe(4)
    expect(getWeekInfo(24).week).toBe(24)
    expect(getWeekInfo(41).week).toBe(40)
  })
})

describe('RED_FLAGS', () => {
  it('lists emergency items first', () => {
    const levels = RED_FLAGS.map((r) => r.level)
    expect(levels.indexOf('soon')).toBeGreaterThan(levels.lastIndexOf('emergency'))
  })
})

describe('BIRTH_BAG', () => {
  it('has unique ids', () => {
    expect(new Set(BIRTH_BAG.map((b) => b.id)).size).toBe(BIRTH_BAG.length)
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/content/weeks.test.ts`
Expected: FAIL，找不到模块。

- [ ] **Step 3: 写 `src/content/redflags.ts`**

```ts
import type { RedFlag } from './types'

export const RED_FLAGS: RedFlag[] = [
  { id: 'bleeding', symptom: '阴道出血', level: 'emergency', detail: '任何孕周出现出血，无论多少，都要马上去医院' },
  { id: 'fluid', symptom: '阴道流出清水样液体', level: 'emergency', detail: '可能是破水。平躺、垫高臀部，立即去医院' },
  { id: 'pain', symptom: '剧烈或持续的腹痛', level: 'emergency', detail: '腹部发硬、疼痛不缓解，可能是胎盘早剥等急症' },
  { id: 'kicks', symptom: '胎动明显减少或消失', level: 'emergency', detail: '孕 28 周后，2 小时胎动少于 10 次，或比平时明显减少' },
  { id: 'headache', symptom: '剧烈头痛、视物模糊、眼前闪光', level: 'emergency', detail: '可能是子痫前期，尤其伴有血压升高时' },
  { id: 'seizure', symptom: '抽搐或意识不清', level: 'emergency', detail: '立即拨打 120' },
  { id: 'breath', symptom: '呼吸困难、胸痛', level: 'emergency', detail: '可能是心肺问题或血栓，立即就医' },
  { id: 'preterm', symptom: '未满 37 周出现规律宫缩', level: 'emergency', detail: '每 10 分钟一次以上的规律发紧或腰酸，可能是早产' },
  { id: 'leg', symptom: '单侧小腿红肿疼痛', level: 'emergency', detail: '可能是下肢静脉血栓' },
  { id: 'fever-high', symptom: '高烧 38.5℃ 以上', level: 'emergency', detail: '高热对胎儿有影响，需要尽快就医并在医生指导下退烧' },
  { id: 'vomit', symptom: '剧烈呕吐，超过 24 小时吃不下、喝不下', level: 'soon', detail: '可能是妊娠剧吐，容易脱水，需要补液' },
  { id: 'swelling', symptom: '脸和手突然明显水肿', level: 'soon', detail: '脚踝轻度水肿常见，但突然加重或伴头痛要警惕血压问题' },
  { id: 'itch', symptom: '全身瘙痒，手心脚心最明显', level: 'soon', detail: '孕晚期可能是妊娠期肝内胆汁淤积症，需要抽血检查' },
  { id: 'urine', symptom: '排尿疼痛或灼烧感', level: 'soon', detail: '可能是尿路感染，孕期要及时治疗' },
  { id: 'fever', symptom: '低烧 37.5–38.5℃', level: 'soon', detail: '多喝水、物理降温，持续不退要就医' },
  { id: 'discharge', symptom: '白带异常、有异味或瘙痒', level: 'soon', detail: '可能是阴道炎，下次产检前就可以去看' },
]
```

- [ ] **Step 4: 写 `src/content/birthBag.ts`**

```ts
import type { BagItem } from './types'

const items: [BagItem['group'], string][] = [
  ['证件', '夫妻双方身份证'],
  ['证件', '医保卡 / 就诊卡'],
  ['证件', '产检手册和全部检查报告'],
  ['证件', '生育登记 / 准生证'],
  ['证件', '银行卡和少量现金'],
  ['妈妈', '产褥垫 10 片'],
  ['妈妈', '一次性内裤 10 条'],
  ['妈妈', '产妇卫生巾（日用、夜用）'],
  ['妈妈', '哺乳内衣 2 件'],
  ['妈妈', '防溢乳垫'],
  ['妈妈', '吸管杯'],
  ['妈妈', '防滑拖鞋'],
  ['妈妈', '洗漱用品和毛巾'],
  ['妈妈', '保暖外套和帽子'],
  ['妈妈', '红糖或能量零食（巧克力）'],
  ['宝宝', '新生儿纸尿裤（NB 码）'],
  ['宝宝', '湿巾和棉柔巾'],
  ['宝宝', '和尚服 2–3 套'],
  ['宝宝', '包被 / 抱被'],
  ['宝宝', '帽子和袜子'],
  ['宝宝', '奶瓶和一小罐奶粉（备用）'],
  ['宝宝', '护臀膏'],
  ['其他', '手机充电器和充电宝'],
  ['其他', '保温杯'],
  ['其他', '出院时宝宝用的安全座椅'],
]

export const BIRTH_BAG: BagItem[] = items.map(([group, name], i) => ({ id: `bag-${i + 1}`, group, name }))
```

- [ ] **Step 5: 写 `src/content/weeks.ts`，先写入以下两周作为格式样例**

```ts
import type { WeekInfo } from './types'

export const WEEKS: WeekInfo[] = [
  {
    week: 12, fruit: '青柠', fruitShape: 'round', fruitColor: '#A5C25C', lengthCm: 5.4, weightG: 14,
    baby: '五官基本成形，手指脚趾已经分开，开始会做吸吮和吞咽的动作。',
    mom: '早孕反应慢慢减轻，小腹开始微微隆起，流产风险明显下降。',
    tips: [
      { title: '预约 NT 和建档', detail: '11–13⁺⁶ 周之间做，很多医院要提前约' },
      { title: '叶酸继续吃', detail: '每天 400μg，可以一直吃到孕期结束' },
    ],
  },
  {
    week: 24, fruit: '玉米', fruitShape: 'long', fruitColor: '#F2C94C', lengthCm: 30, weightG: 600,
    baby: '宝宝开始能听到你的声音了，肺部在发育，皮肤还是皱皱的、半透明。',
    mom: '肚子明显变大，可能出现腰酸和小腿抽筋，胃口通常比较好。',
    tips: [
      { title: '少吃甜食和精米白面', detail: '要做糖耐了，主食换一半杂粮' },
      { title: '左侧卧睡更舒服', detail: '两腿间夹个枕头，缓解腰酸' },
      { title: '小腿抽筋是常见现象', detail: '多喝奶、睡前拉伸，频繁抽筋告诉医生' },
    ],
  },
]

export function getWeekInfo(week: number): WeekInfo {
  const w = Math.min(Math.max(Math.floor(week), 4), 40)
  return WEEKS.find((x) => x.week === w)!
}
```

- [ ] **Step 6: 按同样格式补齐第 4–40 周，按周数排序，直到 Step 1 的测试全部通过**

内容要求：
- 宝宝大小的水果类比、身长和体重参考国内常用的孕周科普资料（如权威医院或妇幼保健院发布的「胎儿发育周历」）；孕 20 周之前身长按头臀长计算，之后按头到脚的身长计算，所以从第 20 周起数值会跳一下，这是正常的。
- `fruitShape` 按水果的外形选：极早期（4–7 周）用 `seed`；樱桃、葡萄这类小圆果用 `berry`；柠檬、苹果、椰子这类用 `round`；香蕉、玉米、茄子这类用 `long`；白菜、生菜这类用 `leafy`。
- `tips` 每周 2–3 条，和当周产检安排保持一致：第 6–8 周提醒早孕 B 超，第 11–13 周提醒 NT 和建档，第 15–20 周提醒唐筛，第 20–24 周提醒大排畸，第 24–28 周提醒糖耐，第 28 周起提醒数胎动，第 35–37 周提醒 GBS 筛查，第 34 周起提醒准备待产包。
- 语气温和、具体、不吓人，不出现绝对化的医疗承诺。

- [ ] **Step 7: 运行测试，确认通过**

Run: `pnpm vitest run tests/content/weeks.test.ts`
Expected: PASS。

- [ ] **Step 8: 提交**

```bash
git add src/content/weeks.ts src/content/redflags.ts src/content/birthBag.ts tests/content/weeks.test.ts
git commit -m "feat(content): add weekly guide, red flags and birth bag checklist"
```

---

### Task 16: 首次设置校验 `core/profileValidation.ts`

**Files:**
- Create: `src/core/profileValidation.ts`
- Test: `tests/core/profileValidation.test.ts`

- [ ] **Step 1: 写失败的测试**

```ts
import { describe, it, expect } from 'vitest'
import { validateProfile, type ProfileFormInput } from '@/core/profileValidation'

const ok: ProfileFormInput = {
  dateMode: 'due', date: '2027-01-31', heightCm: 160, preWeightKg: 55,
  avoidTags: ['辣'], customAvoid: '香菜， 芹菜 ,', hospital: ' 市妇幼 ',
}

describe('validateProfile', () => {
  it('accepts a valid due date and normalizes fields', () => {
    const r = validateProfile(ok, '2026-10-14')
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.dueDate).toBe('2027-01-31')
      expect(r.value.exclusions).toEqual({ tags: ['辣'], ingredients: ['香菜', '芹菜'] })
      expect(r.value.hospital).toBe('市妇幼')
    }
  })

  it('converts LMP to due date', () => {
    const r = validateProfile({ ...ok, dateMode: 'lmp', date: '2026-04-26' }, '2026-10-14')
    expect(r.ok && r.value.dueDate).toBe('2027-01-31')
  })

  it('rejects missing or implausible dates', () => {
    const missing = validateProfile({ ...ok, date: '' }, '2026-10-14')
    expect(!missing.ok && missing.errors.date).toBe('请选择日期')
    const far = validateProfile({ ...ok, date: '2028-01-01' }, '2026-10-14')
    expect(!far.ok && far.errors.date).toBe('日期看起来不对，请检查')
  })

  it('rejects out-of-range height and weight', () => {
    const r = validateProfile({ ...ok, heightCm: 90, preWeightKg: 200 }, '2026-10-14')
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errors.heightCm).toBeDefined()
      expect(r.errors.preWeightKg).toBeDefined()
    }
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `pnpm vitest run tests/core/profileValidation.test.ts`
Expected: FAIL。

- [ ] **Step 3: 实现 `src/core/profileValidation.ts`**

```ts
import { dueFromLmp, getStatus } from './pregnancy'
import type { DateStr } from './date'
import type { Exclusions } from '@/content/types'

export interface ProfileFormInput {
  dateMode: 'due' | 'lmp'
  date: DateStr
  heightCm: number
  preWeightKg: number
  avoidTags: string[]
  customAvoid: string
  hospital: string
}

export interface ProfileValues {
  dueDate: DateStr
  heightCm: number
  preWeightKg: number
  exclusions: Exclusions
  hospital?: string
}

export type ProfileErrors = Partial<Record<'date' | 'heightCm' | 'preWeightKg', string>>

export type ValidationResult = { ok: true; value: ProfileValues } | { ok: false; errors: ProfileErrors }

export function validateProfile(input: ProfileFormInput, today: DateStr): ValidationResult {
  const errors: ProfileErrors = {}
  let dueDate = ''
  if (!input.date) {
    errors.date = '请选择日期'
  } else {
    dueDate = input.dateMode === 'lmp' ? dueFromLmp(input.date) : input.date
    const { week } = getStatus(dueDate, today)
    if (week < 0 || week > 42) errors.date = '日期看起来不对，请检查'
  }
  if (!(input.heightCm >= 120 && input.heightCm <= 200)) errors.heightCm = '身高请填 120–200 厘米'
  if (!(input.preWeightKg >= 30 && input.preWeightKg <= 150)) errors.preWeightKg = '体重请填 30–150 公斤'
  if (Object.keys(errors).length) return { ok: false, errors }

  const ingredients = input.customAvoid.split(/[,，、\s]+/).map((s) => s.trim()).filter(Boolean)
  const hospital = input.hospital.trim()
  return {
    ok: true,
    value: {
      dueDate,
      heightCm: input.heightCm,
      preWeightKg: input.preWeightKg,
      exclusions: { tags: [...input.avoidTags], ingredients },
      ...(hospital ? { hospital } : {}),
    },
  }
}
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm vitest run tests/core/profileValidation.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/core/profileValidation.ts tests/core/profileValidation.test.ts
git commit -m "feat(core): validate onboarding profile input"
```

---

### Task 17: 本地数据库和备份 `db/`

**Files:**
- Create: `src/db/index.ts`、`src/db/backup.ts`
- Test: `tests/db/backup.test.ts`

- [ ] **Step 1: 实现 `src/db/index.ts`**

```ts
import Dexie, { type Table } from 'dexie'
import type { DateStr } from '@/core/date'
import type { DayPlan } from '@/core/mealPlanner'
import type { CheckupOverride } from '@/core/checkupSchedule'
import type { Exclusions, PlanSlot, SupplementId } from '@/content/types'

export interface AiSettings {
  baseUrl: string
  apiKey: string
  model: string
}

export interface Profile {
  id: 'me'
  dueDate: DateStr
  heightCm: number
  preWeightKg: number
  exclusions: Exclusions
  hospital?: string
  supplementIds?: SupplementId[]
  ai?: AiSettings
  createdAt: number
}

export interface MealLog {
  date: DateStr
  plan: DayPlan
  eaten: PlanSlot[]
  swaps: number
}

export interface SupplementLog {
  key: string
  date: DateStr
  supplementId: SupplementId
}

export interface WeightEntry {
  date: DateStr
  kg: number
}

export interface KickSession {
  id?: number
  startedAt: number
  taps: number[]
  endedAt?: number
}

export interface ContractionRow {
  id?: number
  start: number
  end: number
}

export interface BagCheck {
  id: string
  checked: boolean
}

export class AppDB extends Dexie {
  profile!: Table<Profile, string>
  mealLogs!: Table<MealLog, string>
  supplementLogs!: Table<SupplementLog, string>
  weights!: Table<WeightEntry, string>
  kickSessions!: Table<KickSession, number>
  contractions!: Table<ContractionRow, number>
  checkupOverrides!: Table<CheckupOverride, string>
  bagChecklist!: Table<BagCheck, string>

  constructor(name = 'yunqi-xiaoban', options?: ConstructorParameters<typeof Dexie>[1]) {
    super(name, options)
    this.version(1).stores({
      profile: 'id',
      mealLogs: 'date',
      supplementLogs: 'key, date',
      weights: 'date',
      kickSessions: '++id, startedAt',
      contractions: '++id, start',
      checkupOverrides: 'id',
      bagChecklist: 'id',
    })
  }
}

let current = new AppDB()
let persistent = true

export function getDb(): AppDB {
  return current
}

export function isPersistent(): boolean {
  return persistent
}

export async function initDb(): Promise<{ persistent: boolean }> {
  try {
    await current.open()
    persistent = true
  } catch {
    const { indexedDB, IDBKeyRange } = await import('fake-indexeddb')
    current = new AppDB('yunqi-xiaoban-memory', { indexedDB, IDBKeyRange })
    await current.open()
    persistent = false
  }
  return { persistent }
}

export function plain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
```

- [ ] **Step 2: 写失败的备份测试 `tests/db/backup.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { AppDB } from '@/db'
import { exportBackup, parseBackup, importBackup, BackupError } from '@/db/backup'

let db: AppDB

beforeEach(async () => {
  db = new AppDB(`test-${Math.random()}`)
  await db.open()
  await db.profile.put({
    id: 'me', dueDate: '2027-01-31', heightCm: 160, preWeightKg: 55,
    exclusions: { tags: [], ingredients: [] }, createdAt: 1,
    ai: { baseUrl: 'https://api.example.com/v1', apiKey: 'sk-secret', model: 'm' },
  })
  await db.weights.put({ date: '2026-10-14', kg: 60 })
})

describe('backup', () => {
  it('exports all tables without the API key', async () => {
    const file = await exportBackup(db)
    expect(file.app).toBe('yunqi-xiaoban')
    expect(file.version).toBe(1)
    expect(file.tables.weights).toEqual([{ date: '2026-10-14', kg: 60 }])
    expect(JSON.stringify(file)).not.toContain('sk-secret')
  })

  it('round-trips through JSON and keeps the local API key', async () => {
    const text = JSON.stringify(await exportBackup(db))
    await db.weights.put({ date: '2026-10-20', kg: 61 })
    await importBackup(parseBackup(text), db)
    expect(await db.weights.toArray()).toEqual([{ date: '2026-10-14', kg: 60 }])
    expect((await db.profile.get('me'))?.ai?.apiKey).toBe('sk-secret')
  })

  it('rejects malformed files without touching data', async () => {
    expect(() => parseBackup('not json')).toThrow(BackupError)
    expect(() => parseBackup(JSON.stringify({ app: 'other', version: 1, tables: {} }))).toThrow('不是孕期小伴的备份文件')
    expect(() => parseBackup(JSON.stringify({ app: 'yunqi-xiaoban', version: 99, tables: {} }))).toThrow('备份版本不支持')
    expect(await db.weights.count()).toBe(1)
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm vitest run tests/db/backup.test.ts`
Expected: FAIL，找不到 `@/db/backup`。

- [ ] **Step 4: 实现 `src/db/backup.ts`**

```ts
import { getDb, type AppDB, type Profile } from './index'

export const BACKUP_VERSION = 1

export const TABLE_NAMES = [
  'profile', 'mealLogs', 'supplementLogs', 'weights',
  'kickSessions', 'contractions', 'checkupOverrides', 'bagChecklist',
] as const

type TableName = (typeof TABLE_NAMES)[number]

export interface BackupFile {
  app: 'yunqi-xiaoban'
  version: number
  exportedAt: string
  tables: Record<TableName, unknown[]>
}

export class BackupError extends Error {}

export async function exportBackup(db: AppDB = getDb()): Promise<BackupFile> {
  const tables = {} as Record<TableName, unknown[]>
  for (const name of TABLE_NAMES) tables[name] = await db.table(name).toArray()
  tables.profile = (tables.profile as Profile[]).map(({ ai, ...rest }) =>
    ai ? { ...rest, ai: { ...ai, apiKey: '' } } : rest,
  )
  return { app: 'yunqi-xiaoban', version: BACKUP_VERSION, exportedAt: new Date().toISOString(), tables }
}

export function parseBackup(text: string): BackupFile {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new BackupError('文件格式不正确')
  }
  const file = data as Partial<BackupFile>
  if (file?.app !== 'yunqi-xiaoban') throw new BackupError('不是孕期小伴的备份文件')
  if (file.version !== BACKUP_VERSION) throw new BackupError('备份版本不支持')
  if (!file.tables || typeof file.tables !== 'object') throw new BackupError('备份内容缺失')
  for (const name of TABLE_NAMES) {
    if (!Array.isArray(file.tables[name])) throw new BackupError(`备份缺少数据：${name}`)
  }
  return file as BackupFile
}

export async function importBackup(file: BackupFile, db: AppDB = getDb()): Promise<void> {
  const localKey = (await db.profile.get('me'))?.ai?.apiKey ?? ''
  await db.transaction('rw', TABLE_NAMES.map((n) => db.table(n)), async () => {
    for (const name of TABLE_NAMES) {
      await db.table(name).clear()
      await db.table(name).bulkPut(file.tables[name])
    }
    const profile = await db.profile.get('me')
    if (profile?.ai && !profile.ai.apiKey && localKey) {
      await db.profile.put({ ...profile, ai: { ...profile.ai, apiKey: localKey } })
    }
  })
}
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `pnpm vitest run tests/db/backup.test.ts`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/db tests/db
git commit -m "feat(db): Dexie schema with export/import backup"
```

---

### Task 18: Pinia stores 和时钟

**Files:**
- Create: `src/composables/useClock.ts`、`src/stores/profile.ts`、`src/stores/meals.ts`、`src/stores/records.ts`
- Test: `tests/stores/meals.test.ts`

- [ ] **Step 1: 实现 `src/composables/useClock.ts`**

```ts
import { ref } from 'vue'
import { todayStr } from '@/core/date'

const today = ref(todayStr())
const hour = ref(new Date().getHours())
let started = false

function tick() {
  const now = new Date()
  today.value = todayStr(now)
  hour.value = now.getHours()
}

export function useClock() {
  if (!started && typeof window !== 'undefined') {
    started = true
    tick()
    setInterval(tick, 60_000)
    document.addEventListener('visibilitychange', tick)
  }
  return { today, hour, tick }
}
```

- [ ] **Step 2: 实现 `src/stores/profile.ts`**

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDb, initDb, plain, type AiSettings, type Profile } from '@/db'
import type { ProfileValues } from '@/core/profileValidation'
import type { SupplementId } from '@/content/types'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const loaded = ref(false)
  const persistent = ref(true)

  async function load() {
    if (loaded.value) return
    persistent.value = (await initDb()).persistent
    profile.value = (await getDb().profile.get('me')) ?? null
    loaded.value = true
  }

  async function reload() {
    profile.value = (await getDb().profile.get('me')) ?? null
  }

  async function write(next: Profile) {
    await getDb().profile.put(plain(next))
    profile.value = next
  }

  async function saveBasics(values: ProfileValues) {
    const base = profile.value ?? ({ id: 'me', createdAt: Date.now() } as Profile)
    const next: Profile = { ...base, ...values, id: 'me' }
    if (!values.hospital) delete next.hospital
    await write(next)
  }

  async function saveSupplements(ids: SupplementId[] | undefined) {
    if (!profile.value) return
    const next = { ...profile.value }
    if (ids) next.supplementIds = ids
    else delete next.supplementIds
    await write(next)
  }

  async function saveAi(ai: AiSettings | undefined) {
    if (!profile.value) return
    const next = { ...profile.value }
    if (ai) next.ai = ai
    else delete next.ai
    await write(next)
  }

  const aiReady = computed(() => !!profile.value?.ai?.apiKey && !!profile.value.ai.baseUrl)

  return { profile, loaded, persistent, aiReady, load, reload, saveBasics, saveSupplements, saveAi }
})
```

- [ ] **Step 3: 实现 `src/stores/meals.ts`**

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDb, plain, type MealLog } from '@/db'
import { addDays, type DateStr } from '@/core/date'
import { getStatus } from '@/core/pregnancy'
import { planDay, swapDish, type PlanContext } from '@/core/mealPlanner'
import { useProfileStore } from './profile'
import type { PlanSlot } from '@/content/types'

export const useMealsStore = defineStore('meals', () => {
  const logs = ref<Record<DateStr, MealLog>>({})

  async function readLog(date: DateStr): Promise<MealLog | undefined> {
    return logs.value[date] ?? (await getDb().mealLogs.get(date))
  }

  async function recentIdsBefore(date: DateStr): Promise<string[]> {
    const ids: string[] = []
    for (let i = 1; i <= 7; i++) {
      const log = await readLog(addDays(date, -i))
      if (log) ids.push(...Object.values(log.plan).filter((id): id is string => id !== null))
    }
    return ids
  }

  async function contextFor(date: DateStr): Promise<PlanContext> {
    const profile = useProfileStore().profile!
    return {
      trimester: getStatus(profile.dueDate, date).trimester,
      exclusions: profile.exclusions,
      recentIds: await recentIdsBefore(date),
      seed: date,
    }
  }

  async function persist(log: MealLog) {
    await getDb().mealLogs.put(plain(log))
    logs.value[log.date] = log
  }

  async function ensurePlans(dates: DateStr[]) {
    for (const date of [...dates].sort()) {
      if (logs.value[date]) continue
      const stored = await getDb().mealLogs.get(date)
      if (stored) {
        logs.value[date] = stored
        continue
      }
      await persist({ date, plan: planDay(await contextFor(date)), eaten: [], swaps: 0 })
    }
  }

  async function toggleEaten(date: DateStr, slot: PlanSlot) {
    const log = logs.value[date]
    if (!log) return
    const eaten = log.eaten.includes(slot) ? log.eaten.filter((s) => s !== slot) : [...log.eaten, slot]
    await persist({ ...log, eaten })
  }

  async function swap(date: DateStr, slot: PlanSlot) {
    const log = logs.value[date]
    if (!log) return
    const swaps = log.swaps + 1
    const plan = swapDish(log.plan, slot, await contextFor(date), swaps)
    await persist({ ...log, plan, swaps, eaten: log.eaten.filter((s) => s !== slot) })
  }

  async function resetFrom(date: DateStr) {
    await getDb().mealLogs.where('date').aboveOrEqual(date).delete()
    for (const key of Object.keys(logs.value)) if (key >= date) delete logs.value[key]
  }

  return { logs, ensurePlans, toggleEaten, swap, resetFrom }
})
```

- [ ] **Step 4: 实现 `src/stores/records.ts`**

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDb, plain, type WeightEntry } from '@/db'
import type { DateStr } from '@/core/date'
import type { CheckupOverride } from '@/core/checkupSchedule'
import type { SupplementId } from '@/content/types'

export const useRecordsStore = defineStore('records', () => {
  const supplementsTaken = ref<Record<DateStr, SupplementId[]>>({})
  const weights = ref<WeightEntry[]>([])
  const checkupOverrides = ref<CheckupOverride[]>([])
  const bag = ref<Record<string, boolean>>({})

  async function loadSupplements(date: DateStr) {
    const rows = await getDb().supplementLogs.where('date').equals(date).toArray()
    supplementsTaken.value[date] = rows.map((r) => r.supplementId)
  }

  async function toggleSupplement(date: DateStr, id: SupplementId) {
    const key = `${date}|${id}`
    const taken = supplementsTaken.value[date] ?? []
    if (taken.includes(id)) {
      await getDb().supplementLogs.delete(key)
      supplementsTaken.value[date] = taken.filter((x) => x !== id)
    } else {
      await getDb().supplementLogs.put({ key, date, supplementId: id })
      supplementsTaken.value[date] = [...taken, id]
    }
  }

  async function loadWeights() {
    weights.value = await getDb().weights.orderBy('date').toArray()
  }

  async function saveWeight(date: DateStr, kg: number) {
    await getDb().weights.put({ date, kg })
    await loadWeights()
  }

  async function deleteWeight(date: DateStr) {
    await getDb().weights.delete(date)
    await loadWeights()
  }

  async function loadCheckups() {
    checkupOverrides.value = await getDb().checkupOverrides.toArray()
  }

  async function updateCheckup(id: string, patch: Omit<CheckupOverride, 'id'>) {
    const current = checkupOverrides.value.find((o) => o.id === id) ?? { id }
    const next = { ...current, ...patch }
    await getDb().checkupOverrides.put(plain(next))
    await loadCheckups()
  }

  async function loadBag() {
    const rows = await getDb().bagChecklist.toArray()
    bag.value = Object.fromEntries(rows.map((r) => [r.id, r.checked]))
  }

  async function toggleBag(id: string) {
    const checked = !bag.value[id]
    await getDb().bagChecklist.put({ id, checked })
    bag.value = { ...bag.value, [id]: checked }
  }

  return {
    supplementsTaken, weights, checkupOverrides, bag,
    loadSupplements, toggleSupplement, loadWeights, saveWeight, deleteWeight,
    loadCheckups, updateCheckup, loadBag, toggleBag,
  }
})
```

- [ ] **Step 5: 写 store 测试 `tests/stores/meals.test.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '@/stores/profile'
import { useMealsStore } from '@/stores/meals'
import { getDb } from '@/db'

beforeEach(async () => {
  setActivePinia(createPinia())
  const profile = useProfileStore()
  await profile.load()
  await getDb().mealLogs.clear()
  await profile.saveBasics({
    dueDate: '2027-01-31', heightCm: 160, preWeightKg: 55, exclusions: { tags: ['辣'], ingredients: [] },
  })
})

describe('meals store', () => {
  it('generates, persists and reuses a day plan', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-14'])
    const first = meals.logs['2026-10-14'].plan
    expect(Object.values(first).every((id) => id !== null)).toBe(true)
    expect((await getDb().mealLogs.get('2026-10-14'))?.plan).toEqual(first)

    setActivePinia(createPinia())
    await useProfileStore().load()
    const again = useMealsStore()
    await again.ensurePlans(['2026-10-14'])
    expect(again.logs['2026-10-14'].plan).toEqual(first)
  })

  it('swaps a slot and clears its eaten mark', async () => {
    const meals = useMealsStore()
    await meals.ensurePlans(['2026-10-14'])
    await meals.toggleEaten('2026-10-14', 'lunch')
    const before = meals.logs['2026-10-14'].plan.lunch
    await meals.swap('2026-10-14', 'lunch')
    expect(meals.logs['2026-10-14'].plan.lunch).not.toBe(before)
    expect(meals.logs['2026-10-14'].eaten).not.toContain('lunch')
  })
})
```

- [ ] **Step 6: 运行测试，确认通过**

Run: `pnpm vitest run tests/stores/meals.test.ts`
Expected: PASS。

- [ ] **Step 7: 提交**

```bash
git add src/composables src/stores tests/stores
git commit -m "feat: add profile, meals and records stores"
```

---

### Task 19: 应用外壳、路由和通用组件

**Files:**
- Create: `src/router.ts`、`src/components/AppTabBar.vue`、`src/components/PageHeader.vue`、`src/components/SectionHead.vue`、`src/components/NutrientTag.vue`、`src/components/Disclaimer.vue`、`src/components/StorageBanner.vue`、`src/components/InstallHint.vue`
- Create（占位，后续任务填充）：`src/views/TodayView.vue`、`src/views/EatView.vue`、`src/views/PregnancyView.vue`、`src/views/MeView.vue`、`src/views/OnboardingView.vue`
- Modify: `src/App.vue`、`src/main.ts`

- [ ] **Step 1: 写 `src/router.ts`**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/onboarding', component: () => import('@/views/OnboardingView.vue'), meta: { hideTabs: true } },
    { path: '/', component: () => import('@/views/TodayView.vue') },
    { path: '/eat', component: () => import('@/views/EatView.vue') },
    { path: '/eat/week', component: () => import('@/views/WeekPlanView.vue') },
    { path: '/eat/shopping', component: () => import('@/views/ShoppingView.vue') },
    { path: '/eat/ai', component: () => import('@/views/AskAiView.vue') },
    { path: '/pregnancy', component: () => import('@/views/PregnancyView.vue') },
    { path: '/pregnancy/checkups', component: () => import('@/views/CheckupsView.vue') },
    { path: '/pregnancy/redflags', component: () => import('@/views/RedFlagsView.vue') },
    { path: '/me', component: () => import('@/views/MeView.vue') },
    { path: '/me/weight', component: () => import('@/views/WeightView.vue') },
    { path: '/me/kicks', component: () => import('@/views/KicksView.vue') },
    { path: '/me/contractions', component: () => import('@/views/ContractionsView.vue') },
    { path: '/me/bag', component: () => import('@/views/BagView.vue') },
    { path: '/me/settings', component: () => import('@/views/SettingsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const profile = useProfileStore()
  await profile.load()
  if (!profile.profile && to.path !== '/onboarding') return '/onboarding'
  if (profile.profile && to.path === '/onboarding') return '/'
})
```

本任务先为路由表里的每个页面建一个占位文件，内容统一为：

```vue
<template>
  <main class="page"><p class="muted">建设中</p></main>
</template>
```

需要建的占位页面：`TodayView`、`EatView`、`WeekPlanView`、`ShoppingView`、`AskAiView`、`PregnancyView`、`CheckupsView`、`RedFlagsView`、`MeView`、`WeightView`、`KicksView`、`ContractionsView`、`BagView`、`SettingsView`、`OnboardingView`（都放在 `src/views/`）。

- [ ] **Step 2: 写 `src/components/AppTabBar.vue`**（图标和样式与视觉稿一致）

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const tabs = [
  { to: '/', label: '今天', icon: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' },
  { to: '/eat', label: '吃', icon: 'M4 13h16a8 8 0 0 1-16 0zM9 9c0-2 1.5-2.5 1.5-4.5M14 9c0-2 1.5-2.5 1.5-4.5' },
  { to: '/pregnancy', label: '孕期', icon: 'M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z' },
  { to: '/me', label: '我的', icon: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <nav class="tabbar">
    <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" class="tab" :class="{ active: isActive(t.to) }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path :d="t.icon" />
      </svg>
      {{ t.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed; left: 50%; transform: translateX(-50%); bottom: 0;
  width: 100%; max-width: 430px;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: rgba(251, 246, 238, .86);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  backdrop-filter: blur(16px) saturate(1.4);
  border-top: 1px solid var(--line);
  z-index: 10;
}
.tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  font-size: 11px; color: var(--ink-faint); position: relative; text-decoration: none;
}
.tab.active { color: var(--ink); font-weight: 600; }
.tab.active::after {
  content: ""; position: absolute; top: 6px; left: 50%; margin-left: 9px;
  width: 6px; height: 6px; border-radius: 50%; background: var(--apricot);
}
</style>
```

- [ ] **Step 3: 写 `src/components/PageHeader.vue`**（二级页面的返回栏）

```vue
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <header class="ph">
    <button class="back" aria-label="返回" @click="$router.back()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <h1>{{ title }}</h1>
    <div class="slot"><slot /></div>
  </header>
</template>

<style scoped>
.ph { display: grid; grid-template-columns: 40px 1fr auto; align-items: center; gap: 8px; margin-bottom: 18px; }
.back { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); display: grid; place-items: center; }
h1 { margin: 0; font-family: var(--font-title); font-size: 20px; font-weight: 600; }
</style>
```

- [ ] **Step 4: 写 `src/components/SectionHead.vue`**

```vue
<script setup lang="ts">
defineProps<{ idx?: string; title: string }>()
</script>

<template>
  <div class="head">
    <h2><span v-if="idx" class="idx">{{ idx }}</span>{{ title }}</h2>
    <span class="aside"><slot /></span>
  </div>
</template>

<style scoped>
.head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
h2 { margin: 0; font-family: var(--font-title); font-size: 19px; font-weight: 600; display: flex; align-items: baseline; gap: 8px; }
.idx { font-family: var(--font-display); font-style: italic; font-weight: 400; font-size: 15px; color: var(--apricot); }
.aside { font-size: 12.5px; color: var(--ink-faint); }
.aside :deep(a) { color: inherit; text-decoration: none; }
</style>
```

- [ ] **Step 5: 写 `src/components/NutrientTag.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ tag: string }>()
const CLASS: Record<string, string> = { 补铁: 'iron', 补钙: 'calcium', DHA: 'dha', 叶酸: 'folate' }
const cls = computed(() => CLASS[props.tag] ?? 'other')
</script>

<template>
  <span class="tag" :class="cls">{{ tag }}</span>
</template>
```

- [ ] **Step 6: 写 `src/components/Disclaimer.vue`**

```vue
<template>
  <p class="disclaimer">内容参考《中国居民膳食指南（2022）》等资料<br />仅供参考，请以医生意见为准</p>
</template>

<style scoped>
.disclaimer { margin-top: 26px; text-align: center; font-size: 11.5px; color: var(--ink-faint); line-height: 1.6; }
</style>
```

- [ ] **Step 7: 写 `src/components/StorageBanner.vue`**

```vue
<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'

const profile = useProfileStore()
</script>

<template>
  <div v-if="profile.loaded && !profile.persistent" class="banner">
    当前浏览器无法保存数据（可能是无痕模式），关闭页面后记录会丢失
  </div>
</template>

<style scoped>
.banner {
  position: sticky; top: 0; z-index: 20; max-width: 430px; margin: 0 auto;
  padding: calc(env(safe-area-inset-top) + 8px) 16px 8px;
  background: var(--alert-soft); color: var(--alert); font-size: 12.5px; text-align: center;
}
</style>
```

- [ ] **Step 8: 写 `src/components/InstallHint.vue`**（iPhone Safari 且未添加到桌面时显示）

```vue
<script setup lang="ts">
import { ref } from 'vue'

const KEY = 'install-hint-dismissed'
const ua = navigator.userAgent
const isIos = /iPhone|iPad|iPod/.test(ua)
const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
const show = ref(isIos && !standalone && !localStorage.getItem(KEY))

function dismiss() {
  localStorage.setItem(KEY, '1')
  show.value = false
}
</script>

<template>
  <div v-if="show" class="hint">
    <span>点底部「分享」→「添加到主屏幕」，用起来像 App 一样</span>
    <button aria-label="关闭" @click="dismiss">×</button>
  </div>
</template>

<style scoped>
.hint {
  position: fixed; left: 50%; transform: translateX(-50%);
  bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 12px);
  width: calc(100% - 32px); max-width: 398px; z-index: 15;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px; border-radius: var(--radius-md);
  background: var(--ink); color: var(--paper); font-size: 13px;
}
.hint button { margin-left: auto; border: 0; background: none; color: inherit; font-size: 20px; line-height: 1; }
</style>
```

- [ ] **Step 9: 改 `src/App.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTabBar from '@/components/AppTabBar.vue'
import StorageBanner from '@/components/StorageBanner.vue'
import InstallHint from '@/components/InstallHint.vue'

const route = useRoute()
const showTabs = computed(() => !route.meta.hideTabs)
</script>

<template>
  <StorageBanner />
  <RouterView />
  <template v-if="showTabs">
    <InstallHint />
    <AppTabBar />
  </template>
</template>
```

- [ ] **Step 10: 改 `src/main.ts`**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/fraunces'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.vue'
import { router } from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
```

- [ ] **Step 11: 验证**

Run: `pnpm test && pnpm build`
Expected: 全部通过。再运行 `pnpm dev`，在浏览器打开 http://localhost:5173，应自动跳到 `/onboarding` 的占位页。

- [ ] **Step 12: 删除冒烟测试并提交**

```bash
git rm tests/smoke.test.ts
git add -A
git commit -m "feat: app shell, router guard and shared components"
```

---

### Task 20: 首次设置页面

**Files:**
- Create: `src/components/ProfileForm.vue`
- Modify: `src/views/OnboardingView.vue`
- Test: `tests/views/onboarding.test.ts`

- [ ] **Step 1: 写 `src/components/ProfileForm.vue`**（首次设置和设置页共用）

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AVOID_OPTIONS } from '@/content/nutrition'
import { validateProfile, type ProfileErrors, type ProfileFormInput, type ProfileValues } from '@/core/profileValidation'
import { useClock } from '@/composables/useClock'

const props = defineProps<{ initial?: Partial<ProfileFormInput>; submitLabel: string }>()
const emit = defineEmits<{ submit: [values: ProfileValues] }>()

const { today } = useClock()
const init = props.initial ?? {}
const form = reactive({
  dateMode: init.dateMode ?? ('due' as ProfileFormInput['dateMode']),
  date: init.date ?? '',
  avoidTags: [...(init.avoidTags ?? [])],
  customAvoid: init.customAvoid ?? '',
  hospital: init.hospital ?? '',
})
const height = ref(init.heightCm ? String(init.heightCm) : '')
const weight = ref(init.preWeightKg ? String(init.preWeightKg) : '')
const errors = ref<ProfileErrors>({})

function toggleTag(tag: string) {
  form.avoidTags = form.avoidTags.includes(tag) ? form.avoidTags.filter((t) => t !== tag) : [...form.avoidTags, tag]
}

function submit() {
  const r = validateProfile({ ...form, heightCm: Number(height.value), preWeightKg: Number(weight.value) }, today.value)
  if (!r.ok) {
    errors.value = r.errors
    return
  }
  errors.value = {}
  emit('submit', r.value)
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="chips mode">
      <button type="button" class="chip" :class="{ on: form.dateMode === 'due' }" @click="form.dateMode = 'due'">我知道预产期</button>
      <button type="button" class="chip" :class="{ on: form.dateMode === 'lmp' }" @click="form.dateMode = 'lmp'">填末次月经</button>
    </div>
    <label class="field">
      <span>{{ form.dateMode === 'due' ? '预产期' : '末次月经第一天' }}</span>
      <input v-model="form.date" type="date" name="date" />
      <div v-if="errors.date" class="error">{{ errors.date }}</div>
    </label>
    <div class="row">
      <label class="field">
        <span>身高（厘米）</span>
        <input v-model="height" type="number" inputmode="decimal" name="height" />
        <div v-if="errors.heightCm" class="error">{{ errors.heightCm }}</div>
      </label>
      <label class="field">
        <span>孕前体重（公斤）</span>
        <input v-model="weight" type="number" inputmode="decimal" step="0.1" name="weight" />
        <div v-if="errors.preWeightKg" class="error">{{ errors.preWeightKg }}</div>
      </label>
    </div>
    <div class="field">
      <span>忌口和过敏</span>
      <div class="chips">
        <button v-for="o in AVOID_OPTIONS" :key="o.tag" type="button" class="chip" :class="{ on: form.avoidTags.includes(o.tag) }" @click="toggleTag(o.tag)">
          {{ o.label }}
        </button>
      </div>
    </div>
    <label class="field">
      <span>其他不吃的食材（用逗号分开，可不填）</span>
      <input v-model="form.customAvoid" name="customAvoid" placeholder="例如：芹菜，茄子" />
    </label>
    <label class="field">
      <span>产检医院（可不填，会写进日历）</span>
      <input v-model="form.hospital" name="hospital" />
    </label>
    <button type="submit" class="btn dark block-btn submit">{{ submitLabel }}</button>
  </form>
</template>

<style scoped>
.mode { margin-top: 4px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.submit { margin-top: 28px; height: 48px; font-size: 15px; }
</style>
```

- [ ] **Step 2: 写 `src/views/OnboardingView.vue`**

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import ProfileForm from '@/components/ProfileForm.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useProfileStore } from '@/stores/profile'
import type { ProfileValues } from '@/core/profileValidation'

const router = useRouter()
const profile = useProfileStore()

async function onSubmit(values: ProfileValues) {
  await profile.saveBasics(values)
  await router.replace('/')
}
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <p class="faint kicker rise d1">孕期小伴</p>
    <h1 class="title rise d1">先认识一下你</h1>
    <p class="muted lead rise d2">只需要 1 分钟。所有信息只保存在这台手机上。</p>
    <div class="rise d3">
      <ProfileForm submit-label="开始使用" @submit="onSubmit" />
    </div>
    <Disclaimer />
  </main>
</template>

<style scoped>
.kicker { margin: 12px 0 0; font-size: 13px; letter-spacing: .1em; }
.title { margin: 6px 0 0; font-family: var(--font-title); font-size: 28px; font-weight: 600; }
.lead { margin: 8px 0 12px; font-size: 14px; }
</style>
```

- [ ] **Step 3: 写测试 `tests/views/onboarding.test.ts`**

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import OnboardingView from '@/views/OnboardingView.vue'
import { getDb } from '@/db'
import { useProfileStore } from '@/stores/profile'
import { useClock } from '@/composables/useClock'

beforeEach(async () => {
  setActivePinia(createPinia())
  await useProfileStore().load()
  await getDb().profile.clear()
  useClock().today.value = '2026-10-14'
})

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/onboarding', component: OnboardingView },
      { path: '/', component: { template: '<div>home</div>' } },
    ],
  })
}

describe('OnboardingView', () => {
  it('shows errors for empty form', async () => {
    const router = makeRouter()
    await router.push('/onboarding')
    const w = mount(OnboardingView, { global: { plugins: [router] } })
    await w.find('form').trigger('submit')
    expect(w.text()).toContain('请选择日期')
    expect(w.text()).toContain('身高请填')
  })

  it('saves the profile and goes home', async () => {
    const router = makeRouter()
    await router.push('/onboarding')
    const w = mount(OnboardingView, { global: { plugins: [router] } })
    await w.find('input[name=date]').setValue('2027-01-31')
    await w.find('input[name=height]').setValue('160')
    await w.find('input[name=weight]').setValue('55')
    await w.findAll('button.chip').find((b) => b.text() === '不吃辣')!.trigger('click')
    await w.find('form').trigger('submit')
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/'))
    const saved = await getDb().profile.get('me')
    expect(saved?.dueDate).toBe('2027-01-31')
    expect(saved?.exclusions.tags).toEqual(['辣'])
  })
})
```

- [ ] **Step 4: 运行测试，确认通过**

Run: `pnpm vitest run tests/views/onboarding.test.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/components/ProfileForm.vue src/views/OnboardingView.vue tests/views/onboarding.test.ts
git commit -m "feat: onboarding profile form"
```

---

### Task 21: 首页「今天」

**Files:**
- Create: `src/components/FruitIcon.vue`、`src/components/WeekTicks.vue`、`src/components/MealList.vue`、`src/components/SupplementGrid.vue`、`src/components/CheckupTicket.vue`、`src/components/WeekNotes.vue`
- Modify: `src/views/TodayView.vue`
- Test: `tests/views/today.test.ts`

- [ ] **Step 1: 写 `src/components/FruitIcon.vue`**（5 种外形，颜色由孕周内容决定）

```vue
<script setup lang="ts">
import type { FruitShape } from '@/content/types'

defineProps<{ shape: FruitShape; color: string; label: string }>()
</script>

<template>
  <div class="fruit" :aria-label="label" role="img">
    <div class="halo" />
    <svg width="128" height="148" viewBox="0 0 128 148">
      <g v-if="shape === 'seed'">
        <ellipse cx="64" cy="86" rx="10" ry="13" :fill="color" />
        <path d="M64 73c0-10 6-16 14-18" fill="none" stroke="#6F8F74" stroke-width="3" stroke-linecap="round" />
      </g>
      <g v-else-if="shape === 'berry'">
        <circle cx="54" cy="92" r="18" :fill="color" />
        <circle cx="78" cy="96" r="16" :fill="color" opacity=".85" />
        <path d="M54 74c4-14 14-20 24-22M78 80c0-12 0-20 0-28" fill="none" stroke="#6F8F74" stroke-width="3" stroke-linecap="round" />
      </g>
      <g v-else-if="shape === 'round'">
        <circle cx="64" cy="88" r="36" :fill="color" />
        <ellipse cx="50" cy="74" rx="8" ry="12" fill="#fff" opacity=".25" />
        <path d="M64 52c0-8 4-14 10-16" fill="none" stroke="#7A5D12" stroke-width="3" stroke-linecap="round" />
        <path d="M68 50c10-10 22-8 26-4-8 8-18 8-26 4z" fill="#7C9E80" />
      </g>
      <g v-else-if="shape === 'long'">
        <path d="M64 138C40 128 26 96 34 62c10 20 22 46 30 76z" fill="#8FAE90" />
        <path d="M64 138c24-10 38-42 30-76-10 20-22 46-30 76z" fill="#7C9E80" />
        <rect x="46" y="18" width="36" height="104" rx="18" :fill="color" />
        <g fill="#000" opacity=".08">
          <circle v-for="i in 6" :key="'l' + i" cx="56" :cy="20 + i * 14" r="4.2" />
          <circle v-for="i in 6" :key="'r' + i" cx="72" :cy="20 + i * 14" r="4.2" />
        </g>
        <path d="M64 140c-10-12-16-34-14-56 8 18 12 36 14 56zM64 140c10-12 16-34 14-56-8 18-12 36-14 56z" fill="#5F8466" />
      </g>
      <g v-else>
        <ellipse cx="64" cy="92" rx="40" ry="34" :fill="color" />
        <path d="M36 92c8-20 20-28 28-28s20 8 28 28" fill="none" stroke="#fff" stroke-width="3" opacity=".4" />
        <path d="M64 64v56" stroke="#fff" stroke-width="3" opacity=".4" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.fruit { width: 128px; height: 148px; flex: none; position: relative; margin-bottom: -6px; }
.halo { position: absolute; inset: 14px 0 0 0; border-radius: 50%; background: var(--butter); opacity: .55; }
svg { position: relative; animation: sway 6s ease-in-out infinite; transform-origin: 50% 90%; }
@keyframes sway { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@media (prefers-reduced-motion: reduce) { svg { animation: none; } }
</style>
```

- [ ] **Step 2: 写 `src/components/WeekTicks.vue`**

```vue
<script setup lang="ts">
defineProps<{ week: number }>()
</script>

<template>
  <div class="ticks" :aria-label="`孕程进度：第 ${week} 周，共 40 周`">
    <div class="row">
      <div
        v-for="w in 40"
        :key="w"
        class="tick"
        :class="{ past: w < week, now: w === week, boundary: w === 14 || w === 28 }"
      />
    </div>
    <div class="labels">
      <span :class="{ on: week < 14 }">孕早期</span>
      <span :class="{ on: week >= 14 && week < 28 }">孕中期</span>
      <span :class="{ on: week >= 28 }" class="end">孕晚期</span>
    </div>
  </div>
</template>

<style scoped>
.ticks { margin-top: 16px; }
.row { display: grid; grid-template-columns: repeat(40, 1fr); gap: 3px; align-items: end; height: 22px; }
.tick { height: 12px; border-radius: 2px; background: var(--line); }
.tick.past { background: var(--apricot); opacity: .85; }
.tick.boundary { height: 18px; }
.tick.now { height: 22px; background: var(--ink); animation: breathe 2.4s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
.labels { display: grid; grid-template-columns: 13fr 14fr 13fr; margin-top: 6px; font-size: 11px; color: var(--ink-faint); letter-spacing: .08em; }
.labels .on { color: var(--apricot); font-weight: 600; }
.labels .end { text-align: right; }
@media (prefers-reduced-motion: reduce) { .tick.now { animation: none; } }
</style>
```

- [ ] **Step 3: 写 `src/components/MealList.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import NutrientTag from './NutrientTag.vue'
import { PLAN_SLOTS, type DayPlan } from '@/core/mealPlanner'
import { getRecipe } from '@/content/recipes'
import type { PlanSlot } from '@/content/types'

defineProps<{ plan: DayPlan; eaten: PlanSlot[] }>()
const emit = defineEmits<{ toggle: [slot: PlanSlot]; swap: [slot: PlanSlot] }>()

const open = ref<PlanSlot | null>(null)
const spinning = ref<PlanSlot | null>(null)

function onSwap(slot: PlanSlot) {
  spinning.value = slot
  setTimeout(() => {
    emit('swap', slot)
    spinning.value = null
  }, 250)
}
</script>

<template>
  <div class="card meals">
    <div v-for="s in PLAN_SLOTS" :key="s.key" class="meal" :class="{ eaten: eaten.includes(s.key) }" :data-slot="s.key">
      <div class="when"><b>{{ s.label }}</b><small>{{ s.time }}</small></div>
      <div class="what" :class="{ swapping: spinning === s.key }">
        <template v-if="plan[s.key] && getRecipe(plan[s.key]!)">
          <button class="name" @click="open = open === s.key ? null : s.key">{{ getRecipe(plan[s.key]!)!.name }}</button>
          <div class="sub">{{ getRecipe(plan[s.key]!)!.tip }}</div>
          <div class="tags"><NutrientTag v-for="t in getRecipe(plan[s.key]!)!.tags" :key="t" :tag="t" /></div>
          <div v-if="open === s.key" class="detail">
            <p><b>食材：</b>{{ getRecipe(plan[s.key]!)!.ingredients.map((i) => `${i.name} ${i.amount}`).join('、') }}</p>
            <ol><li v-for="(step, i) in getRecipe(plan[s.key]!)!.steps" :key="i">{{ step }}</li></ol>
          </div>
        </template>
        <div v-else class="sub">暂无合适推荐</div>
      </div>
      <div class="acts">
        <button class="check" aria-label="标记已吃" :disabled="!plan[s.key]" @click="emit('toggle', s.key)">
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M3.5 8.3l3 3 6-6.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button class="swap" :class="{ spin: spinning === s.key }" :disabled="!plan[s.key]" @click="onSwap(s.key)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13l-3-3M20 15H7l3 3" /></svg>
          换一份
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meals { padding: 6px 16px; }
.meal { display: grid; grid-template-columns: 44px 1fr auto; gap: 10px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.meal:last-child { border-bottom: 0; }
.when { padding-top: 2px; }
.when b { display: block; font-family: var(--font-title); font-size: 15px; font-weight: 600; }
.when small { font-family: var(--font-display); font-size: 12px; color: var(--ink-faint); }
.what { min-width: 0; transition: opacity .25s, transform .25s; }
.what.swapping { opacity: 0; transform: translateY(6px); }
.name { all: unset; display: block; font-size: 15.5px; font-weight: 600; line-height: 1.45; cursor: pointer; }
.eaten .name { color: var(--ink-faint); text-decoration: line-through; }
.sub { margin-top: 3px; font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }
.tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
.detail { margin-top: 10px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--paper-deep); font-size: 13px; line-height: 1.6; }
.detail p { margin: 0; }
.detail ol { margin: 6px 0 0; padding-left: 18px; }
.acts { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.check { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid var(--line); background: transparent; display: grid; place-items: center; color: transparent; transition: all .2s; }
.eaten .check { background: var(--sage); border-color: var(--sage); color: #fff; }
.swap { border: 0; background: none; padding: 0; font-size: 11.5px; color: var(--ink-faint); display: flex; flex-direction: column; align-items: center; gap: 2px; }
.swap svg { transition: transform .4s; }
.swap.spin svg { transform: rotate(180deg); }
</style>
```

- [ ] **Step 4: 写 `src/components/SupplementGrid.vue`**

```vue
<script setup lang="ts">
import type { SupplementId, SupplementInfo } from '@/content/types'

defineProps<{ items: SupplementInfo[]; taken: SupplementId[] }>()
const emit = defineEmits<{ toggle: [id: SupplementId] }>()
</script>

<template>
  <div class="supps">
    <button
      v-for="s in items"
      :key="s.id"
      class="supp"
      :class="{ done: taken.includes(s.id) }"
      :style="{ '--c': s.color }"
      :data-id="s.id"
      @click="emit('toggle', s.id)"
    >
      <div class="cap" />
      <b>{{ s.name }}</b>
      <small>{{ s.dose === '遵医嘱' ? s.timing.split('，')[0] : s.dose }}</small>
    </button>
  </div>
</template>

<style scoped>
.supps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.supp { border: 1px solid var(--line); background: var(--card); border-radius: var(--radius-md); padding: 12px 6px 10px; text-align: center; transition: all .2s; position: relative; }
.cap { width: 34px; height: 16px; border-radius: 8px; margin: 0 auto 8px; background: linear-gradient(90deg, var(--c) 50%, #fff 50%); border: 1.5px solid var(--c); transform: rotate(-24deg); transition: transform .3s; }
b { display: block; font-size: 14px; font-weight: 600; }
small { display: block; font-size: 11px; color: var(--ink-faint); margin-top: 2px; }
.supp.done { background: var(--sage-soft); border-color: transparent; }
.supp.done .cap { transform: rotate(0); }
.supp.done::after {
  content: ""; position: absolute; top: 7px; right: 7px; width: 16px; height: 16px; border-radius: 50%; background: var(--sage);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M4.5 8.2l2.3 2.3 4.7-4.8' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>");
}
</style>
```

- [ ] **Step 5: 写 `src/components/CheckupTicket.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { diffDays, formatCn, weekdayCn, type DateStr } from '@/core/date'
import type { ScheduledCheckup } from '@/core/checkupSchedule'

const props = defineProps<{ checkup: ScheduledCheckup; today: DateStr; weekAtDate: number }>()
const emit = defineEmits<{ calendar: [] }>()

const daysLeft = computed(() => diffDays(props.checkup.date, props.today))
const showNotes = ref(false)
const chips = computed(() => {
  const c = props.checkup
  const list: { text: string; warn?: boolean }[] = []
  if (c.fasting) list.push({ text: '需空腹', warn: true })
  if (c.fullBladder) list.push({ text: '需憋尿', warn: true })
  for (const b of c.bring.slice(0, 2)) list.push({ text: `带${b}` })
  return list
})
</script>

<template>
  <div class="ticket">
    <div class="stub">
      <small>{{ daysLeft === 0 ? '就是' : '还有' }}</small>
      <strong>{{ daysLeft === 0 ? '今' : daysLeft }}</strong>
      <small>天</small>
    </div>
    <div class="body">
      <div class="d">{{ formatCn(checkup.date) }} {{ weekdayCn(checkup.date) }} · 孕 {{ weekAtDate }} 周</div>
      <h3>{{ checkup.name }}</h3>
      <div class="notes">
        <span v-for="c in chips" :key="c.text" :class="{ warn: c.warn }">{{ c.text }}</span>
      </div>
      <p v-if="showNotes" class="more">{{ checkup.purpose }}<template v-if="checkup.note"><br />{{ checkup.note }}</template></p>
      <div class="btns">
        <button class="btn dark sm" @click="emit('calendar')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
          加入日历
        </button>
        <button class="btn sm ghost" @click="showNotes = !showNotes">{{ showNotes ? '收起' : '检查须知' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket { position: relative; display: grid; grid-template-columns: 92px 1fr; background: var(--butter); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow); }
.stub { padding: 18px 0; text-align: center; border-right: 2px dashed rgba(122, 93, 18, .28); position: relative; }
.stub::before, .stub::after { content: ""; position: absolute; right: -11px; width: 20px; height: 20px; border-radius: 50%; background: var(--paper); }
.stub::before { top: -10px; }
.stub::after { bottom: -10px; }
.stub small { display: block; font-size: 11.5px; color: var(--butter-ink); letter-spacing: .1em; }
.stub strong { display: block; font-family: var(--font-display); font-weight: 400; font-size: 54px; line-height: 1; margin: 4px 0 2px; }
.body { padding: 16px 16px 16px 18px; }
.d { font-size: 12.5px; color: var(--butter-ink); }
h3 { margin: 4px 0 8px; font-family: var(--font-title); font-size: 18px; font-weight: 600; }
.notes { display: flex; gap: 6px; flex-wrap: wrap; }
.notes span { font-size: 11.5px; height: 22px; padding: 0 8px; border-radius: 6px; background: rgba(255, 253, 249, .7); display: inline-flex; align-items: center; color: #5E4A14; }
.notes span.warn { background: var(--ink); color: var(--butter); }
.more { margin: 10px 0 0; font-size: 12.5px; line-height: 1.6; color: #5E4A14; }
.btns { display: flex; gap: 8px; margin-top: 12px; }
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.btn.ghost { background: rgba(255, 253, 249, .75); color: var(--ink); }
</style>
```

- [ ] **Step 6: 写 `src/components/WeekNotes.vue`**

```vue
<script setup lang="ts">
import type { WeekTip } from '@/content/types'

defineProps<{ tips: WeekTip[] }>()
const NUMERALS = ['i', 'ii', 'iii']
</script>

<template>
  <div class="card list">
    <div v-for="(t, i) in tips" :key="t.title" class="item">
      <div class="n">{{ NUMERALS[i] }}</div>
      <p>{{ t.title }}<span>{{ t.detail }}</span></p>
    </div>
  </div>
  <RouterLink to="/pregnancy/redflags" class="redflag">
    <span class="dot" />
    身体不舒服？看看哪些情况要立即就医
    <em>查看 ›</em>
  </RouterLink>
</template>

<style scoped>
.list { padding: 4px 16px; }
.item { display: flex; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--line); }
.item:last-child { border-bottom: 0; }
.n { font-family: var(--font-display); font-style: italic; font-size: 20px; color: var(--apricot); line-height: 1.1; width: 18px; flex: none; }
p { margin: 0; font-size: 14px; line-height: 1.65; }
p span { color: var(--ink-soft); font-size: 12.5px; display: block; margin-top: 2px; }
.redflag { margin-top: 12px; display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: var(--radius-md); background: var(--alert-soft); color: var(--alert); font-size: 13.5px; font-weight: 500; text-decoration: none; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--alert); flex: none; box-shadow: 0 0 0 4px rgba(200, 72, 58, .15); }
em { margin-left: auto; font-style: normal; font-size: 12.5px; opacity: .8; }
</style>
```

- [ ] **Step 7: 写 `src/views/TodayView.vue`**

```vue
<script setup lang="ts">
import { computed, watch } from 'vue'
import FruitIcon from '@/components/FruitIcon.vue'
import WeekTicks from '@/components/WeekTicks.vue'
import SectionHead from '@/components/SectionHead.vue'
import NutrientTag from '@/components/NutrientTag.vue'
import MealList from '@/components/MealList.vue'
import SupplementGrid from '@/components/SupplementGrid.vue'
import CheckupTicket from '@/components/CheckupTicket.vue'
import WeekNotes from '@/components/WeekNotes.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useMealsStore } from '@/stores/meals'
import { useRecordsStore } from '@/stores/records'
import { formatCn, greeting, weekdayCn } from '@/core/date'
import { getStatus } from '@/core/pregnancy'
import { buildSchedule, nextCheckup } from '@/core/checkupSchedule'
import { toIcs } from '@/core/ics'
import { downloadFile } from '@/utils/download'
import { getWeekInfo } from '@/content/weeks'
import { FOCUS_TAGS, SUPPLEMENTS, SUPPLEMENT_HINT, TRIMESTER_LABEL } from '@/content/nutrition'

const { today, hour } = useClock()
const profileStore = useProfileStore()
const meals = useMealsStore()
const records = useRecordsStore()

const profile = computed(() => profileStore.profile!)
const status = computed(() => getStatus(profile.value.dueDate, today.value))
const info = computed(() => getWeekInfo(status.value.week))
const log = computed(() => meals.logs[today.value])
const schedule = computed(() => buildSchedule(profile.value.dueDate, records.checkupOverrides))
const next = computed(() => nextCheckup(schedule.value, today.value))
const supplements = computed(() =>
  SUPPLEMENTS.filter((s) =>
    profile.value.supplementIds ? profile.value.supplementIds.includes(s.id) : s.trimesters.includes(status.value.trimester),
  ),
)
const taken = computed(() => records.supplementsTaken[today.value] ?? [])

watch(
  today,
  async (d) => {
    await Promise.all([meals.ensurePlans([d]), records.loadSupplements(d), records.loadCheckups()])
  },
  { immediate: true },
)

function exportCalendar() {
  const ics = toIcs(schedule.value, { location: profile.value.hospital, now: new Date() })
  downloadFile('产检日程.ics', ics, 'text/calendar;charset=utf-8')
}
</script>

<template>
  <main class="page">
    <div class="page-glow" />

    <header class="greet rise d1">
      <div>
        <div class="date">{{ formatCn(today) }} · {{ weekdayCn(today) }}</div>
        <h1>{{ greeting(hour) }}，今天也好好吃饭</h1>
      </div>
      <RouterLink to="/me/settings" class="icon-btn" aria-label="设置">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
      </RouterLink>
    </header>

    <section v-if="!status.inRange" class="card out-of-range rise d2">
      {{ status.week < 4 ? '孕周还不到 4 周，请确认预产期设置是否正确' : '已经过了预产期，请遵医嘱，密切留意身体变化' }}
      <RouterLink to="/me/settings">去设置 ›</RouterLink>
    </section>

    <section v-else class="hero rise d2">
      <div class="hero-row">
        <div>
          <div class="week-num">{{ status.week }}<sup>周 +{{ status.day }} 天</sup></div>
          <div class="week-meta">
            <span class="pill apricot">{{ TRIMESTER_LABEL[status.trimester] }}</span>
            <span class="pill ghost">预产期 {{ formatCn(profile.dueDate) }}</span>
          </div>
        </div>
        <FruitIcon :shape="info.fruitShape" :color="info.fruitColor" :label="`宝宝大小像${info.fruit}`" />
      </div>
      <p class="baby-line">宝宝现在约 <b>{{ info.lengthCm }} 厘米、{{ info.weightG }} 克</b>，像{{ info.fruit }}。<br />{{ info.baby }}</p>
      <WeekTicks :week="status.week" />
      <div class="countdown">
        <span v-if="status.daysToDue > 0">距离见面还有<strong>{{ status.daysToDue }}</strong>天</span>
        <span v-else>宝宝随时可能到来</span>
        <span>已走过 {{ Math.round(status.progress * 100) }}%</span>
      </div>
    </section>

    <section class="block rise d3">
      <SectionHead idx="01" title="今日三餐">已吃 {{ log?.eaten.length ?? 0 }} / 5</SectionHead>
      <div class="focus">
        <span>本阶段重点</span>
        <NutrientTag v-for="t in FOCUS_TAGS[status.trimester]" :key="t" :tag="t" />
      </div>
      <MealList
        v-if="log"
        :plan="log.plan"
        :eaten="log.eaten"
        @toggle="(s) => meals.toggleEaten(today, s)"
        @swap="(s) => meals.swap(today, s)"
      />
    </section>

    <section v-if="supplements.length" class="block rise d4">
      <SectionHead idx="02" title="今日补剂">{{ taken.length }} / {{ supplements.length }}</SectionHead>
      <SupplementGrid :items="supplements" :taken="taken" @toggle="(id) => records.toggleSupplement(today, id)" />
      <div class="hint">{{ SUPPLEMENT_HINT }}</div>
    </section>

    <section v-if="next" class="block rise d5">
      <SectionHead idx="03" title="下次产检"><RouterLink to="/pregnancy/checkups">全部日程</RouterLink></SectionHead>
      <CheckupTicket
        :checkup="next"
        :today="today"
        :week-at-date="getStatus(profile.dueDate, next.date).week"
        @calendar="exportCalendar"
      />
    </section>

    <section class="block rise d6">
      <SectionHead idx="04" title="这周要留意" />
      <WeekNotes :tips="info.tips" />
      <Disclaimer />
    </section>
  </main>
</template>

<style scoped>
.greet { display: flex; justify-content: space-between; align-items: flex-start; }
.greet .date { font-size: 13px; color: var(--ink-soft); letter-spacing: .04em; }
.greet h1 { margin: 4px 0 0; font-family: var(--font-title); font-size: 22px; font-weight: 600; letter-spacing: .02em; }
.icon-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); display: grid; place-items: center; color: var(--ink-soft); }
.out-of-range { margin-top: 18px; padding: 16px; font-size: 14px; line-height: 1.6; }
.out-of-range a { display: block; margin-top: 8px; color: var(--apricot); text-decoration: none; }
.hero { margin-top: 18px; }
.hero-row { display: flex; align-items: flex-end; justify-content: space-between; }
.week-num { font-family: var(--font-display); font-variation-settings: "opsz" 144; font-weight: 400; font-size: 112px; line-height: .82; letter-spacing: -.04em; }
.week-num sup { font-family: var(--font-title); font-size: 18px; letter-spacing: 0; font-weight: 600; vertical-align: top; position: relative; top: 14px; margin-left: 6px; }
.week-meta { margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; }
.baby-line { margin: 14px 0 0; font-size: 14px; color: var(--ink-soft); line-height: 1.6; }
.baby-line b { color: var(--ink); font-weight: 600; }
.countdown { margin-top: 14px; display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; border-top: 1px dashed var(--line); font-size: 13px; color: var(--ink-soft); }
.countdown strong { font-family: var(--font-display); font-weight: 500; font-size: 26px; color: var(--ink); margin: 0 3px; }
.focus { display: flex; gap: 6px; margin-bottom: 12px; font-size: 12.5px; color: var(--ink-soft); align-items: center; }
.hint { margin-top: 10px; font-size: 12.5px; color: var(--ink-soft); }
</style>
```

- [ ] **Step 8: 写测试 `tests/views/today.test.ts`**

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import TodayView from '@/views/TodayView.vue'
import { getDb } from '@/db'
import { useProfileStore } from '@/stores/profile'
import { useClock } from '@/composables/useClock'

beforeEach(async () => {
  setActivePinia(createPinia())
  const profile = useProfileStore()
  await profile.load()
  await getDb().mealLogs.clear()
  await getDb().checkupOverrides.clear()
  await profile.saveBasics({ dueDate: '2027-01-31', heightCm: 160, preWeightKg: 55, exclusions: { tags: [], ingredients: [] } })
  useClock().today.value = '2026-10-14'
})

async function mountToday() {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:p(.*)*', component: TodayView }] })
  await router.push('/')
  const w = mount(TodayView, { global: { plugins: [router] } })
  await vi.waitFor(() => expect(w.findAll('.meal')).toHaveLength(5))
  return w
}

describe('TodayView', () => {
  it('shows week, countdown, meals and next checkup', async () => {
    const w = await mountToday()
    expect(w.find('.week-num').text()).toContain('24')
    expect(w.text()).toContain('109')
    await vi.waitFor(() => expect(w.text()).toContain('孕 28 周产检'))
  })

  it('swaps a meal', async () => {
    const w = await mountToday()
    const before = w.find('[data-slot=lunch] .name').text()
    await w.find('[data-slot=lunch] .swap').trigger('click')
    await vi.waitFor(() => expect(w.find('[data-slot=lunch] .name').text()).not.toBe(before), { timeout: 2000 })
  })
})
```

IndexedDB 的读写是异步的，所以这里用 `vi.waitFor` 轮询断言，不用 `flushPromises`。

24 周 +3 天时，OGTT（24 周起）的建议日期 10 月 11 日已经过了，所以下一次产检是孕 28 周产检。

- [ ] **Step 9: 运行测试，确认通过**

Run: `pnpm vitest run tests/views/today.test.ts`
Expected: PASS。

- [ ] **Step 10: 用浏览器对照视觉稿检查**

Run: `pnpm dev`，在 Chrome 开发者工具中切换到 iPhone 14 尺寸（390×844），完成首次设置后，与 `docs/design/home-1-hero.png`、`home-2-meals.png`、`home-3-checkup.png` 对比：孕周数字、40 格进度、三餐卡片、补剂胶囊、产检票根、这周要留意、底部标签栏都应一致。

- [ ] **Step 11: 提交**

```bash
git add src/components src/views/TodayView.vue tests/views/today.test.ts
git commit -m "feat: today page with meals, supplements and next checkup"
```

---

### Task 22: 「吃」：能不能吃、一周食谱、购物清单

**Files:**
- Modify: `src/views/EatView.vue`、`src/views/WeekPlanView.vue`、`src/views/ShoppingView.vue`

- [ ] **Step 1: 写 `src/views/EatView.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionHead from '@/components/SectionHead.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { searchFoods } from '@/core/foodSearch'
import { useProfileStore } from '@/stores/profile'
import type { FoodLevel } from '@/content/types'

const profile = useProfileStore()
const query = ref('')
const results = computed(() => searchFoods(query.value))
const LEVEL: Record<FoodLevel, { label: string; cls: string }> = {
  ok: { label: '可以吃', cls: 'ok' },
  caution: { label: '适量吃', cls: 'caution' },
  avoid: { label: '避免', cls: 'avoid' },
}
const quick = ['螃蟹', '咖啡', '西瓜', '山楂', '生鱼片', '冰淇淋']
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">这个能不能吃？</h1>
    <input v-model="query" class="search" type="search" placeholder="输入食物名称，比如：螃蟹" />
    <div v-if="!query" class="chips quick">
      <button v-for="q in quick" :key="q" class="chip" @click="query = q">{{ q }}</button>
    </div>
    <div v-else-if="results.length" class="results">
      <article v-for="f in results" :key="f.name" class="card food">
        <header><b>{{ f.name }}</b><span class="level" :class="LEVEL[f.level].cls">{{ LEVEL[f.level].label }}</span></header>
        <p>{{ f.reason }}</p>
        <p class="advice">{{ f.advice }}</p>
      </article>
    </div>
    <p v-else class="muted empty">暂时没有收录「{{ query }}」<template v-if="profile.aiReady">，可以去问问 AI</template></p>

    <section class="block">
      <SectionHead title="吃饭这件事" />
      <RouterLink to="/eat/week" class="card entry"><b>一周食谱</b><span>未来 7 天的三餐，可以逐份替换</span></RouterLink>
      <RouterLink to="/eat/shopping" class="card entry"><b>购物清单</b><span>按一周食谱自动整理要买的食材</span></RouterLink>
      <RouterLink to="/eat/ai" class="card entry"><b>AI 问一问</b><span>{{ profile.aiReady ? '有具体问题随时问' : '需要先在设置里填 API Key' }}</span></RouterLink>
    </section>
    <Disclaimer />
  </main>
</template>

<style scoped>
.title { margin: 8px 0 14px; font-family: var(--font-title); font-size: 26px; font-weight: 600; }
.search { width: 100%; height: 50px; padding: 0 18px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); font-size: 15px; box-shadow: var(--shadow); }
.quick { margin-top: 14px; }
.results { margin-top: 14px; display: grid; gap: 10px; }
.food { padding: 14px 16px; }
.food header { display: flex; justify-content: space-between; align-items: center; }
.food b { font-size: 16px; }
.food p { margin: 8px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.food .advice { color: var(--ink); }
.level { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
.level.ok { background: var(--sage-soft); color: var(--sage-ink); }
.level.caution { background: var(--butter); color: var(--butter-ink); }
.level.avoid { background: var(--alert-soft); color: var(--alert); }
.empty { margin-top: 16px; font-size: 14px; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
</style>
```

- [ ] **Step 2: 写 `src/views/WeekPlanView.vue`**

```vue
<script setup lang="ts">
import { computed, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MealList from '@/components/MealList.vue'
import { useClock } from '@/composables/useClock'
import { useMealsStore } from '@/stores/meals'
import { addDays, formatCn, weekdayCn } from '@/core/date'

const { today } = useClock()
const meals = useMealsStore()
const dates = computed(() => Array.from({ length: 7 }, (_, i) => addDays(today.value, i)))

watch(dates, (d) => meals.ensurePlans(d), { immediate: true })
</script>

<template>
  <main class="page">
    <PageHeader title="一周食谱" />
    <section v-for="d in dates" :key="d" class="day">
      <h2>{{ d === today ? '今天' : formatCn(d) }} <small>{{ weekdayCn(d) }}</small></h2>
      <MealList
        v-if="meals.logs[d]"
        :plan="meals.logs[d].plan"
        :eaten="meals.logs[d].eaten"
        @toggle="(s) => meals.toggleEaten(d, s)"
        @swap="(s) => meals.swap(d, s)"
      />
    </section>
  </main>
</template>

<style scoped>
.day { margin-bottom: 24px; }
h2 { margin: 0 0 10px; font-family: var(--font-title); font-size: 17px; }
h2 small { font-family: var(--font-body); font-weight: 400; font-size: 12.5px; color: var(--ink-faint); margin-left: 4px; }
</style>
```

- [ ] **Step 3: 写 `src/views/ShoppingView.vue`**

```vue
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useMealsStore } from '@/stores/meals'
import { addDays } from '@/core/date'
import { buildShoppingList } from '@/core/shoppingList'
import { getRecipe } from '@/content/recipes'
import type { Recipe } from '@/content/types'

const { today } = useClock()
const meals = useMealsStore()
const dates = computed(() => Array.from({ length: 7 }, (_, i) => addDays(today.value, i)))
const storageKey = computed(() => `shopping-checked:${today.value}`)
const checked = ref<string[]>([])

watch(dates, (d) => meals.ensurePlans(d), { immediate: true })
watch(storageKey, (k) => { checked.value = JSON.parse(localStorage.getItem(k) ?? '[]') }, { immediate: true })

const groups = computed(() => {
  const recipes: Recipe[] = []
  for (const d of dates.value) {
    const log = meals.logs[d]
    if (!log) continue
    for (const id of Object.values(log.plan)) {
      const r = id ? getRecipe(id) : undefined
      if (r) recipes.push(r)
    }
  }
  return buildShoppingList(recipes)
})

function toggle(name: string) {
  checked.value = checked.value.includes(name) ? checked.value.filter((n) => n !== name) : [...checked.value, name]
  localStorage.setItem(storageKey.value, JSON.stringify(checked.value))
}
</script>

<template>
  <main class="page">
    <PageHeader title="购物清单" />
    <p class="muted intro">按未来 7 天的食谱整理，换过的菜会自动更新</p>
    <section v-for="g in groups" :key="g.category" class="card group">
      <h2>{{ g.category }}</h2>
      <label v-for="item in g.items" :key="item.name" class="item" :class="{ done: checked.includes(item.name) }">
        <input type="checkbox" :checked="checked.includes(item.name)" @change="toggle(item.name)" />
        <span class="name">{{ item.name }}</span>
        <span class="amount">{{ item.amounts.join(' + ') }}</span>
      </label>
    </section>
  </main>
</template>

<style scoped>
.intro { font-size: 13px; margin: 0 0 14px; }
.group { padding: 8px 16px; margin-bottom: 12px; }
h2 { margin: 8px 0; font-family: var(--font-title); font-size: 15px; color: var(--apricot); }
.item { display: grid; grid-template-columns: 24px 1fr auto; gap: 8px; align-items: center; padding: 10px 0; border-top: 1px solid var(--line); font-size: 14px; }
.item input { width: 18px; height: 18px; accent-color: var(--sage); }
.amount { font-size: 12.5px; color: var(--ink-faint); text-align: right; }
.done .name { color: var(--ink-faint); text-decoration: line-through; }
</style>
```

- [ ] **Step 4: 验证并提交**

Run: `pnpm test && pnpm build`，然后用 `pnpm dev` 在手机尺寸下逐页点一遍：搜索「螃蟹」显示「适量吃」；一周食谱显示 7 天；购物清单分类显示，勾选后刷新页面状态仍在。

```bash
git add src/views/EatView.vue src/views/WeekPlanView.vue src/views/ShoppingView.vue
git commit -m "feat: food lookup, weekly plan and shopping list"
```

---

### Task 23: AI 问一问

**Files:**
- Create: `src/ai/prompt.ts`、`src/ai/client.ts`
- Modify: `src/views/AskAiView.vue`
- Test: `tests/ai/prompt.test.ts`、`tests/ai/client.test.ts`

- [ ] **Step 1: 写失败的测试 `tests/ai/prompt.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { buildSystemPrompt, findAvoidMentions } from '@/ai/prompt'
import type { FoodEntry } from '@/content/types'

const foods: FoodEntry[] = [
  { name: '生鱼片', aliases: ['刺身'], level: 'avoid', reason: '', advice: '' },
  { name: '酒', aliases: ['啤酒'], level: 'avoid', reason: '', advice: '' },
  { name: '螃蟹', aliases: [], level: 'caution', reason: '', advice: '' },
]

describe('ai prompt', () => {
  it('includes week, trimester, exclusions and safety rules', () => {
    const p = buildSystemPrompt({ week: 24, day: 3, trimester: 2, exclusions: { tags: ['辣'], ingredients: ['香菜'] } }, foods)
    expect(p).toContain('孕 24 周 3 天')
    expect(p).toContain('孕中期')
    expect(p).toContain('辣、香菜')
    expect(p).toContain('生鱼片')
    expect(p).toContain('就医')
  })

  it('flags avoid-level foods mentioned in answers, ignoring single characters', () => {
    expect(findAvoidMentions('可以吃点刺身和螃蟹', foods)).toEqual(['生鱼片'])
    expect(findAvoidMentions('喝点酒酿圆子', foods)).toEqual([])
    expect(findAvoidMentions('不要喝啤酒', foods)).toEqual(['酒'])
  })
})
```

- [ ] **Step 2: 写失败的测试 `tests/ai/client.test.ts`**

```ts
import { describe, it, expect, vi } from 'vitest'
import { askAi, AiError } from '@/ai/client'

const settings = { baseUrl: 'https://api.example.com/v1/', apiKey: 'sk-1', model: 'm' }

describe('askAi', () => {
  it('posts a chat completion and returns the answer', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message: { content: '答案' } }] }), { status: 200 }))
    const answer = await askAi(settings, 'sys', '问题', fetchImpl)
    expect(answer).toBe('答案')
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/chat/completions')
    expect(init.headers.Authorization).toBe('Bearer sk-1')
    expect(JSON.parse(init.body).messages).toEqual([
      { role: 'system', content: 'sys' },
      { role: 'user', content: '问题' },
    ])
  })

  it('maps 401 to a friendly error', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{}', { status: 401 }))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toThrow('API Key 无效')
  })

  it('maps network failures to a friendly error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(askAi(settings, 's', 'q', fetchImpl)).rejects.toBeInstanceOf(AiError)
  })
})
```

- [ ] **Step 3: 运行测试，确认失败**

Run: `pnpm vitest run tests/ai`
Expected: FAIL，找不到模块。

- [ ] **Step 4: 实现 `src/ai/prompt.ts`**

```ts
import { FOODS } from '@/content/foods'
import { TRIMESTER_LABEL } from '@/content/nutrition'
import type { Exclusions, FoodEntry, Trimester } from '@/content/types'

export interface PromptContext {
  week: number
  day: number
  trimester: Trimester
  exclusions: Exclusions
}

const TAG_TEXT: Record<string, string> = { 荤: '肉禽和海鲜（素食）', 蛋: '鸡蛋', 奶: '奶制品' }

export function buildSystemPrompt(ctx: PromptContext, foods: FoodEntry[] = FOODS): string {
  const avoid = [...ctx.exclusions.tags.map((t) => TAG_TEXT[t] ?? t), ...ctx.exclusions.ingredients]
  const banned = foods.filter((f) => f.level === 'avoid').map((f) => f.name)
  return [
    '你是一位温和、专业的孕期营养顾问，用简体中文回答，语言简洁具体。',
    `用户目前孕 ${ctx.week} 周 ${ctx.day} 天，处于${TRIMESTER_LABEL[ctx.trimester]}。`,
    avoid.length ? `用户忌口：${avoid.join('、')}，推荐时必须避开。` : '',
    `绝对不要推荐以下孕期应避免的食物：${banned.join('、')}。`,
    '营养建议参考《中国居民膳食指南（2022）》孕期部分，不推荐保健品和药物的具体剂量。',
    '如果用户描述了身体不适或异常症状，先提醒及时就医或联系产检医生，不要给出诊断。',
  ].filter(Boolean).join('\n')
}

export function findAvoidMentions(text: string, foods: FoodEntry[] = FOODS): string[] {
  return foods
    .filter((f) => f.level === 'avoid')
    .filter((f) => [f.name, ...f.aliases].some((n) => n.length >= 2 && text.includes(n)))
    .map((f) => f.name)
}
```

- [ ] **Step 5: 实现 `src/ai/client.ts`**

```ts
import type { AiSettings } from '@/db'

export class AiError extends Error {}

export async function askAi(
  settings: AiSettings,
  systemPrompt: string,
  question: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const url = settings.baseUrl.replace(/\/+$/, '') + '/chat/completions'
  let res: Response
  try {
    res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.apiKey}` },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    throw new AiError('网络连接失败，请检查网络或接口地址')
  }
  if (res.status === 401 || res.status === 403) throw new AiError('API Key 无效，请在设置里检查')
  if (!res.ok) throw new AiError(`接口返回错误（${res.status}）`)
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) throw new AiError('没有收到回答，请稍后再试')
  return content
}
```

- [ ] **Step 6: 运行测试，确认通过**

Run: `pnpm vitest run tests/ai`
Expected: PASS。

- [ ] **Step 7: 写 `src/views/AskAiView.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { getStatus } from '@/core/pregnancy'
import { buildSystemPrompt, findAvoidMentions } from '@/ai/prompt'
import { askAi, AiError } from '@/ai/client'

const { today } = useClock()
const profileStore = useProfileStore()
const question = ref('')
const answer = ref('')
const warnings = ref<string[]>([])
const error = ref('')
const loading = ref(false)
const examples = ['今天孕吐吃不下，有什么推荐？', '晚上饿了吃什么不容易胖？', '贫血的话一周怎么安排补铁？']

const ready = computed(() => profileStore.aiReady)

async function send() {
  const p = profileStore.profile
  if (!p?.ai || !question.value.trim()) return
  loading.value = true
  error.value = ''
  answer.value = ''
  try {
    const s = getStatus(p.dueDate, today.value)
    const sys = buildSystemPrompt({ week: s.week, day: s.day, trimester: s.trimester, exclusions: p.exclusions })
    answer.value = await askAi(p.ai, sys, question.value.trim())
    warnings.value = findAvoidMentions(answer.value)
  } catch (e) {
    error.value = e instanceof AiError ? e.message : '出了点问题，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <PageHeader title="AI 问一问" />
    <div v-if="!ready" class="card notice">
      还没有配置 AI。去 <RouterLink to="/me/settings">设置</RouterLink> 填写接口地址和 API Key 后就能使用。
    </div>
    <template v-else>
      <textarea v-model="question" class="q" placeholder="想问什么都可以，比如今天吃什么" />
      <div class="chips">
        <button v-for="e in examples" :key="e" class="chip" @click="question = e">{{ e }}</button>
      </div>
      <button class="btn dark block-btn send" :disabled="loading || !question.trim()" @click="send">
        {{ loading ? '思考中…' : '提问' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
      <article v-if="answer" class="card answer">
        <p v-if="warnings.length" class="warn">回答里提到了孕期应避免的食物：{{ warnings.join('、') }}，请以「能不能吃」里的说明为准。</p>
        <div class="text">{{ answer }}</div>
        <p class="faint foot">AI 回答仅供参考，请以医生意见为准</p>
      </article>
    </template>
  </main>
</template>

<style scoped>
.notice { padding: 16px; font-size: 14px; line-height: 1.6; }
.notice a { color: var(--apricot); }
.q { width: 100%; height: 110px; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--line); background: var(--card); font-size: 15px; resize: vertical; margin-bottom: 12px; }
.send { margin-top: 16px; height: 46px; }
.error { color: var(--alert); font-size: 13.5px; }
.answer { margin-top: 18px; padding: 16px; }
.warn { margin: 0 0 12px; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--alert-soft); color: var(--alert); font-size: 13px; }
.text { white-space: pre-wrap; font-size: 14.5px; line-height: 1.75; }
.foot { margin: 12px 0 0; font-size: 12px; }
</style>
```

- [ ] **Step 8: 验证并提交**

Run: `pnpm test && pnpm build`
Expected: 全部通过。

```bash
git add src/ai src/views/AskAiView.vue tests/ai
git commit -m "feat: optional AI Q&A with safety scan"
```

---

### Task 24: 「孕期」：时间轴、产检日程、危险信号

**Files:**
- Modify: `src/views/PregnancyView.vue`、`src/views/CheckupsView.vue`、`src/views/RedFlagsView.vue`

- [ ] **Step 1: 写 `src/views/PregnancyView.vue`**

```vue
<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import FruitIcon from '@/components/FruitIcon.vue'
import SectionHead from '@/components/SectionHead.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { getStatus } from '@/core/pregnancy'
import { WEEKS, getWeekInfo } from '@/content/weeks'

const { today } = useClock()
const profile = useProfileStore()
const current = computed(() => getStatus(profile.profile!.dueDate, today.value).week)
const selected = ref(getWeekInfo(current.value).week)
const info = computed(() => getWeekInfo(selected.value))
const strip = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  strip.value?.querySelector('.on')?.scrollIntoView({ inline: 'center', block: 'nearest' })
})
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">孕期时间轴</h1>
    <div ref="strip" class="strip">
      <button
        v-for="w in WEEKS"
        :key="w.week"
        class="wk"
        :class="{ on: w.week === selected, now: w.week === current }"
        @click="selected = w.week"
      >{{ w.week }}</button>
    </div>

    <section class="card week">
      <div class="top">
        <div>
          <div class="num">{{ info.week }}<small>周</small></div>
          <p class="muted">约 {{ info.lengthCm }} 厘米 · {{ info.weightG }} 克 · 像{{ info.fruit }}</p>
        </div>
        <FruitIcon :shape="info.fruitShape" :color="info.fruitColor" :label="info.fruit" />
      </div>
      <h3>宝宝</h3><p>{{ info.baby }}</p>
      <h3>妈妈</h3><p>{{ info.mom }}</p>
      <h3>这周要留意</h3>
      <ul><li v-for="t in info.tips" :key="t.title"><b>{{ t.title }}</b> {{ t.detail }}</li></ul>
    </section>

    <section class="block">
      <SectionHead title="更多" />
      <RouterLink to="/pregnancy/checkups" class="card entry"><b>产检日程</b><span>全部产检安排，可改日期、导入日历</span></RouterLink>
      <RouterLink to="/pregnancy/redflags" class="card entry alert"><b>危险信号</b><span>哪些情况要立即就医</span></RouterLink>
    </section>
    <Disclaimer />
  </main>
</template>

<style scoped>
.title { margin: 8px 0 14px; font-family: var(--font-title); font-size: 26px; font-weight: 600; }
.strip { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; margin: 0 -20px; padding-left: 20px; padding-right: 20px; }
.wk { flex: none; width: 42px; height: 42px; border-radius: 50%; border: 1px solid var(--line); background: var(--card); font-family: var(--font-display); font-size: 16px; }
.wk.now { border-color: var(--apricot); color: var(--apricot); }
.wk.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
.week { margin-top: 14px; padding: 18px; }
.top { display: flex; justify-content: space-between; align-items: flex-end; }
.num { font-family: var(--font-display); font-size: 64px; line-height: .9; }
.num small { font-family: var(--font-title); font-size: 16px; margin-left: 4px; }
.top p { margin: 8px 0 0; font-size: 13px; }
h3 { margin: 18px 0 4px; font-family: var(--font-title); font-size: 15px; color: var(--apricot); }
.week p, .week li { font-size: 14px; line-height: 1.7; margin: 0; }
ul { margin: 0; padding-left: 18px; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
.entry.alert b { color: var(--alert); }
</style>
```

- [ ] **Step 2: 写 `src/views/CheckupsView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { buildSchedule } from '@/core/checkupSchedule'
import { getStatus } from '@/core/pregnancy'
import { formatCn, weekdayCn } from '@/core/date'
import { toIcs } from '@/core/ics'
import { downloadFile } from '@/utils/download'

const { today } = useClock()
const profile = useProfileStore()
const records = useRecordsStore()
const schedule = computed(() => buildSchedule(profile.profile!.dueDate, records.checkupOverrides))

onMounted(() => records.loadCheckups())

function exportAll() {
  downloadFile('产检日程.ics', toIcs(schedule.value, { location: profile.profile!.hospital, now: new Date() }), 'text/calendar;charset=utf-8')
}
</script>

<template>
  <main class="page">
    <PageHeader title="产检日程">
      <button class="btn dark sm" @click="exportAll">导入日历</button>
    </PageHeader>
    <p class="muted intro">日期默认按孕周推算。约好具体时间后点日期修改，再重新导入日历即可更新。</p>
    <article
      v-for="c in schedule"
      :key="c.id"
      class="card item"
      :class="{ done: c.done, past: !c.done && c.date < today }"
    >
      <header>
        <div>
          <b>{{ c.name }}</b>
          <div class="when">孕 {{ getStatus(profile.profile!.dueDate, c.date).week }} 周 · {{ formatCn(c.date) }} {{ weekdayCn(c.date) }}</div>
        </div>
        <label class="donebox">
          <input type="checkbox" :checked="c.done" @change="records.updateCheckup(c.id, { done: !c.done })" />
          已完成
        </label>
      </header>
      <p>{{ c.purpose }}</p>
      <p class="prep">
        <span v-if="c.fasting" class="warn">需空腹</span>
        <span v-if="c.fullBladder" class="warn">需憋尿</span>
        携带：{{ c.bring.join('、') }}
      </p>
      <p v-if="c.note" class="note">{{ c.note }}</p>
      <label class="field date">
        <span>预约日期</span>
        <input type="date" :value="c.date" @change="records.updateCheckup(c.id, { date: ($event.target as HTMLInputElement).value || undefined })" />
      </label>
    </article>
  </main>
</template>

<style scoped>
.intro { font-size: 13px; margin: 0 0 14px; line-height: 1.6; }
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.item { padding: 14px 16px; margin-bottom: 10px; }
.item.done { opacity: .55; }
.item.past { border-color: var(--apricot); }
header { display: flex; justify-content: space-between; gap: 10px; }
header b { font-family: var(--font-title); font-size: 16px; }
.when { font-size: 12.5px; color: var(--ink-soft); margin-top: 2px; }
.donebox { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: var(--ink-soft); white-space: nowrap; }
p { margin: 8px 0 0; font-size: 13.5px; line-height: 1.6; }
.prep { color: var(--ink-soft); }
.warn { display: inline-block; margin-right: 6px; padding: 1px 8px; border-radius: 6px; background: var(--ink); color: var(--butter); font-size: 12px; }
.note { color: var(--butter-ink); background: var(--butter); padding: 8px 10px; border-radius: var(--radius-sm); }
.date { margin-top: 10px; }
</style>
```

- [ ] **Step 3: 写 `src/views/RedFlagsView.vue`**

```vue
<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { RED_FLAGS } from '@/content/redflags'

const emergency = RED_FLAGS.filter((r) => r.level === 'emergency')
const soon = RED_FLAGS.filter((r) => r.level === 'soon')
</script>

<template>
  <main class="page">
    <PageHeader title="危险信号" />
    <a href="tel:120" class="call">紧急情况，拨打 120</a>
    <h2 class="em">出现以下情况，立即去医院</h2>
    <article v-for="r in emergency" :key="r.id" class="card flag em-card">
      <b>{{ r.symptom }}</b><p>{{ r.detail }}</p>
    </article>
    <h2>尽快就诊或联系产检医生</h2>
    <article v-for="r in soon" :key="r.id" class="card flag">
      <b>{{ r.symptom }}</b><p>{{ r.detail }}</p>
    </article>
    <p class="faint foot">不确定时，宁可多跑一趟医院。</p>
  </main>
</template>

<style scoped>
.call { display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 999px; background: var(--alert); color: #fff; font-size: 16px; font-weight: 700; text-decoration: none; }
h2 { margin: 26px 0 10px; font-family: var(--font-title); font-size: 16px; }
h2.em { color: var(--alert); }
.flag { padding: 14px 16px; margin-bottom: 8px; }
.em-card { border-left: 4px solid var(--alert); }
.flag b { font-size: 15px; }
.flag p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); }
.foot { text-align: center; font-size: 12.5px; margin-top: 20px; }
</style>
```

- [ ] **Step 4: 验证并提交**

Run: `pnpm test && pnpm build`，然后用 `pnpm dev` 检查：时间轴默认停在当前周；改一次产检日期后返回首页，「下次产检」随之变化；点「导入日历」会下载 `产检日程.ics`，用 macOS 日历打开能看到全部未完成的产检。

```bash
git add src/views/PregnancyView.vue src/views/CheckupsView.vue src/views/RedFlagsView.vue
git commit -m "feat: pregnancy timeline, checkup schedule and red flags"
```

---

### Task 25: 「我的」：体重、孕晚期工具、待产包

**Files:**
- Create: `src/components/WeightChart.vue`
- Modify: `src/views/MeView.vue`、`src/views/WeightView.vue`、`src/views/KicksView.vue`、`src/views/ContractionsView.vue`、`src/views/BagView.vue`

- [ ] **Step 1: 写 `src/components/WeightChart.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { recommendedGain } from '@/core/weightGain'

const props = defineProps<{ preBmi: number; points: { week: number; gain: number }[] }>()

const W = 340
const H = 200
const PAD = { l: 28, r: 8, t: 10, b: 22 }
const maxGain = computed(() => Math.max(recommendedGain(props.preBmi, 40).max + 2, ...props.points.map((p) => p.gain + 1)))
const minGain = computed(() => Math.min(-2, ...props.points.map((p) => p.gain - 1)))
const x = (week: number) => PAD.l + (week / 40) * (W - PAD.l - PAD.r)
const y = (gain: number) => PAD.t + ((maxGain.value - gain) / (maxGain.value - minGain.value)) * (H - PAD.t - PAD.b)

const band = computed(() => {
  const weeks = Array.from({ length: 41 }, (_, i) => i)
  const upper = weeks.map((w) => `${x(w)},${y(recommendedGain(props.preBmi, w).max)}`)
  const lower = weeks.reverse().map((w) => `${x(w)},${y(recommendedGain(props.preBmi, w).min)}`)
  return [...upper, ...lower].join(' ')
})
const line = computed(() => [...props.points].sort((a, b) => a.week - b.week).map((p) => `${x(p.week)},${y(p.gain)}`).join(' '))
const ticks = [0, 10, 20, 30, 40]
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="chart" role="img" aria-label="体重增长曲线">
    <polygon :points="band" fill="var(--sage-soft)" />
    <line :x1="PAD.l" :x2="W - PAD.r" :y1="y(0)" :y2="y(0)" stroke="var(--line)" />
    <g v-for="t in ticks" :key="t">
      <text :x="x(t)" :y="H - 6" text-anchor="middle" class="lbl">{{ t }}周</text>
    </g>
    <text :x="4" :y="y(0) + 4" class="lbl">0</text>
    <text :x="4" :y="y(Math.floor(maxGain)) + 4" class="lbl">+{{ Math.floor(maxGain) }}</text>
    <polyline v-if="points.length > 1" :points="line" fill="none" stroke="var(--apricot)" stroke-width="2" />
    <circle v-for="p in points" :key="p.week + '-' + p.gain" :cx="x(p.week)" :cy="y(p.gain)" r="3.5" fill="var(--apricot)" />
  </svg>
</template>

<style scoped>
.chart { width: 100%; height: auto; display: block; }
.lbl { font-size: 10px; fill: var(--ink-faint); font-family: var(--font-display); }
</style>
```

- [ ] **Step 2: 写 `src/views/WeightView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import WeightChart from '@/components/WeightChart.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { getStatus } from '@/core/pregnancy'
import { assessGain, bmi, recommendedGain, totalGainRange } from '@/core/weightGain'
import { formatCn } from '@/core/date'

const { today } = useClock()
const profileStore = useProfileStore()
const records = useRecordsStore()
const p = computed(() => profileStore.profile!)
const preBmi = computed(() => bmi(p.value.heightCm, p.value.preWeightKg))
const date = ref(today.value)
const kg = ref<number | null>(null)

onMounted(() => records.loadWeights())

const points = computed(() =>
  records.weights.map((w) => ({ week: getStatus(p.value.dueDate, w.date).gestationDays / 7, gain: Math.round((w.kg - p.value.preWeightKg) * 10) / 10 })),
)
const latest = computed(() => records.weights[records.weights.length - 1])
const verdict = computed(() => {
  if (!latest.value) return null
  const week = getStatus(p.value.dueDate, latest.value.date).week
  const range = recommendedGain(preBmi.value, week)
  const result = assessGain(p.value, week, latest.value.kg)
  const text = { low: '增长偏少，注意吃够主食和蛋白质', normal: '在推荐范围内，继续保持', high: '增长偏多，少吃甜食和油炸食品，适当散步' }[result]
  return { result, text, range, week }
})

async function save() {
  if (!kg.value || kg.value < 30 || kg.value > 200) return
  await records.saveWeight(date.value, kg.value)
  kg.value = null
}
</script>

<template>
  <main class="page">
    <PageHeader title="体重记录" />
    <section class="card summary">
      <p class="muted">孕前 BMI {{ preBmi }}，整个孕期推荐增重 {{ totalGainRange(preBmi).min }}–{{ totalGainRange(preBmi).max }} 公斤</p>
      <WeightChart :pre-bmi="preBmi" :points="points" />
      <p v-if="verdict" class="verdict" :class="verdict.result">
        孕 {{ verdict.week }} 周已增重 {{ (latest!.kg - p.preWeightKg).toFixed(1) }} 公斤（推荐 {{ verdict.range.min }}–{{ verdict.range.max }}），{{ verdict.text }}
      </p>
    </section>
    <section class="card add">
      <label class="field"><span>日期</span><input v-model="date" type="date" /></label>
      <label class="field"><span>体重（公斤）</span><input v-model.number="kg" type="number" step="0.1" inputmode="decimal" /></label>
      <button class="btn dark block-btn" :disabled="!kg" @click="save">记录</button>
    </section>
    <ul class="list">
      <li v-for="w in [...records.weights].reverse()" :key="w.date">
        <span>{{ formatCn(w.date) }}</span><b>{{ w.kg }} 公斤</b>
        <button aria-label="删除" @click="records.deleteWeight(w.date)">×</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.summary, .add { padding: 16px; margin-bottom: 14px; }
.summary p { margin: 0 0 10px; font-size: 13px; }
.verdict { margin-top: 10px !important; padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13.5px !important; line-height: 1.6; }
.verdict.normal { background: var(--sage-soft); color: var(--sage-ink); }
.verdict.low, .verdict.high { background: var(--butter); color: var(--butter-ink); }
.add .btn { margin-top: 16px; }
.list { list-style: none; padding: 0; margin: 0; }
.list li { display: grid; grid-template-columns: 1fr auto 32px; align-items: center; padding: 12px 4px; border-bottom: 1px solid var(--line); font-size: 14px; }
.list button { border: 0; background: none; color: var(--ink-faint); font-size: 18px; }
</style>
```

- [ ] **Step 3: 写 `src/views/KicksView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getDb, plain, type KickSession } from '@/db'
import { assessKickSession, countKicks, KICK_TARGET } from '@/core/kickCounter'

const session = ref<KickSession | null>(null)
const history = ref<KickSession[]>([])
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

async function load() {
  const all = await getDb().kickSessions.orderBy('startedAt').reverse().limit(10).toArray()
  session.value = all.find((s) => !s.endedAt) ?? null
  history.value = all.filter((s) => s.endedAt)
}

onMounted(async () => {
  await load()
  timer = setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => clearInterval(timer))

const result = computed(() => session.value && assessKickSession(session.value.startedAt, session.value.taps, now.value))
const mmss = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`

async function start() {
  const s: KickSession = { startedAt: Date.now(), taps: [] }
  s.id = await getDb().kickSessions.add(s)
  session.value = s
}

async function tap() {
  if (!session.value) return
  session.value = { ...session.value, taps: [...session.value.taps, Date.now()] }
  await getDb().kickSessions.put(plain(session.value))
}

async function finish() {
  if (!session.value) return
  await getDb().kickSessions.put(plain({ ...session.value, endedAt: Date.now() }))
  await load()
}
</script>

<template>
  <main class="page">
    <PageHeader title="数胎动" />
    <p class="muted intro">选一个宝宝常动的时间，侧躺或坐着。5 分钟内连续的动算 1 次，2 小时内满 {{ KICK_TARGET }} 次就可以结束。</p>
    <template v-if="session && result">
      <div class="counter">
        <strong>{{ result.count }}</strong><span>/ {{ KICK_TARGET }} 次</span>
        <small>剩余 {{ mmss(result.remainingMs) }}</small>
      </div>
      <button class="tap" @click="tap">动了一下</button>
      <p v-if="result.state === 'done'" class="ok">已经满 {{ KICK_TARGET }} 次，宝宝很活跃</p>
      <p v-if="result.state === 'low'" class="alert">2 小时内不足 {{ KICK_TARGET }} 次，请尽快去医院做胎心监护</p>
      <button class="btn light block-btn" @click="finish">结束本次</button>
    </template>
    <button v-else class="btn dark block-btn startbtn" @click="start">开始计数</button>
    <h2 v-if="history.length">最近记录</h2>
    <ul class="list">
      <li v-for="h in history" :key="h.id">
        <span>{{ new Date(h.startedAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</span>
        <b>{{ countKicks(h.taps) }} 次</b>
        <span class="faint">{{ Math.round((h.endedAt! - h.startedAt) / 60000) }} 分钟</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.intro { font-size: 13px; line-height: 1.6; margin: 0 0 20px; }
.counter { text-align: center; }
.counter strong { font-family: var(--font-display); font-size: 96px; line-height: 1; }
.counter span { font-size: 16px; color: var(--ink-soft); margin-left: 4px; }
.counter small { display: block; margin-top: 6px; color: var(--ink-faint); font-family: var(--font-display); font-size: 15px; }
.tap { display: block; margin: 22px auto; width: 180px; height: 180px; border-radius: 50%; border: 0; background: var(--apricot); color: #fff; font-size: 20px; font-weight: 700; box-shadow: 0 12px 30px -10px rgba(224, 122, 79, .6); }
.tap:active { transform: scale(.96); }
.ok, .alert { text-align: center; padding: 10px; border-radius: var(--radius-sm); font-size: 14px; }
.ok { background: var(--sage-soft); color: var(--sage-ink); }
.alert { background: var(--alert-soft); color: var(--alert); font-weight: 600; }
.startbtn { height: 52px; }
h2 { margin: 28px 0 8px; font-family: var(--font-title); font-size: 16px; }
.list { list-style: none; padding: 0; margin: 0; }
.list li { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; padding: 10px 2px; border-bottom: 1px solid var(--line); font-size: 13.5px; }
</style>
```

- [ ] **Step 4: 写 `src/views/ContractionsView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { getDb, type ContractionRow } from '@/db'
import { is511, withStats } from '@/core/contractionTimer'

const rows = ref<ContractionRow[]>([])
const runningStart = ref<number | null>(null)
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | undefined

async function load() {
  const since = Date.now() - 6 * 3600_000
  rows.value = await getDb().contractions.where('start').above(since).toArray()
}

onMounted(async () => {
  await load()
  timer = setInterval(() => (now.value = Date.now()), 1000)
})
onUnmounted(() => clearInterval(timer))

const stats = computed(() => withStats(rows.value).reverse())
const alert511 = computed(() => is511(rows.value))

async function toggle() {
  if (runningStart.value === null) {
    runningStart.value = Date.now()
    return
  }
  await getDb().contractions.add({ start: runningStart.value, end: Date.now() })
  runningStart.value = null
  await load()
}

async function clearAll() {
  if (!confirm('清空全部宫缩记录？')) return
  await getDb().contractions.clear()
  await load()
}

const fmt = (t: number) => new Date(t).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <main class="page">
    <PageHeader title="宫缩计时">
      <button v-if="rows.length" class="btn light sm" @click="clearAll">清空</button>
    </PageHeader>
    <p v-if="alert511" class="alert">已经连续 1 小时每 5 分钟一次、每次 1 分钟以上，请准备去医院</p>
    <p class="muted intro">肚子发紧时点「开始」，放松时点「结束」。未满 37 周出现规律宫缩，请直接去医院。</p>
    <button class="big" :class="{ running: runningStart !== null }" @click="toggle">
      <template v-if="runningStart === null">开始</template>
      <template v-else>结束<small>{{ Math.floor((now - runningStart) / 1000) }} 秒</small></template>
    </button>
    <table v-if="stats.length" class="table">
      <thead><tr><th>开始</th><th>持续</th><th>间隔</th></tr></thead>
      <tbody>
        <tr v-for="c in stats" :key="c.start">
          <td>{{ fmt(c.start) }}</td>
          <td :class="{ strong: c.durationSec >= 60 }">{{ c.durationSec }} 秒</td>
          <td :class="{ strong: c.intervalMin !== null && c.intervalMin <= 5 }">{{ c.intervalMin === null ? '—' : `${c.intervalMin} 分钟` }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
.btn.sm { height: 34px; padding: 0 14px; font-size: 13px; }
.alert { padding: 12px; border-radius: var(--radius-sm); background: var(--alert-soft); color: var(--alert); font-weight: 600; font-size: 14px; line-height: 1.6; }
.intro { font-size: 13px; line-height: 1.6; }
.big { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 24px auto; width: 180px; height: 180px; border-radius: 50%; border: 0; background: var(--sage); color: #fff; font-size: 24px; font-weight: 700; }
.big.running { background: var(--apricot); }
.big small { font-family: var(--font-display); font-size: 18px; font-weight: 400; margin-top: 4px; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; font-weight: 500; color: var(--ink-faint); font-size: 12.5px; padding: 6px 4px; }
td { padding: 10px 4px; border-top: 1px solid var(--line); }
td.strong { color: var(--apricot); font-weight: 600; }
</style>
```

- [ ] **Step 5: 写 `src/views/BagView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useRecordsStore } from '@/stores/records'
import { BIRTH_BAG } from '@/content/birthBag'

const records = useRecordsStore()
onMounted(() => records.loadBag())

const groups = computed(() => {
  const order = ['证件', '妈妈', '宝宝', '其他'] as const
  return order.map((g) => ({ group: g, items: BIRTH_BAG.filter((b) => b.group === g) }))
})
const done = computed(() => BIRTH_BAG.filter((b) => records.bag[b.id]).length)
</script>

<template>
  <main class="page">
    <PageHeader title="待产包">
      <span class="faint count">{{ done }} / {{ BIRTH_BAG.length }}</span>
    </PageHeader>
    <p class="muted intro">建议孕 34–36 周准备好，放在门口随时能拿走。</p>
    <section v-for="g in groups" :key="g.group" class="card group">
      <h2>{{ g.group }}</h2>
      <label v-for="item in g.items" :key="item.id" class="item" :class="{ done: records.bag[item.id] }">
        <input type="checkbox" :checked="!!records.bag[item.id]" @change="records.toggleBag(item.id)" />
        {{ item.name }}
      </label>
    </section>
  </main>
</template>

<style scoped>
.count { font-family: var(--font-display); font-size: 15px; }
.intro { font-size: 13px; margin: 0 0 14px; }
.group { padding: 8px 16px; margin-bottom: 12px; }
h2 { margin: 8px 0; font-family: var(--font-title); font-size: 15px; color: var(--apricot); }
.item { display: flex; gap: 10px; align-items: center; padding: 11px 0; border-top: 1px solid var(--line); font-size: 14px; }
.item input { width: 18px; height: 18px; accent-color: var(--sage); }
.done { color: var(--ink-faint); text-decoration: line-through; }
</style>
```

- [ ] **Step 6: 写 `src/views/MeView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SectionHead from '@/components/SectionHead.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { getStatus } from '@/core/pregnancy'
import { formatCn } from '@/core/date'

const { today } = useClock()
const profile = useProfileStore()
const records = useRecordsStore()
const week = computed(() => getStatus(profile.profile!.dueDate, today.value).week)
const latest = computed(() => records.weights[records.weights.length - 1])

onMounted(() => records.loadWeights())
</script>

<template>
  <main class="page">
    <div class="page-glow" />
    <h1 class="title">我的</h1>

    <RouterLink to="/me/weight" class="card entry">
      <b>体重记录</b>
      <span v-if="latest">最近一次 {{ formatCn(latest.date) }}：{{ latest.kg }} 公斤</span>
      <span v-else>还没有记录，每周称一次就好</span>
    </RouterLink>

    <section class="block">
      <SectionHead title="孕晚期工具">
        <template v-if="week < 28">孕 28 周后开放</template>
      </SectionHead>
      <template v-if="week >= 28">
        <RouterLink to="/me/kicks" class="card entry"><b>数胎动</b><span>每天固定时间数一数</span></RouterLink>
        <RouterLink to="/me/contractions" class="card entry"><b>宫缩计时</b><span>判断是不是该去医院了</span></RouterLink>
        <RouterLink to="/me/bag" class="card entry"><b>待产包</b><span>一项项勾选准备</span></RouterLink>
      </template>
      <p v-else class="muted locked">胎动计数、宫缩计时和待产包清单会在孕 28 周后出现在这里。</p>
    </section>

    <section class="block">
      <RouterLink to="/me/settings" class="card entry"><b>设置</b><span>个人资料、忌口、补剂、AI、备份</span></RouterLink>
    </section>
  </main>
</template>

<style scoped>
.title { margin: 8px 0 14px; font-family: var(--font-title); font-size: 26px; font-weight: 600; }
.entry { display: block; padding: 16px; margin-bottom: 10px; text-decoration: none; color: inherit; }
.entry b { display: block; font-family: var(--font-title); font-size: 16px; }
.entry span { display: block; margin-top: 4px; font-size: 13px; color: var(--ink-soft); }
.locked { font-size: 13.5px; line-height: 1.6; }
</style>
```

- [ ] **Step 7: 验证并提交**

Run: `pnpm test && pnpm build`，然后用 `pnpm dev` 检查：记录 2–3 条体重后曲线和推荐带正常显示；把预产期临时改到 10 周后，「我的」页出现孕晚期工具；数胎动连点后计数按 5 分钟合并；宫缩计时开始、结束、列表正常。

```bash
git add src/components/WeightChart.vue src/views/MeView.vue src/views/WeightView.vue src/views/KicksView.vue src/views/ContractionsView.vue src/views/BagView.vue
git commit -m "feat: weight chart and late-pregnancy tools"
```

---

### Task 26: 设置页（资料、补剂、AI、备份）

**Files:**
- Modify: `src/views/SettingsView.vue`

- [ ] **Step 1: 写 `src/views/SettingsView.vue`**

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import ProfileForm from '@/components/ProfileForm.vue'
import Disclaimer from '@/components/Disclaimer.vue'
import { useClock } from '@/composables/useClock'
import { useProfileStore } from '@/stores/profile'
import { useMealsStore } from '@/stores/meals'
import { useRecordsStore } from '@/stores/records'
import { SUPPLEMENTS } from '@/content/nutrition'
import { exportBackup, importBackup, parseBackup, BackupError } from '@/db/backup'
import { downloadFile } from '@/utils/download'
import type { ProfileValues } from '@/core/profileValidation'
import type { SupplementId } from '@/content/types'

const { today } = useClock()
const profileStore = useProfileStore()
const meals = useMealsStore()
const records = useRecordsStore()
const p = computed(() => profileStore.profile!)
const message = ref('')

const initial = computed(() => ({
  dateMode: 'due' as const,
  date: p.value.dueDate,
  heightCm: p.value.heightCm,
  preWeightKg: p.value.preWeightKg,
  avoidTags: [...p.value.exclusions.tags],
  customAvoid: p.value.exclusions.ingredients.join('，'),
  hospital: p.value.hospital ?? '',
}))

async function saveBasics(values: ProfileValues) {
  const exclusionsChanged = JSON.stringify(values.exclusions) !== JSON.stringify(p.value.exclusions)
  const dueChanged = values.dueDate !== p.value.dueDate
  await profileStore.saveBasics(values)
  if (exclusionsChanged || dueChanged) await meals.resetFrom(today.value)
  message.value = '已保存'
}

const customSupps = ref(!!p.value.supplementIds)
const suppIds = ref<SupplementId[]>(p.value.supplementIds ?? SUPPLEMENTS.map((s) => s.id))
async function saveSupps() {
  await profileStore.saveSupplements(customSupps.value ? suppIds.value : undefined)
  message.value = '补剂设置已保存'
}

const ai = reactive({ baseUrl: p.value.ai?.baseUrl ?? '', apiKey: p.value.ai?.apiKey ?? '', model: p.value.ai?.model ?? '' })
async function saveAi() {
  const filled = ai.baseUrl.trim() && ai.apiKey.trim() && ai.model.trim()
  await profileStore.saveAi(filled ? { baseUrl: ai.baseUrl.trim(), apiKey: ai.apiKey.trim(), model: ai.model.trim() } : undefined)
  message.value = filled ? 'AI 设置已保存' : '已关闭 AI 问一问'
}

async function doExport() {
  const file = await exportBackup()
  downloadFile(`孕期小伴备份-${today.value}.json`, JSON.stringify(file), 'application/json')
}

async function doImport(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  input.value = ''
  if (!f) return
  try {
    const file = parseBackup(await f.text())
    if (!confirm('导入会覆盖这台手机上的全部记录，确定吗？')) return
    await importBackup(file)
    await profileStore.reload()
    meals.logs = {}
    await Promise.all([records.loadWeights(), records.loadCheckups(), records.loadBag()])
    message.value = '备份已恢复'
  } catch (err) {
    message.value = err instanceof BackupError ? err.message : '导入失败'
  }
}
</script>

<template>
  <main class="page">
    <PageHeader title="设置" />
    <p v-if="message" class="msg" @click="message = ''">{{ message }}</p>

    <section class="card sec">
      <h2>个人资料</h2>
      <ProfileForm :key="p.dueDate + p.exclusions.tags.join()" :initial="initial" submit-label="保存资料" @submit="saveBasics" />
    </section>

    <section class="card sec">
      <h2>补剂</h2>
      <label class="row"><input v-model="customSupps" type="checkbox" /> 只显示我在吃的补剂（默认按孕期显示）</label>
      <div v-if="customSupps" class="chips">
        <label v-for="s in SUPPLEMENTS" :key="s.id" class="chip" :class="{ on: suppIds.includes(s.id) }">
          <input v-model="suppIds" type="checkbox" :value="s.id" hidden />{{ s.name }}
        </label>
      </div>
      <button class="btn light block-btn" @click="saveSupps">保存补剂设置</button>
    </section>

    <section class="card sec">
      <h2>AI 问一问（可选）</h2>
      <p class="muted small">填写兼容 OpenAI 格式的接口。Key 只保存在这台手机上，导出备份时不会包含。</p>
      <label class="field"><span>接口地址</span><input v-model="ai.baseUrl" placeholder="https://api.deepseek.com/v1" /></label>
      <label class="field"><span>API Key</span><input v-model="ai.apiKey" type="password" autocomplete="off" /></label>
      <label class="field"><span>模型名</span><input v-model="ai.model" placeholder="deepseek-chat" /></label>
      <button class="btn light block-btn" @click="saveAi">保存 AI 设置</button>
    </section>

    <section class="card sec">
      <h2>备份</h2>
      <p class="muted small">换手机或清理浏览器前，先导出备份文件。</p>
      <div class="two">
        <button class="btn dark" @click="doExport">导出备份</button>
        <label class="btn light">导入备份<input type="file" accept="application/json,.json" hidden @change="doImport" /></label>
      </div>
    </section>

    <Disclaimer />
  </main>
</template>

<style scoped>
.msg { position: sticky; top: 8px; z-index: 5; padding: 10px 14px; border-radius: var(--radius-sm); background: var(--ink); color: var(--paper); font-size: 13.5px; text-align: center; }
.sec { padding: 16px; margin-bottom: 14px; }
h2 { margin: 0 0 6px; font-family: var(--font-title); font-size: 17px; }
.small { font-size: 12.5px; line-height: 1.6; margin: 0; }
.row { display: flex; gap: 8px; align-items: center; font-size: 14px; margin: 10px 0; }
.chips { margin-bottom: 12px; }
.sec .btn.block-btn { margin-top: 16px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
</style>
```

- [ ] **Step 2: 验证并提交**

Run: `pnpm test && pnpm build`，再用 `pnpm dev` 检查：修改忌口后，今天的三餐重新生成且不含新忌口；导出备份后清空站点数据，再导入，记录全部恢复。

```bash
git add src/views/SettingsView.vue
git commit -m "feat: settings with supplements, AI config and backup"
```

---

### Task 27: PWA 离线和添加到桌面

**Files:**
- Create: `public/logo.svg`
- Modify: `vite.config.ts`、`index.html`、`package.json`

- [ ] **Step 1: 写应用图标 `public/logo.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#FBF6EE"/>
  <circle cx="256" cy="272" r="150" fill="#F6E3A6"/>
  <path d="M256 150c-64 0-112 52-112 120 0 74 56 122 112 122s112-48 112-122c0-68-48-120-112-120z" fill="#E07A4F"/>
  <path d="M256 150c0-40 24-66 60-74-4 38-26 64-60 74z" fill="#6F8F74"/>
  <circle cx="220" cy="250" r="22" fill="#FBF6EE" opacity=".35"/>
</svg>
```

- [ ] **Step 2: 生成 PWA 图标**

在 `package.json` 的 `scripts` 中加入：

```json
"icons": "pwa-assets-generator --preset minimal-2023 public/logo.svg"
```

Run: `pnpm icons`
Expected: `public/` 下生成 `pwa-64x64.png`、`pwa-192x192.png`、`pwa-512x512.png`、`maskable-icon-512x512.png`、`apple-touch-icon-180x180.png`、`favicon.ico`。

- [ ] **Step 3: 在 `vite.config.ts` 中启用 PWA**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: '孕期小伴',
        short_name: '孕期小伴',
        description: '每天吃什么、补什么、什么时候产检',
        lang: 'zh-CN',
        theme_color: '#FBF6EE',
        background_color: '#FBF6EE',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
})
```

- [ ] **Step 4: 在 `index.html` 的 `<head>` 中加入图标链接**

```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/logo.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
```

并删除模板自带的 `<link rel="icon" type="image/svg+xml" href="/vite.svg" />`，同时删除 `public/vite.svg`。

- [ ] **Step 5: 验证离线可用**

Run: `pnpm build && pnpm preview`
在 Chrome 打开 http://localhost:4173，开发者工具 → Application → Manifest 无报错、Service Worker 已激活；Network 勾选 Offline 后刷新，页面仍能打开，三餐和孕周正常显示。

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: PWA manifest, icons and offline support"
```

---

### Task 28: 部署和真机验收

**Files:**
- Create: `public/_redirects`

- [ ] **Step 1: 单页应用路由回退**

`public/_redirects`：

```
/*    /index.html   200
```

- [ ] **Step 2: 全量检查**

Run: `pnpm test && pnpm build`
Expected: 全部测试通过，构建成功。

- [ ] **Step 3: 部署到 Cloudflare Pages**（需要 Cloudflare 账号，第一次运行会在浏览器里登录）

```bash
pnpm dlx wrangler pages deploy dist --project-name yunqi-xiaoban
```

Expected: 输出 `https://yunqi-xiaoban.pages.dev` 之类的地址。

- [ ] **Step 4: 真机验收清单**（iPhone Safari 和 Android Chrome 各走一遍）

- [ ] 首次打开进入设置，填写后进入首页，孕周和倒计时正确
- [ ] iPhone 出现「添加到主屏幕」提示；添加后从桌面图标打开是全屏，状态栏和底部安全区不遮挡内容
- [ ] 开启飞行模式后从桌面打开，首页、能不能吃、时间轴都能用
- [ ] 「换一份」有动画且结果不同；标记已吃后杀掉应用重开，状态仍在
- [ ] 补剂打卡第二天自动清空
- [ ] 「加入日历」：Android 下载 `.ics` 后用日历打开能导入；iPhone 上如果没有直接弹出「添加到日历」，就用「存储到文件」→ 在「文件」App 中点开 `.ics` 导入，确认每次产检前一天上午 9 点有提醒
- [ ] 危险信号页「拨打 120」能唤起拨号
- [ ] 导出备份 → 在另一台手机导入 → 数据一致，AI Key 需要重新填
- [ ] AI 问一问（如已配置）：能正常回答；若接口报跨域错误，换用支持浏览器直连的服务商，或记录下来作为后续加 Cloudflare Worker 中转的需求

- [ ] **Step 5: 提交**

```bash
git add public/_redirects
git commit -m "chore: SPA fallback for static hosting"
```
