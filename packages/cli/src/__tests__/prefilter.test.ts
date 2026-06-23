import { describe, it, expect } from 'vitest'
import { prefilterPRs } from '../lib/prefilter.js'
import type { PullRequest } from '../lib/github.js'

function pr(title: string, labels: string[] = []): PullRequest {
  return { number: 1, title, body: null, labels, author: 'a', merged_at: '', url: '', linked_issues: [] }
}

describe('prefilterPRs', () => {
  it('passes user-facing PRs through to toAnalyze', () => {
    const { toAnalyze, prefiltered } = prefilterPRs([pr('Add dark mode support')])
    expect(toAnalyze).toHaveLength(1)
    expect(prefiltered).toHaveLength(0)
  })

  it('pre-filters conventional commit chore prefix', () => {
    const { toAnalyze, prefiltered } = prefilterPRs([pr('chore: update eslint config')])
    expect(toAnalyze).toHaveLength(0)
    expect(prefiltered[0].category).toBe('internal')
  })

  it('pre-filters ci prefix', () => {
    const { prefiltered } = prefilterPRs([pr('ci: add node 20 to matrix')])
    expect(prefiltered).toHaveLength(1)
  })

  it('pre-filters bump commits', () => {
    const { prefiltered } = prefilterPRs([pr('bump lodash from 4.17.20 to 4.17.21')])
    expect(prefiltered).toHaveLength(1)
  })

  it('pre-filters dependabot PRs', () => {
    const { prefiltered } = prefilterPRs([pr('Bump axios from 1.0.0 to 1.1.0', ['dependabot'])])
    expect(prefiltered).toHaveLength(1)
  })

  it('pre-filters by dependencies label', () => {
    const { prefiltered } = prefilterPRs([pr('Update packages', ['dependencies'])])
    expect(prefiltered).toHaveLength(1)
  })

  it('pre-filtered items have visible: false', () => {
    const { prefiltered } = prefilterPRs([pr('chore: cleanup')])
    expect(prefiltered[0].visible).toBe(false)
    expect(prefiltered[0].confidence).toBe(1)
  })

  it('pre-filters refactor prefix', () => {
    const { prefiltered } = prefilterPRs([pr('refactor: extract auth middleware')])
    expect(prefiltered).toHaveLength(1)
  })

  it('does not pre-filter a real feature even with chore-like words', () => {
    const { toAnalyze } = prefilterPRs([pr('Add CI status badge to README')])
    expect(toAnalyze).toHaveLength(1)
  })

  it('handles mixed batch correctly', () => {
    const prs = [
      pr('Add search functionality'),
      pr('chore: bump node version'),
      pr('Fix login timeout bug'),
      pr('ci: update GitHub Actions workflow'),
    ]
    const { toAnalyze, prefiltered } = prefilterPRs(prs)
    expect(toAnalyze).toHaveLength(2)
    expect(prefiltered).toHaveLength(2)
  })
})
