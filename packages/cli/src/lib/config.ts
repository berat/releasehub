import { homedir } from 'os'
import { join } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync } from 'fs'
import { ConfigError } from './errors.js'

const CONFIG_DIR = join(homedir(), '.releasehub')
const CONFIG_PATH = join(CONFIG_DIR, 'config.json')

export type AIProvider = 'anthropic' // | 'openai' | 'gemini' — coming soon

export interface Config {
  github_token?: string
  anthropic_key?: string
  // Future providers:
  // openai_key?: string
  // gemini_key?: string
  default_format?: 'github-release' | 'changelog' | 'slack'
  ai_provider?: AIProvider
}

function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true })
  }
}

export function readConfig(): Config {
  ensureConfigDir()
  if (!existsSync(CONFIG_PATH)) return {}
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf-8')
    return JSON.parse(raw) as Config
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
  const current = readConfig()
  writeConfig({ ...current, ...partial })
}

// Env var takes precedence over config file
export function getGitHubToken(): string | undefined {
  return process.env['RELEASEHUB_GITHUB_TOKEN'] ?? readConfig().github_token
}

export function getAnthropicKey(): string | undefined {
  return process.env['RELEASEHUB_ANTHROPIC_KEY'] ?? readConfig().anthropic_key
}

// Future:
// export function getOpenAIKey(): string | undefined {
//   return process.env['RELEASEHUB_OPENAI_KEY'] ?? readConfig().openai_key
// }
// export function getGeminiKey(): string | undefined {
//   return process.env['RELEASEHUB_GEMINI_KEY'] ?? readConfig().gemini_key
// }

export function getAIKey(): string | undefined {
  const config = readConfig()
  const provider = config.ai_provider ?? 'anthropic'

  switch (provider) {
    case 'anthropic':
      return getAnthropicKey()
    // case 'openai':
    //   return getOpenAIKey()
    // case 'gemini':
    //   return getGeminiKey()
    default:
      return getAnthropicKey()
  }
}
