import { Command } from 'commander'
import chalk from 'chalk'
import { existsSync, unlinkSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { readConfig, getActiveProvider, AI_PROVIDER_LABELS } from '../lib/config.js'

const CONFIG_PATH = join(homedir(), '.releasehub', 'config.json')

function mask(value: string): string {
  if (value.length <= 8) return '••••••••'
  return value.slice(0, 4) + '••••••••' + value.slice(-4)
}

function status(value: string | undefined, label: string): string {
  if (!value) return chalk.dim(`  ${label.padEnd(18)} ${chalk.red('not set')}`)
  return `  ${label.padEnd(18)} ${chalk.green('set')} ${chalk.dim(mask(value))}`
}

export function registerConfigCommand(program: Command): void {
  const config = program
    .command('config')
    .description('Show or reset your local ReleaseHub configuration')
    .option('--reset', 'Delete the config file and start fresh')
    .action((options: { reset?: boolean }) => {
      if (options.reset) {
        if (existsSync(CONFIG_PATH)) {
          unlinkSync(CONFIG_PATH)
          console.log('')
          console.log(chalk.green('  ✓ Config reset.'))
          console.log(chalk.dim(`  Deleted: ${CONFIG_PATH}`))
          console.log(chalk.dim('  Run releasehub auth login and releasehub ai add-key to set up again.'))
          console.log('')
        } else {
          console.log('')
          console.log(chalk.dim('  No config file found — nothing to reset.'))
          console.log('')
        }
        return
      }

      const cfg = readConfig()
      const provider = getActiveProvider()

      console.log('')
      console.log(chalk.bold('  Configuration'))
      console.log(chalk.dim(`  ${CONFIG_PATH}`))
      console.log('')
      console.log(status(cfg.github_token, 'GitHub token'))
      console.log('')
      console.log(`  ${'AI provider'.padEnd(18)} ${chalk.cyan(AI_PROVIDER_LABELS[provider])}`)
      console.log(status(cfg.anthropic_key, 'Anthropic key'))
      console.log(status(cfg.openai_key, 'OpenAI key'))
      console.log('')
      if (cfg.default_format) {
        console.log(`  ${'Default format'.padEnd(18)} ${chalk.cyan(cfg.default_format)}`)
        console.log('')
      }
      console.log(chalk.dim('  releasehub config --reset   Delete config and start fresh'))
      console.log('')
    })

  return config as unknown as void
}
