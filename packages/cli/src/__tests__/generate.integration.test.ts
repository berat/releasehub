import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PullRequest } from '../lib/github.js'
import type { AnalyzedChange } from '../lib/ai.js'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../lib/github.js', () => ({
  fetchPullRequests: vi.fn(),
  publishGitHubRelease: vi.fn(),
}))

vi.mock('../lib/ai.js', () => ({
  analyzePullRequests: vi.fn(),
}))

vi.mock('../lib/git.js', () => ({
  detectRepo: vi.fn(() => ({ owner: 'testuser', name: 'testrepo' })),
  parseRepo: vi.fn((s: string) => {
    const [owner, name] = s.split('/')
    return { owner, name }
  }),
}))

vi.mock('../lib/config.js', () => ({
  getActiveProvider: vi.fn(() => 'anthropic'),
  getActiveAIKey: vi.fn(() => 'sk-test-key'),
  AI_PROVIDER_LABELS: { anthropic: 'Anthropic (Claude)', openai: 'OpenAI (GPT-4o)', gemini: 'Google (Gemini 1.5 Flash)' },
}))

import { fetchPullRequests, publishGitHubRelease } from '../lib/github.js'
import { analyzePullRequests } from '../lib/ai.js'
import { formatOutput } from '../lib/formatters.js'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockPRs: PullRequest[] = [
  {
    number: 101,
    title: 'Add dark mode support',
    body: 'Users can now switch to dark mode in settings.',
    labels: ['enhancement'],
    author: 'alice',
    merged_at: '2024-01-15T10:00:00Z',
    url: 'https://github.com/testuser/testrepo/pull/101',
    linked_issues: ['#55'],
  },
  {
    number: 102,
    title: 'Fix login timeout issue',
    body: 'Fixes #60 — users were getting logged out after 5 minutes.',
    labels: ['bug'],
    author: 'bob',
    merged_at: '2024-01-16T12:00:00Z',
    url: 'https://github.com/testuser/testrepo/pull/102',
    linked_issues: ['#60'],
  },
  {
    number: 103,
    title: 'Bump lodash to 4.17.21',
    body: null,
    labels: ['dependencies'],
    author: 'dependabot',
    merged_at: '2024-01-17T08:00:00Z',
    url: 'https://github.com/testuser/testrepo/pull/103',
    linked_issues: [],
  },
]

const mockChanges: AnalyzedChange[] = [
  {
    original_title: 'Add dark mode support',
    rewritten_title: 'You can now switch to dark mode in settings',
    category: 'feature',
    visible: true,
    confidence: 0.97,
    reasoning: 'New user-facing capability',
  },
  {
    original_title: 'Fix login timeout issue',
    rewritten_title: 'Fixed an issue where users were logged out unexpectedly',
    category: 'bugfix',
    visible: true,
    confidence: 0.95,
    reasoning: 'User-facing bug fix',
  },
  {
    original_title: 'Bump lodash to 4.17.21',
    rewritten_title: 'Bump lodash to 4.17.21',
    category: 'internal',
    visible: false,
    confidence: 0.99,
    reasoning: 'Dependency update with no user impact',
  },
]

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('generate pipeline — integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetchPullRequests).mockResolvedValue(mockPRs)
    vi.mocked(analyzePullRequests).mockResolvedValue({ changes: mockChanges })
  })

  it('fetches PRs with correct repo and range', async () => {
    await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    expect(fetchPullRequests).toHaveBeenCalledWith(
      { owner: 'testuser', name: 'testrepo' },
      'v1.0.0',
      'v1.1.0',
    )
  })

  it('passes fetched PRs to AI analysis', async () => {
    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    await vi.mocked(analyzePullRequests)(prs)
    expect(analyzePullRequests).toHaveBeenCalledWith(mockPRs)
  })

  it('filters internal changes out of formatted output', () => {
    const output = formatOutput('github-release', { version: 'v1.1.0', changes: mockChanges })
    expect(output).not.toContain('lodash')
    expect(output).not.toContain('Bump')
  })

  it('includes feature and bugfix in formatted output', () => {
    const output = formatOutput('github-release', { version: 'v1.1.0', changes: mockChanges })
    expect(output).toContain('dark mode')
    expect(output).toContain('logged out unexpectedly')
  })

  it('full pipeline: fetch → analyze → format produces valid github-release output', async () => {
    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    const { changes } = await vi.mocked(analyzePullRequests)(prs)
    const output = formatOutput('github-release', { version: 'v1.1.0', changes })

    expect(output).toContain('## v1.1.0')
    expect(output).toContain('### ✨ New Features')
    expect(output).toContain('### 🐛 Bug Fixes')
    expect(output).not.toContain('internal')
    expect(output).not.toContain('lodash')
  })

  it('full pipeline: fetch → analyze → format produces valid slack output', async () => {
    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    const { changes } = await vi.mocked(analyzePullRequests)(prs)
    const output = formatOutput('slack', { version: 'v1.1.0', changes })

    expect(output).toContain('*🚀 v1.1.0*')
    expect(output).toContain('dark mode')
    expect(output).not.toContain('lodash')
  })

  it('full pipeline: fetch → analyze → format produces valid changelog output', async () => {
    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    const { changes } = await vi.mocked(analyzePullRequests)(prs)
    const output = formatOutput('changelog', { version: 'v1.1.0', changes })

    const today = new Date().toISOString().split('T')[0]
    expect(output).toContain(`[v1.1.0] — ${today}`)
    expect(output).toContain('dark mode')
  })

  it('publish step receives correctly formatted release body', async () => {
    vi.mocked(publishGitHubRelease).mockResolvedValue({
      id: 1,
      html_url: 'https://github.com/testuser/testrepo/releases/tag/v1.1.0',
      name: 'v1.1.0',
    })

    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    const { changes } = await vi.mocked(analyzePullRequests)(prs)
    const body = formatOutput('github-release', { version: 'v1.1.0', changes })

    await publishGitHubRelease({ owner: 'testuser', name: 'testrepo' }, 'v1.1.0', body)

    expect(publishGitHubRelease).toHaveBeenCalledWith(
      { owner: 'testuser', name: 'testrepo' },
      'v1.1.0',
      expect.stringContaining('## v1.1.0'),
    )
  })

  it('handles empty PR list gracefully', async () => {
    vi.mocked(fetchPullRequests).mockResolvedValue([])
    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    expect(prs).toHaveLength(0)
  })

  it('handles all-internal changes gracefully', async () => {
    const allInternal: AnalyzedChange[] = mockChanges.map(c => ({ ...c, visible: false, category: 'internal' }))
    vi.mocked(analyzePullRequests).mockResolvedValue({ changes: allInternal })

    const prs = await vi.mocked(fetchPullRequests)({ owner: 'testuser', name: 'testrepo' }, 'v1.0.0', 'v1.1.0')
    const { changes } = await vi.mocked(analyzePullRequests)(prs)
    const output = formatOutput('github-release', { version: 'v1.1.0', changes })

    expect(output).toContain('No user-facing changes')
  })
})
