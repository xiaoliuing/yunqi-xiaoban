import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, breaks: true })

const defaultLinkOpen = md.renderer.rules.link_open
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const href = String(token?.attrGet('href') ?? '')
  if (!/^https?:\/\//i.test(href)) token?.attrSet('href', '')
  token?.attrSet('target', '_blank')
  token?.attrSet('rel', 'noopener noreferrer')
  if (defaultLinkOpen) return defaultLinkOpen(tokens, idx, options, env, self)
  return self.renderToken(tokens, idx, options)
}

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName !== 'A') return
  const href = node.getAttribute('href') ?? ''
  if (!/^https?:\/\//i.test(href)) node.removeAttribute('href')
  node.setAttribute('target', '_blank')
  node.setAttribute('rel', 'noopener noreferrer')
})

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'del', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'blockquote', 'code', 'pre', 'a', 'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
]

export function renderMarkdown(source: string): string {
  return DOMPurify.sanitize(md.render(source), {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}
