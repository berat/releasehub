import type { AIProvider } from './config.js'

// Approximate token counts based on real prompt structure
const SYSTEM_PROMPT_TOKENS = 350
const INPUT_TOKENS_PER_PR = 120  // title + labels + body snippet + formatting
const OUTPUT_TOKENS_PER_PR = 60  // JSON object per PR

// Pricing per 1M tokens (USD) — as of mid-2025
const PRICING: Record<AIProvider, { input: number; output: number; model: string }> = {
  anthropic: { input: 3.00,   output: 15.00, model: 'claude-sonnet-4-5' },
  openai:    { input: 2.50,   output: 10.00, model: 'gpt-4o' },
  gemini:    { input: 0.075,  output: 0.30,  model: 'gemini-1.5-flash' },
}

export interface CostEstimate {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  costUsd: number
  model: string
}

export function estimateCost(prCount: number, provider: AIProvider): CostEstimate {
  const inputTokens = SYSTEM_PROMPT_TOKENS + INPUT_TOKENS_PER_PR * prCount
  const outputTokens = OUTPUT_TOKENS_PER_PR * prCount
  const totalTokens = inputTokens + outputTokens

  const { input, output, model } = PRICING[provider]
  const costUsd = (inputTokens / 1_000_000) * input + (outputTokens / 1_000_000) * output

  return { inputTokens, outputTokens, totalTokens, costUsd, model }
}

export function formatCostEstimate(estimate: CostEstimate): string {
  const { inputTokens, outputTokens, totalTokens, costUsd, model } = estimate
  const costStr = costUsd < 0.01 ? '<$0.01' : `~$${costUsd.toFixed(3)}`
  return `~${totalTokens.toLocaleString()} tokens (${inputTokens.toLocaleString()} in / ${outputTokens.toLocaleString()} out) via ${model} — est. ${costStr}`
}
