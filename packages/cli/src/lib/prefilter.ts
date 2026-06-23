import type { PullRequest } from './github.js'
import type { AnalyzedChange } from './ai.js'

// Patterns that are always internal - no need to send to AI
const INTERNAL_PATTERNS = [
  /^(chore|ci|build|test|tests|refactor|style|perf)(\(.+\))?:/i,
  /^bump\s/i,
  /^update\s.*(dep|dependencies|dependency|package)/i,
  /\bdependabot\b/i,
  /^merge\s(branch|pull\srequest)/i,
  /^(release|version)\s*v?\d/i,
  /\b(renovate|snyk)\b/i,
]

const INTERNAL_LABELS = ['dependencies', 'ci', 'chore', 'internal', 'skip-changelog']

export interface PrefilterResult {
  toAnalyze: PullRequest[]
  prefiltered: AnalyzedChange[]
}

export function prefilterPRs(prs: PullRequest[]): PrefilterResult {
  const toAnalyze: PullRequest[] = []
  const prefiltered: AnalyzedChange[] = []

  for (const pr of prs) {
    const isInternalByTitle = INTERNAL_PATTERNS.some(p => p.test(pr.title))
    const isInternalByLabel = pr.labels.some(l => INTERNAL_LABELS.includes(l.toLowerCase()))

    if (isInternalByTitle || isInternalByLabel) {
      prefiltered.push({
        original_title: pr.title,
        rewritten_title: pr.title,
        category: 'internal',
        visible: false,
        confidence: 1,
        reasoning: 'Pre-filtered: matched internal pattern',
      })
    } else {
      toAnalyze.push(pr)
    }
  }

  return { toAnalyze, prefiltered }
}
