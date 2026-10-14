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
