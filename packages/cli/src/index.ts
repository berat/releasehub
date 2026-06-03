#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import { registerAuthCommands } from './commands/auth.js'
import { registerAICommands } from './commands/ai.js'
import { registerGenerateCommand } from './commands/generate.js'

const program = new Command()

program
  .name('releasehub')
  .description('AI-powered release notes from your terminal')
  .version('0.1.0', '-v, --version', 'Print version')
  .addHelpText('after', `
${chalk.dim('Examples:')}
  ${chalk.cyan('releasehub auth login')}
  ${chalk.cyan('releasehub ai add-key')}
  ${chalk.cyan('releasehub generate --from v2.3.0 --to v2.4.0')}
  ${chalk.cyan('releasehub generate --from v2.3.0 --to v2.4.0 --format slack --quiet')}

${chalk.dim('Docs:')} https://releasehub.app/docs
  `)

registerAuthCommands(program)
registerAICommands(program)
registerGenerateCommand(program)

program.parse()
