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
