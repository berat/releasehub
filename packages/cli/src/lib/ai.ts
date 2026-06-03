import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { getActiveProvider, getActiveAIKey } from './config.js'
import { AuthError, ApiError } from './errors.js'
import type { PullRequest } from './github.js'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChangeCategory = 'feature' | 'improvement' | 'bugfix' | 'breaking' | 'internal'

export interface AnalyzedChange {
  original_title: string
  rewritten_title: string
  category: ChangeCategory
  visible: boolean
  confidence: number
  reasoning: string
}

export interface AnalysisResult {
  changes: AnalyzedChange[]
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a release communication assistant for software teams.

Your job is to analyze a list of merged pull requests and:
1. Classify each PR into a category
2. Decide if it should be visible to end users
3. Rewrite the title in clear, non-technical language for users

## Categories
- feature: New capability that users can now use
- improvement: An existing feature is faster, easier, or more reliable
- bugfix: A problem that users experienced has been fixed
- breaking: A change that requires user action or breaks existing behavior
- internal: Technical change with no user-facing impact (hide from users)

## Rules
- Refactors → internal (always)
- Dependency updates → internal (always)
- CI/CD changes → internal (always)
- Test additions → internal (unless the PR title describes a new feature)
- Breaking changes → always visible, never hide them
- When unsure: lean toward showing rather than hiding

## Rewriting rules
- Remove all technical jargon
- Write for a non-technical end user
- Present tense, action verbs ("You can now...", "Fixed an issue where...")
- Max 80 characters per rewritten title

## Output format
Return a JSON array. One object per PR. No prose, no markdown, just raw JSON.
[
  {
    "original_title": "...",
    "rewritten_title": "...",
    "category": "feature|improvement|bugfix|breaking|internal",
    "visible": true,
    "confidence": 0.95,
    "reasoning": "one sentence"
  }
]`

function buildUserPrompt(prs: PullRequest[]): string {
  const list = prs.map(pr => {
    const labels = pr.labels.length ? `\nLabels: ${pr.labels.join(', ')}` : ''
    const issues = pr.linked_issues.length ? `\nLinked issues: ${pr.linked_issues.join(', ')}` : ''
    const body = pr.body ? `\nBody: ${pr.body.slice(0, 300)}` : ''
    return `#${pr.number}: ${pr.title}${labels}${issues}${body}`
  }).join('\n\n')
  return `Analyze these ${prs.length} pull requests:\n\n${list}`
}

function parseResponse(raw: string): AnalyzedChange[] {
  const cleaned = raw.replace(/```(?:json)?\n?/g, '').trim()
  return JSON.parse(cleaned) as AnalyzedChange[]
}

// ─── Providers ────────────────────────────────────────────────────────────────

const ANTHROPIC_MODEL = 'claude-sonnet-4-5'
const OPENAI_MODEL = 'gpt-4o'
const BATCH_SIZE = 20

async function analyzeWithAnthropic(prs: PullRequest[]): Promise<AnalyzedChange[]> {
  const key = getActiveAIKey()
  if (!key) throw new AuthError('No Anthropic key found. Run: releasehub ai add-key')

  const client = new Anthropic({ apiKey: key })
  const results: AnalyzedChange[] = []

  for (let i = 0; i < prs.length; i += BATCH_SIZE) {
    const batch = prs.slice(i, i + BATCH_SIZE)
    const message = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(batch) }],
    })
    const content = message.content[0]
    if (!content || content.type !== 'text') throw new ApiError('Unexpected response from Anthropic API')
    results.push(...parseResponse(content.text))
  }

  return results
}

async function analyzeWithOpenAI(prs: PullRequest[]): Promise<AnalyzedChange[]> {
  const key = getActiveAIKey()
  if (!key) throw new AuthError('No OpenAI key found. Run: releasehub ai add-key')

  const client = new OpenAI({ apiKey: key })
  const results: AnalyzedChange[] = []

  for (let i = 0; i < prs.length; i += BATCH_SIZE) {
    const batch = prs.slice(i, i + BATCH_SIZE)
    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(batch) },
      ],
      response_format: { type: 'json_object' },
    })
    const content = completion.choices[0]?.message?.content
    if (!content) throw new ApiError('Unexpected response from OpenAI API')
    const parsed = JSON.parse(content) as AnalyzedChange[] | { changes: AnalyzedChange[] }
    const changes = Array.isArray(parsed) ? parsed : parsed.changes
    results.push(...changes)
  }

  return results
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function analyzePullRequests(prs: PullRequest[]): Promise<AnalysisResult> {
  const provider = getActiveProvider()
  let changes: AnalyzedChange[]

  switch (provider) {
    case 'anthropic': changes = await analyzeWithAnthropic(prs); break
    case 'openai':    changes = await analyzeWithOpenAI(prs); break
    default: throw new ApiError(`Unsupported AI provider: ${provider}`)
  }

  const order: Record<ChangeCategory, number> = {
    breaking: 0, feature: 1, improvement: 2, bugfix: 3, internal: 4,
  }
  changes.sort((a, b) => (order[a.category] ?? 5) - (order[b.category] ?? 5))

  return { changes }
}
