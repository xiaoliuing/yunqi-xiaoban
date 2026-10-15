import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '@/ai/markdown'

describe('renderMarkdown', () => {
  it('renders emphasis, headings and lists', () => {
    const html = renderMarkdown('## 今晚\n\n可以吃**清淡**的：\n\n- 小米粥\n- 苏打饼干')
    expect(html).toContain('<h2>今晚</h2>')
    expect(html).toContain('<strong>清淡</strong>')
    expect(html).toContain('<li>小米粥</li>')
    expect(html).toContain('<li>苏打饼干</li>')
  })

  it('keeps https links and drops scripts and javascript urls', () => {
    const html = renderMarkdown('见 [指南](https://example.com/guide)\n\n<script>alert(1)</script>\n\n[点我](javascript:alert(1))')
    expect(html).toContain('href="https://example.com/guide"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).not.toContain('<script')
    expect(html).not.toMatch(/href="javascript:/i)
    expect(html).toContain('[点我](javascript:alert(1))')
  })
})
