import type { AnalyzedChange } from './ai.js'

export type OutputFormat = 'github-release' | 'changelog' | 'slack'

interface FormatContext {
  version: string
  changes: AnalyzedChange[]
}

const CATEGORY_HEADERS: Record<string, string> = {
  breaking:    '⚠️ Breaking Changes',
  feature:     '✨ New Features',
  improvement: '🔧 Improvements',
  bugfix:      '🐛 Bug Fixes',
}

const CATEGORY_EMOJI: Record<string, string> = {
  breaking:    '⚠️',
  feature:     '✨',
  improvement: '🔧',
  bugfix:      '🐛',
}

const SLACK_MAX_ITEMS = 6

function groupByCategory(changes: AnalyzedChange[]): Map<string, AnalyzedChange[]> {
  const groups = new Map<string, AnalyzedChange[]>()
  const order = ['breaking', 'feature', 'improvement', 'bugfix']

  for (const cat of order) {
    const items = changes.filter(c => c.category === cat)
    if (items.length > 0) groups.set(cat, items)
  }

  return groups
}

function buildSummary(groups: Map<string, AnalyzedChange[]>): string {
  const parts: string[] = []
  const features = groups.get('feature')
  const improvements = groups.get('improvement')
  const bugfixes = groups.get('bugfix')
  const breaking = groups.get('breaking')

  if (breaking?.length) parts.push(`${breaking.length} breaking change${breaking.length > 1 ? 's' : ''}`)
  if (features?.length) parts.push(`${features.length} new feature${features.length > 1 ? 's' : ''}`)
  if (improvements?.length) parts.push(`${improvements.length} improvement${improvements.length > 1 ? 's' : ''}`)
  if (bugfixes?.length) parts.push(`${bugfixes.length} bug fix${bugfixes.length > 1 ? 'es' : ''}`)

  if (parts.length === 0) return ''
  if (parts.length === 1) return `This release includes ${parts[0]}.`
  const last = parts.pop()
  return `This release includes ${parts.join(', ')} and ${last}.`
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

export function formatGitHubRelease({ version, changes }: FormatContext): string {
  const visible = changes.filter(c => c.visible)
  if (visible.length === 0) return `## ${version}\n\nNo user-facing changes in this release.\n`

  const groups = groupByCategory(visible)
  const summary = buildSummary(groups)
  const lines: string[] = [`## ${version}`, '']

  if (summary) lines.push(summary, '')

  for (const [cat, items] of groups) {
    lines.push(`### ${CATEGORY_HEADERS[cat]}`, '')
    for (const item of items) {
      lines.push(`- ${item.rewritten_title}`)
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd() + '\n'
}

export function formatChangelog({ version, changes }: FormatContext): string {
  const visible = changes.filter(c => c.visible)
  const today = new Date().toISOString().split('T')[0]
  const lines: string[] = [`## [${version}] — ${today}`, '']

  if (visible.length === 0) {
    lines.push('No user-facing changes in this release.', '')
    return lines.join('\n')
  }

  const groups = groupByCategory(visible)

  for (const [cat, items] of groups) {
    lines.push(`### ${CATEGORY_HEADERS[cat]}`, '')
    for (const item of items) {
      lines.push(`- ${item.rewritten_title}`)
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd() + '\n'
}

export function formatSlack({ version, changes }: FormatContext): string {
  const visible = changes.filter(c => c.visible)
  const lines: string[] = [`*🚀 ${version}*`]

  if (visible.length === 0) {
    lines.push('No user-facing changes in this release.')
    return lines.join('\n')
  }

  // Breaking changes always shown in full
  const breaking = visible.filter(c => c.category === 'breaking')
  const rest = visible.filter(c => c.category !== 'breaking')

  // Pick top items up to SLACK_MAX_ITEMS (breaking always included)
  const slots = SLACK_MAX_ITEMS - breaking.length
  const shown = rest.slice(0, Math.max(slots, 0))
  const overflow = rest.length - shown.length

  lines.push('')

  if (breaking.length > 0) {
    for (const item of breaking) {
      lines.push(`${CATEGORY_EMOJI.breaking} ${truncate(item.rewritten_title, 80)}`)
    }
  }

  for (const item of shown) {
    const emoji = CATEGORY_EMOJI[item.category] ?? '•'
    lines.push(`${emoji} ${truncate(item.rewritten_title, 80)}`)
  }

  if (overflow > 0) {
    lines.push(`_+ ${overflow} more update${overflow > 1 ? 's' : ''}_`)
  }

  return lines.join('\n')
}

export function formatOutput(format: string, ctx: FormatContext): string {
  switch (format) {
    case 'github-release': return formatGitHubRelease(ctx)
    case 'changelog':      return formatChangelog(ctx)
    case 'slack':          return formatSlack(ctx)
    default: throw new Error(`Unknown format: ${format}. Use: github-release | changelog | slack`)
  }
}
