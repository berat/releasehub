import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import * as readline from 'readline'
import {
  readConfig, updateConfig, writeConfig,
  getKeyForProvider, getActiveProvider,
  AI_PROVIDERS, AI_PROVIDER_LABELS, AI_PROVIDER_KEY_URLS,
  type AIProvider,
} from '../lib/config.js'
import { handleError } from '../lib/errors.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer.trim()) })
  })
}

function promptSelect(question: string, options: string[]): Promise<number> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    console.log('')
    console.log(chalk.bold(`  ${question}`))
    options.forEach((opt, i) => {
      console.log(`  ${chalk.dim(`${i + 1}.`)} ${opt}`)
    })
    console.log('')
    rl.question(chalk.bold('  Enter number: '), answer => {
      rl.close()
      const n = parseInt(answer.trim(), 10)
      resolve(isNaN(n) ? 0 : n - 1)
    })
  })
}

async function validateKey(provider: AIProvider, key: string): Promise<boolean> {
  try {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      })
      return res.ok
    }
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      })
      return res.ok
    }
    if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      )
      return res.ok
    }
    return false
  } catch {
    return false
  }
}

async function addKeyForProvider(provider: AIProvider): Promise<void> {
  console.log('')
  console.log(chalk.dim(`  Get your key at: ${AI_PROVIDER_KEY_URLS[provider]}`))
  console.log('')

  const key = await prompt(chalk.bold(`  ${AI_PROVIDER_LABELS[provider]} API key: `))
  if (!key) {
    console.log(chalk.red('  ✖ No key provided.'))
    process.exit(1)
  }

  const spinner = ora('Validating key...').start()
  const valid = await validateKey(provider, key)

  if (!valid) {
    spinner.fail(chalk.red('Key validation failed. Check your key and try again.'))
    process.exit(1)
  }

  const configKey = provider === 'anthropic' ? 'anthropic_key' : provider === 'openai' ? 'openai_key' : 'gemini_key'
  updateConfig({ [configKey]: key, ai_provider: provider })
  spinner.succeed(`${AI_PROVIDER_LABELS[provider]} key saved and set as active provider.`)
  console.log('')
  console.log(chalk.dim('  Next: releasehub generate --from <tag> --to <tag>'))
  console.log('')
}

// ─── Commands ─────────────────────────────────────────────────────────────────

export function registerAICommands(program: Command): void {
  const ai = program
    .command('ai')
    .description('Manage AI provider and keys')
    .addHelpText('after', `
${chalk.bold('Commands:')}
  ${chalk.cyan('releasehub ai add-key')}     ${chalk.dim('Add an Anthropic or OpenAI key')}
  ${chalk.cyan('releasehub ai switch')}      ${chalk.dim('Switch active AI provider')}
  ${chalk.cyan('releasehub ai remove-key')}  ${chalk.dim('Remove a saved key')}
  ${chalk.cyan('releasehub ai status')}      ${chalk.dim('Show provider status and validate keys')}
    `)

  // ── add-key ───────────────────────────────────────────────────────────────
  ai
    .command('add-key')
    .description('Add an AI provider key (select provider interactively)')
    .action(async () => {
      try {
        const idx = await promptSelect(
          'Which AI provider?',
          AI_PROVIDERS.map(p => AI_PROVIDER_LABELS[p]),
        )
        const provider = AI_PROVIDERS[idx]
        if (!provider) {
          console.log(chalk.red('  ✖ Invalid selection.'))
          process.exit(1)
        }
        await addKeyForProvider(provider)
      } catch (err) {
        handleError(err)
      }
    })

  // ── switch ────────────────────────────────────────────────────────────────
  ai
    .command('switch')
    .description('Switch active AI provider')
    .action(async () => {
      try {
        const current = getActiveProvider()
        console.log('')
        console.log(chalk.dim(`  Current provider: ${AI_PROVIDER_LABELS[current]}`))

        const idx = await promptSelect(
          'Switch to which provider?',
          AI_PROVIDERS.map(p => {
            const hasKey = !!getKeyForProvider(p)
            const active = p === current ? chalk.dim(' (current)') : ''
            const missing = !hasKey ? chalk.red(' (no key)') : ''
            return `${AI_PROVIDER_LABELS[p]}${active}${missing}`
          }),
        )

        const provider = AI_PROVIDERS[idx]
        if (!provider) { console.log(chalk.red('  ✖ Invalid selection.')); process.exit(1) }
        if (provider === current) { console.log(chalk.yellow(`  Already using ${AI_PROVIDER_LABELS[provider]}.`)); return }

        if (!getKeyForProvider(provider)) {
          console.log(chalk.yellow(`  No key saved for ${AI_PROVIDER_LABELS[provider]}.`))
          const answer = await prompt(chalk.bold('  Add key now? (y/n): '))
          if (answer.toLowerCase() === 'y') { await addKeyForProvider(provider); return }
          console.log(chalk.dim('  Cancelled.')); return
        }

        updateConfig({ ai_provider: provider })
        console.log(chalk.green(`✔ Switched to ${AI_PROVIDER_LABELS[provider]}.`))
        console.log('')
      } catch (err) {
        handleError(err)
      }
    })

  // ── remove-key ────────────────────────────────────────────────────────────
  ai
    .command('remove-key')
    .description('Remove a saved AI key')
    .action(async () => {
      try {
        const config = readConfig()
        const available = AI_PROVIDERS.filter(p => !!getKeyForProvider(p))
        if (available.length === 0) { console.log(chalk.yellow('No AI keys saved.')); return }

        const idx = await promptSelect(
          'Remove key for which provider?',
          available.map(p => AI_PROVIDER_LABELS[p]),
        )
        const provider = available[idx]
        if (!provider) { console.log(chalk.red('  ✖ Invalid selection.')); process.exit(1) }

        const configKey = provider === 'anthropic' ? 'anthropic_key' : provider === 'openai' ? 'openai_key' : 'gemini_key'
        delete config[configKey]
        if (config.ai_provider === provider) {
          const other = AI_PROVIDERS.find(p => p !== provider && !!getKeyForProvider(p))
          config.ai_provider = other
        }
        writeConfig(config)
        console.log(chalk.green(`✔ ${AI_PROVIDER_LABELS[provider]} key removed.`))
        console.log('')
      } catch (err) {
        handleError(err)
      }
    })

  // ── status ────────────────────────────────────────────────────────────────
  ai
    .command('status')
    .description('Show active provider and validate saved keys')
    .action(async () => {
      try {
        console.log('')
        const active = getActiveProvider()
        console.log(chalk.bold('  AI provider status'))
        console.log('')

        for (const provider of AI_PROVIDERS) {
          const key = getKeyForProvider(provider)
          const isActive = provider === active
          const activeTag = isActive ? chalk.bgBlue.white(' active ') + ' ' : '         '

          if (key) {
            const spinner = ora({ text: `Checking ${AI_PROVIDER_LABELS[provider]}...` }).start()
            const valid = await validateKey(provider, key)
            const source = (
              (provider === 'anthropic' && process.env['RELEASEHUB_ANTHROPIC_KEY']) ||
              (provider === 'openai' && process.env['RELEASEHUB_OPENAI_KEY']) ||
              (provider === 'gemini' && process.env['RELEASEHUB_GEMINI_KEY'])
            ) ? 'env var' : 'config'

            if (valid) {
              spinner.succeed(`${activeTag}${chalk.green(AI_PROVIDER_LABELS[provider])} — valid ${chalk.dim(`(${source}, ${key.slice(0, 10)}...)`)}`)
            } else {
              spinner.fail(`${activeTag}${chalk.red(AI_PROVIDER_LABELS[provider])} — invalid or expired`)
            }
          } else {
            console.log(`  ${activeTag}${chalk.dim(AI_PROVIDER_LABELS[provider])} — ${chalk.yellow('no key saved')}`)
          }
        }

        console.log('')
        console.log(chalk.dim('  releasehub ai add-key   — add a key'))
        console.log(chalk.dim('  releasehub ai switch    — switch provider'))
        console.log('')
      } catch (err) {
        handleError(err)
      }
    })
}
