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
