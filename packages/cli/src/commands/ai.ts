import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import * as readline from 'readline'
import { readConfig, updateConfig, writeConfig, getAnthropicKey } from '../lib/config.js'
import { handleError } from '../lib/errors.js'

// Future providers will be added here:
// type Provider = 'anthropic' | 'openai' | 'gemini'
// For now only Anthropic is supported.

async function promptKey(label: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve => {
    rl.question(chalk.bold(`  ${label}: `), answer => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function validateAnthropicKey(key: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
    })
    return res.ok
  } catch {
    return false
  }
}

export function registerAICommands(program: Command): void {
  const ai = program.command('ai').description('Manage AI provider keys')

  ai
    .command('add-key')
    .description('Save your Anthropic API key')
    // Future: .option('--provider <provider>', 'AI provider: anthropic | openai | gemini', 'anthropic')
    .action(async () => {
      try {
        console.log('')
        console.log(chalk.dim('  Get your key at: https://console.anthropic.com'))
        console.log('')

        const key = await promptKey('Anthropic API key')
        if (!key) {
          console.log(chalk.red('  ✖ No key provided.'))
          process.exit(1)
        }

        const spinner = ora('Validating key...').start()
        const valid = await validateAnthropicKey(key)

        if (!valid) {
          spinner.fail(chalk.red('Key validation failed. Check your key and try again.'))
          process.exit(1)
        }

        updateConfig({ anthropic_key: key, ai_provider: 'anthropic' })
        spinner.succeed(chalk.green('Anthropic API key saved.'))
        console.log('')

        // Future providers:
        // console.log(chalk.dim('  To use OpenAI: releasehub ai add-key --provider openai'))
        // console.log(chalk.dim('  To use Gemini: releasehub ai add-key --provider gemini'))
      } catch (err) {
        handleError(err)
      }
    })

  ai
    .command('remove-key')
    .description('Remove saved AI key')
    .action(() => {
      try {
        const config = readConfig()
        if (!config.anthropic_key) {
          console.log(chalk.yellow('No AI key found.'))
          return
        }
        delete config.anthropic_key
        delete config.ai_provider
        writeConfig(config)
        console.log(chalk.green('✔ AI key removed.'))
      } catch (err) {
        handleError(err)
      }
    })

  ai
    .command('status')
    .description('Check if an AI key is saved and valid')
    .action(async () => {
      try {
        console.log('')
        const key = getAnthropicKey()

        if (!key) {
          console.log(chalk.yellow('  No AI key found.'))
          console.log(chalk.dim('  Run: releasehub ai add-key'))
          console.log('')
          return
        }

        const source = process.env['RELEASEHUB_ANTHROPIC_KEY']
          ? 'env var (RELEASEHUB_ANTHROPIC_KEY)'
          : '~/.releasehub/config.json'

        const spinner = ora('Validating key...').start()
        const valid = await validateAnthropicKey(key)

        if (valid) {
          spinner.succeed(chalk.green(`AI key is valid`))
          console.log(chalk.dim(`  Provider : anthropic`))
          console.log(chalk.dim(`  Source   : ${source}`))
          console.log(chalk.dim(`  Key      : ${key.slice(0, 12)}...`))
        } else {
          spinner.fail(chalk.red('AI key is invalid or expired.'))
          console.log(chalk.dim('  Run: releasehub ai add-key'))
        }
        console.log('')
      } catch (err) {
        handleError(err)
      }
    })
}
