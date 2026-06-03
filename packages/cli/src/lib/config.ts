import { homedir } from 'os'
import { join } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync } from 'fs'
import { ConfigError } from './errors.js'

const CONFIG_DIR = join(homedir(), '.releasehub')
const CONFIG_PATH = join(CONFIG_DIR, 'config.json')

export type AIProvider = 'anthropic' | 'openai'

export const AI_PROVIDERS: AIProvider[] = ['anthropic', 'openai']

export const AI_PROVIDER_LABELS: Record<AIProvider, string> = {
  anthropic: 'Anthropic (Claude)',
  openai: 'OpenAI (GPT-4o)',
}

export const AI_PROVIDER_KEY_URLS: Record<AIProvider, string> = {
  anthropic: 'https://console.anthropic.com',
  openai: 'https://platform.openai.com/api-keys',
}

export interface Config {
  github_token?: string
  ai_provider?: AIProvider
  anthropic_key?: string
  openai_key?: string
  default_format?: 'github-release' | 'changelog' | 'slack'
}

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true })
}

export function readConfig(): Config {
  ensureConfigDir()
  if (!existsSync(CONFIG_PATH)) return {}
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8')) as Config
  } catch {
    throw new ConfigError(`Failed to read config at ${CONFIG_PATH}`)
  }
}

export function writeConfig(config: Config): void {
  ensureConfigDir()
  try {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
    chmodSync(CONFIG_PATH, 0o600)
  } catch {
    throw new ConfigError(`Failed to write config at ${CONFIG_PATH}`)
  }
}

export function updateConfig(partial: Partial<Config>): void {
  writeConfig({ ...readConfig(), ...partial })
}

export function getGitHubToken(): string | undefined {
  return process.env['RELEASEHUB_GITHUB_TOKEN'] ?? readConfig().github_token
}

export function getAnthropicKey(): string | undefined {
  return process.env['RELEASEHUB_ANTHROPIC_KEY'] ?? readConfig().anthropic_key
}

export function getOpenAIKey(): string | undefined {
  return process.env['RELEASEHUB_OPENAI_KEY'] ?? readConfig().openai_key
}

export function getActiveProvider(): AIProvider {
  return readConfig().ai_provider ?? 'anthropic'
}

export function getActiveAIKey(): string | undefined {
  const provider = getActiveProvider()
  switch (provider) {
    case 'anthropic': return getAnthropicKey()
    case 'openai':    return getOpenAIKey()
  }
}

export function getKeyForProvider(provider: AIProvider): string | undefined {
  switch (provider) {
    case 'anthropic': return getAnthropicKey()
    case 'openai':    return getOpenAIKey()
  }
}
