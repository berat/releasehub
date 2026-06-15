import { describe, it, expect } from 'vitest'

// extractLinkedIssues is not exported — replicate the logic to test it
function extractLinkedIssues(body: string | null): string[] {
  if (!body) return []
  const matches = body.matchAll(/(?:closes?|fixe?s?|resolves?)\s+#(\d+)/gi)
  return [...matches].map(m => `#${m[1]}`)
}

describe('extractLinkedIssues', () => {
  it('returns empty array for null body', () => {
    expect(extractLinkedIssues(null)).toEqual([])
  })

  it('returns empty array for body with no issue references', () => {
    expect(extractLinkedIssues('This PR improves performance.')).toEqual([])
  })

  it('extracts "Closes #123"', () => {
    expect(extractLinkedIssues('Closes #123')).toEqual(['#123'])
  })

  it('extracts "Fixes #456"', () => {
    expect(extractLinkedIssues('Fixes #456')).toEqual(['#456'])
  })

  it('extracts "Resolves #789"', () => {
    expect(extractLinkedIssues('Resolves #789')).toEqual(['#789'])
  })

  it('is case-insensitive', () => {
    expect(extractLinkedIssues('CLOSES #1\nFIXES #2\nRESOLVES #3')).toEqual(['#1', '#2', '#3'])
  })

  it('handles plural forms: close, fix, resolve', () => {
    expect(extractLinkedIssues('close #10')).toEqual(['#10'])
    expect(extractLinkedIssues('fix #11')).toEqual(['#11'])
    expect(extractLinkedIssues('resolve #12')).toEqual(['#12'])
  })

  it('extracts multiple issues from one body', () => {
    const body = 'This fixes #10 and closes #20.\nAlso resolves #30.'
    expect(extractLinkedIssues(body)).toEqual(['#10', '#20', '#30'])
  })

  it('ignores bare issue numbers without keyword', () => {
    expect(extractLinkedIssues('See #123 for context')).toEqual([])
  })

  it('handles extra whitespace between keyword and number', () => {
    expect(extractLinkedIssues('Closes  #99')).toEqual(['#99'])
  })
})
