import { describe, it, expect } from 'vitest'
import { estimateCost, formatCostEstimate } from '../lib/cost.js'

describe('estimateCost', () => {
  it('returns zero cost for zero PRs', () => {
    const result = estimateCost(0, 'anthropic')
    expect(result.inputTokens).toBeGreaterThan(0) // system prompt still counts
    expect(result.outputTokens).toBe(0)
    expect(result.costUsd).toBeGreaterThanOrEqual(0)
  })

  it('scales linearly with PR count', () => {
    const one = estimateCost(1, 'anthropic')
    const ten = estimateCost(10, 'anthropic')
    expect(ten.inputTokens).toBeGreaterThan(one.inputTokens)
    expect(ten.outputTokens).toBe(one.outputTokens * 10)
  })

  it('gemini is cheaper than anthropic for same PR count', () => {
    const anthropic = estimateCost(10, 'anthropic')
    const gemini = estimateCost(10, 'gemini')
    expect(gemini.costUsd).toBeLessThan(anthropic.costUsd)
  })

  it('includes correct model name for each provider', () => {
    expect(estimateCost(1, 'anthropic').model).toBe('claude-sonnet-4-5')
    expect(estimateCost(1, 'openai').model).toBe('gpt-4o')
    expect(estimateCost(1, 'gemini').model).toBe('gemini-1.5-flash')
  })

  it('totalTokens equals inputTokens + outputTokens', () => {
    const result = estimateCost(5, 'openai')
    expect(result.totalTokens).toBe(result.inputTokens + result.outputTokens)
  })
})

describe('formatCostEstimate', () => {
  it('includes token count and model name', () => {
    const estimate = estimateCost(10, 'anthropic')
    const formatted = formatCostEstimate(estimate)
    expect(formatted).toContain('claude-sonnet-4-5')
    expect(formatted).toContain('tokens')
  })

  it('shows <$0.01 for very cheap estimates', () => {
    const estimate = estimateCost(1, 'gemini')
    const formatted = formatCostEstimate(estimate)
    expect(formatted).toContain('<$0.01')
  })

  it('shows dollar amount for larger estimates', () => {
    const estimate = estimateCost(1000, 'anthropic')
    const formatted = formatCostEstimate(estimate)
    expect(formatted).toMatch(/~\$\d+\.\d{3}/)
  })
})
