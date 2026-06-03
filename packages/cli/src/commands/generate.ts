import { Command } from 'commander'
import chalk from 'chalk'

// M1: GitHub data ingestion
// M2: AI analysis
// M3: Output generation
// This command will be fully implemented across M1–M3.

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Generate release notes from merged pull requests')
    .requiredOption('--from <tag>', 'Start tag or date (e.g. v2.3.0 or 2026-05-01)')
    .requiredOption('--to <tag>', 'End tag or date (e.g. v2.4.0)')
    .option('--repo <repo>', 'Repository in owner/name format (defaults to git remote)')
    .option('--format <format>', 'Output format: github-release | changelog | slack', 'github-release')
    .option('--output <file>', 'Write output to a file instead of stdout')
    .option('--publish', 'Publish directly as a GitHub Release')
    .option('--quiet', 'Suppress progress messages (useful in CI)')
    .action((options: {
      from: string
      to: string
      repo?: string
      format: string
      output?: string
      publish?: boolean
      quiet?: boolean
    }) => {
      if (!options.quiet) {
        console.log('')
        console.log(chalk.dim('  releasehub generate'))
        console.log(chalk.dim(`  from   : ${options.from}`))
        console.log(chalk.dim(`  to     : ${options.to}`))
        console.log(chalk.dim(`  format : ${options.format}`))
        console.log('')
      }

      // TODO M1: fetch GitHub data
      // TODO M2: run AI analysis
      // TODO M3: generate output

      console.log(chalk.yellow('  ⚠ generate is not yet implemented.'))
      console.log(chalk.dim('  Coming in M1–M3. Follow progress at releasehub.app/roadmap'))
      console.log('')
      process.exit(0)
    })
}
