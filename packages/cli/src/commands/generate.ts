import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { detectRepo, parseRepo } from '../lib/git.js'
import { fetchPullRequests, fetchTags } from '../lib/github.js'
import { handleError } from '../lib/errors.js'
import type { PullRequest } from '../lib/github.js'

export interface GenerateOptions {
  from: string
  to: string
  repo?: string
  format: string
  output?: string
  publish?: boolean
  quiet?: boolean
}

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Generate release notes from merged pull requests')
    .requiredOption('--from <tag>', 'Start tag (e.g. v2.3.0)')
    .requiredOption('--to <tag>', 'End tag (e.g. v2.4.0)')
    .option('--repo <repo>', 'Repository in owner/name format (defaults to git remote)')
    .option('--format <format>', 'Output format: github-release | changelog | slack', 'github-release')
    .option('--output <file>', 'Write output to a file instead of stdout')
    .option('--publish', 'Publish directly as a GitHub Release')
    .option('--quiet', 'Suppress progress messages (useful in CI)')
    .action(async (options: GenerateOptions) => {
      try {
        const log = (msg: string) => { if (!options.quiet) console.log(msg) }

        log('')

        // 1. Resolve repo
        const repo = options.repo ? parseRepo(options.repo) : detectRepo()
        log(chalk.dim(`  repo   : ${repo.owner}/${repo.name}`))
        log(chalk.dim(`  from   : ${options.from}`))
        log(chalk.dim(`  to     : ${options.to}`))
        log(chalk.dim(`  format : ${options.format}`))
        log('')

        // 2. Fetch PRs
        const spinner = ora({ text: 'Fetching pull requests...', isSilent: options.quiet }).start()
        const prs = await fetchPullRequests(repo, options.from, options.to)

        if (prs.length === 0) {
          spinner.warn(chalk.yellow('No merged pull requests found in this range.'))
          log('')
          process.exit(0)
        }

        spinner.succeed(`Fetched ${chalk.bold(prs.length)} pull requests`)

        // 3. TODO M2: AI analysis
        // For now, print raw PR list as a preview
        log('')
        log(chalk.bold('  Pull requests in this range:'))
        log('')
        for (const pr of prs) {
          const labels = pr.labels.length ? chalk.dim(` [${pr.labels.join(', ')}]`) : ''
          log(`  ${chalk.dim(`#${pr.number}`)} ${pr.title}${labels}`)
        }
        log('')
        log(chalk.yellow('  ⚠ AI analysis (M2) coming next — output generation not yet implemented.'))
        log(chalk.dim('  Follow progress at releasehub.app/roadmap'))
        log('')

      } catch (err) {
        handleError(err)
      }
    })
}

export type { PullRequest }
