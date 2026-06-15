import { describe, it, expect } from 'vitest'
import {
  formatGitHubRelease,
  formatChangelog,
  formatSlack,
  formatOutput,
} from '../lib/formatters.js'
import type { AnalyzedChange } from '../lib/ai.js'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const change = (overrides: Partial<AnalyzedChange> = {}): AnalyzedChange => ({
  original_title: 'fix something',
  rewritten_title: 'Fixed an issue with something',
  category: 'bugfix',
  visible: true,
  confidence: 0.95,
  reasoning: 'user-facing fix',
  ...overrides,
})

const feature = (title = 'You can now do something new') =>
  change({ category: 'feature', rewritten_title: title })

const bugfix = (title = 'Fixed an issue where X happened') =>
  change({ category: 'bugfix', rewritten_title: title })

const breaking = (title = 'Breaking: old behavior removed') =>
  change({ category: 'breaking', rewritten_title: title })

const internal = () =>
  change({ category: 'internal', visible: false, rewritten_title: 'Refactored internals' })

// ─── formatGitHubRelease ──────────────────────────────────────────────────────

describe('formatGitHubRelease', () => {
  it('renders version heading', () => {
    const out = formatGitHubRelease({ version: 'v1.2.0', changes: [feature()] })
    expect(out).toContain('## v1.2.0')
  })

  it('groups changes under correct headers', () => {
    const out = formatGitHubRelease({
      version: 'v1.0.0',
      changes: [feature(), bugfix(), breaking()],
    })
    expect(out).toContain('### ⚠️ Breaking Changes')
    expect(out).toContain('### ✨ New Features')
    expect(out).toContain('### 🐛 Bug Fixes')
  })

  it('filters out internal changes', () => {
    const out = formatGitHubRelease({
      version: 'v1.0.0',
      changes: [feature(), internal()],
    })
    expect(out).not.toContain('Refactored internals')
    expect(out).toContain('You can now do something new')
  })

  it('shows empty state when all changes are internal', () => {
    const out = formatGitHubRelease({ version: 'v1.0.0', changes: [internal()] })
    expect(out).toContain('No user-facing changes')
  })

  it('includes summary sentence', () => {
    const out = formatGitHubRelease({
      version: 'v1.0.0',
      changes: [feature(), bugfix()],
    })
    expect(out).toContain('This release includes')
  })

  it('puts breaking changes before features', () => {
    const out = formatGitHubRelease({
      version: 'v1.0.0',
      changes: [feature(), breaking()],
    })
    const breakingPos = out.indexOf('Breaking Changes')
    const featurePos = out.indexOf('New Features')
    expect(breakingPos).toBeLessThan(featurePos)
  })
})

// ─── formatChangelog ──────────────────────────────────────────────────────────

describe('formatChangelog', () => {
  it('includes today\'s date', () => {
    const today = new Date().toISOString().split('T')[0]
    const out = formatChangelog({ version: 'v1.0.0', changes: [feature()] })
    expect(out).toContain(today)
  })

  it('renders version in Keep a Changelog format', () => {
    const out = formatChangelog({ version: 'v1.0.0', changes: [feature()] })
    expect(out).toMatch(/## \[v1\.0\.0\]/)
  })

  it('filters out internal changes', () => {
    const out = formatChangelog({ version: 'v1.0.0', changes: [feature(), internal()] })
    expect(out).not.toContain('Refactored internals')
  })

  it('shows empty state when all changes are internal', () => {
    const out = formatChangelog({ version: 'v1.0.0', changes: [internal()] })
    expect(out).toContain('No user-facing changes')
  })
})

// ─── formatSlack ──────────────────────────────────────────────────────────────

describe('formatSlack', () => {
  it('starts with bold version', () => {
    const out = formatSlack({ version: 'v1.0.0', changes: [feature()] })
    expect(out).toContain('*🚀 v1.0.0*')
  })

  it('filters out internal changes', () => {
    const out = formatSlack({ version: 'v1.0.0', changes: [feature(), internal()] })
    expect(out).not.toContain('Refactored internals')
  })

  it('always shows breaking changes', () => {
    const manyFeatures = Array.from({ length: 10 }, (_, i) => feature(`Feature ${i}`))
    const out = formatSlack({
      version: 'v1.0.0',
      changes: [breaking(), ...manyFeatures],
    })
    expect(out).toContain('Breaking: old behavior removed')
  })

  it('caps output at 6 items with overflow message', () => {
    const changes = Array.from({ length: 10 }, (_, i) => feature(`Feature ${i}`))
    const out = formatSlack({ version: 'v1.0.0', changes })
    expect(out).toContain('+ 4 more updates')
  })

  it('shows empty state when all changes are internal', () => {
    const out = formatSlack({ version: 'v1.0.0', changes: [internal()] })
    expect(out).toContain('No user-facing changes')
  })

  it('truncates long titles at 80 chars', () => {
    const longTitle = 'A'.repeat(100)
    const out = formatSlack({ version: 'v1.0.0', changes: [feature(longTitle)] })
    const lines = out.split('\n').filter(l => l.includes('A'))
    expect(lines[0].length).toBeLessThanOrEqual(90) // emoji + space + 80 chars
  })
})

// ─── formatOutput ─────────────────────────────────────────────────────────────

describe('formatOutput', () => {
  it('dispatches to github-release', () => {
    const out = formatOutput('github-release', { version: 'v1.0.0', changes: [feature()] })
    expect(out).toContain('## v1.0.0')
  })

  it('dispatches to changelog', () => {
    const out = formatOutput('changelog', { version: 'v1.0.0', changes: [feature()] })
    expect(out).toContain('[v1.0.0]')
  })

  it('dispatches to slack', () => {
    const out = formatOutput('slack', { version: 'v1.0.0', changes: [feature()] })
    expect(out).toContain('🚀')
  })

  it('throws on unknown format', () => {
    expect(() =>
      formatOutput('unknown', { version: 'v1.0.0', changes: [] })
    ).toThrow('Unknown format')
  })
})
