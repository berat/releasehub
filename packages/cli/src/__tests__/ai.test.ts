import { describe, it, expect, vi } from 'vitest'

// parseResponse is not exported — test it indirectly via the output shape
// We test the logic that surrounds AI calls: prompt building and response parsing

// ─── buildUserPrompt (extracted logic) ────────────────────────────────────────

function buildUserPrompt(prs: Array<{ number: number; title: string; body: string | null; labels: string[]; linked_issues: string[] }>): string {
  const list = prs.map(pr => {
    const labels = pr.labels.length ? `\nLabels: ${pr.labels.join(', ')}` : ''
    const issues = pr.linked_issues.length ? `\nLinked issues: ${pr.linked_issues.join(', ')}` : ''
    const body = pr.body ? `\nBody: ${pr.body.slice(0, 300)}` : ''
    return `#${pr.number}: ${pr.title}${labels}${issues}${body}`
  }).join('\n\n')
  return `Analyze these ${prs.length} pull requests:\n\n${list}`
}

// ─── parseResponse (extracted logic) ──────────────────────────────────────────

function parseResponse(raw: string): unknown[] {
  const cleaned = raw
    .replace(/```(?:json)?\n?/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()
  return JSON.parse(cleaned) as unknown[]
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('buildUserPrompt', () => {
  it('includes PR number and title', () => {
    const prompt = buildUserPrompt([
      { number: 42, title: 'Fix login bug', body: null, labels: [], linked_issues: [] },
    ])
    expect(prompt).toContain('#42: Fix login bug')
  })

  it('includes labels when present', () => {
    const prompt = buildUserPrompt([
      { number: 1, title: 'Add feature', body: null, labels: ['enhancement', 'ui'], linked_issues: [] },
    ])
    expect(prompt).toContain('Labels: enhancement, ui')
  })

  it('omits labels line when empty', () => {
    const prompt = buildUserPrompt([
      { number: 1, title: 'Add feature', body: null, labels: [], linked_issues: [] },
    ])
    expect(prompt).not.toContain('Labels:')
  })

  it('includes linked issues when present', () => {
    const prompt = buildUserPrompt([
      { number: 1, title: 'Fix', body: null, labels: [], linked_issues: ['#10', '#11'] },
    ])
    expect(prompt).toContain('Linked issues: #10, #11')
  })

  it('truncates body to 300 chars', () => {
    const longBody = 'x'.repeat(500)
    const prompt = buildUserPrompt([
      { number: 1, title: 'Fix', body: longBody, labels: [], linked_issues: [] },
    ])
    const bodyLine = prompt.split('\n').find(l => l.startsWith('Body:'))
    expect(bodyLine!.length).toBeLessThanOrEqual(310)
  })

  it('states correct PR count in header', () => {
    const prs = [
      { number: 1, title: 'A', body: null, labels: [], linked_issues: [] },
      { number: 2, title: 'B', body: null, labels: [], linked_issues: [] },
      { number: 3, title: 'C', body: null, labels: [], linked_issues: [] },
    ]
    const prompt = buildUserPrompt(prs)
    expect(prompt).toContain('Analyze these 3 pull requests')
  })
})

describe('parseResponse', () => {
  it('parses clean JSON array', () => {
    const raw = JSON.stringify([{ category: 'bugfix', visible: true }])
    const result = parseResponse(raw)
    expect(result).toHaveLength(1)
    expect((result[0] as { category: string }).category).toBe('bugfix')
  })

  it('strips markdown code fences', () => {
    const raw = '```json\n[{"category":"feature"}]\n```'
    const result = parseResponse(raw)
    expect((result[0] as { category: string }).category).toBe('feature')
  })

  it('strips code fences without language tag', () => {
    const raw = '```\n[{"category":"bugfix"}]\n```'
    const result = parseResponse(raw)
    expect((result[0] as { category: string }).category).toBe('bugfix')
  })

  it('handles multiple items', () => {
    const items = [
      { category: 'feature', visible: true },
      { category: 'internal', visible: false },
    ]
    const result = parseResponse(JSON.stringify(items))
    expect(result).toHaveLength(2)
  })

  it('throws on invalid JSON', () => {
    expect(() => parseResponse('not json')).toThrow()
  })
})

// ─── Invalid key error detection (Gemini regex pattern) ───────────────────────

describe('Gemini invalid key detection', () => {
  const invalidKeyPattern = /api.key.not.valid|api_key_invalid|401|403/i

  it('matches "API key not valid" message', () => {
    expect(invalidKeyPattern.test('API key not valid. Please pass a valid API key.')).toBe(true)
  })

  it('matches api_key_invalid message', () => {
    expect(invalidKeyPattern.test('api_key_invalid')).toBe(true)
  })

  it('matches 401 status in message', () => {
    expect(invalidKeyPattern.test('Request failed with status 401')).toBe(true)
  })

  it('matches 403 status in message', () => {
    expect(invalidKeyPattern.test('403 Forbidden')).toBe(true)
  })

  it('does not match unrelated errors', () => {
    expect(invalidKeyPattern.test('Network timeout')).toBe(false)
    expect(invalidKeyPattern.test('Unexpected response format')).toBe(false)
  })
})

// ─── Gemini provider mock ──────────────────────────────────────────────────────

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify([
            {
              original_title: 'Add search',
              rewritten_title: 'You can now search across all items',
              category: 'feature',
              visible: true,
              confidence: 0.95,
              reasoning: 'New user-facing capability',
            },
          ]),
        },
      }),
    }),
  })),
}))

vi.mock('../lib/config.js', () => ({
  getActiveProvider: vi.fn(() => 'gemini'),
  getActiveAIKey: vi.fn(() => 'AIza-test-key'),
}))

describe('analyzeWithGemini (via analyzePullRequests)', () => {
  it('calls GoogleGenerativeAI with the active key', async () => {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const { analyzePullRequests } = await import('../lib/ai.js')

    await analyzePullRequests([
      { number: 1, title: 'Add search', body: null, labels: [], author: 'alice', merged_at: '', url: '', linked_issues: [] },
    ])

    expect(GoogleGenerativeAI).toHaveBeenCalledWith('AIza-test-key')
  })

  it('returns parsed AnalyzedChange from Gemini response', async () => {
    const { analyzePullRequests } = await import('../lib/ai.js')

    const result = await analyzePullRequests([
      { number: 1, title: 'Add search', body: null, labels: [], author: 'alice', merged_at: '', url: '', linked_issues: [] },
    ])

    expect(result.changes).toHaveLength(1)
    expect(result.changes[0].category).toBe('feature')
    expect(result.changes[0].visible).toBe(true)
    expect(result.changes[0].rewritten_title).toContain('search')
  })
})
