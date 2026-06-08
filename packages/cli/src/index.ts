#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import { createRequire } from 'module'
import { registerAuthCommands } from './commands/auth.js'
import { registerAICommands } from './commands/ai.js'
import { registerGenerateCommand } from './commands/generate.js'

const require = createRequire(import.meta.url)
const { version } = require('../package.json') as { version: string }

const program = new Command()

program
  .name('releasehub')
  .description('AI-powered release notes from your terminal')
  .version(version, '-v, --version', 'Print version')
  .addHelpText('after', `
${chalk.bold('Getting started:')}
  ${chalk.dim('1.')} ${chalk.cyan('releasehub auth login')}      ${chalk.dim('Connect your GitHub account')}
  ${chalk.dim('2.')} ${chalk.cyan('releasehub ai add-key')}      ${chalk.dim('Add your AI provider key')}
  ${chalk.dim('3.')} ${chalk.cyan('releasehub generate ...')}    ${chalk.dim('Generate release notes')}

${chalk.bold('Examples:')}
  ${chalk.cyan('releasehub generate --from v2.3.0 --to v2.4.0')}
  ${chalk.cyan('releasehub generate --from v2.3.0 --to v2.4.0 --format slack')}
  ${chalk.cyan('releasehub generate --from v2.3.0 --to v2.4.0 --output release.md')}
  ${chalk.cyan('releasehub generate --from v2.3.0 --to v2.4.0 --publish')}

${chalk.dim('Docs: https://berat.app/releasehub/docs')}
  `)

registerAuthCommands(program)
registerAICommands(program)
registerGenerateCommand(program)

program.parse()
