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
